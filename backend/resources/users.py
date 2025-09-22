from flask import jsonify
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import create_access_token, jwt_required, set_access_cookies, unset_jwt_cookies

from backend.models.db import db
from backend.models.users import User
from backend.resources.schemas import UserSchema, UserRegisterSchema, UserVerificationSchema
from backend.services.email_service import send_verification_email, generate_verification_code


blp = Blueprint("Users", "users", description="Operations on users")

@blp.route("/register")
class UserRegister(MethodView):
    @blp.arguments(UserRegisterSchema)
    def post(self, user_data):
        if User.query.filter(User.username == user_data["username"]).first():
            abort(409, message="Username already exists")
        if User.query.filter(User.email == user_data["email"]).first():
            abort(409, message="Email already exists")

        verification_code = generate_verification_code()

        user = User(
            username=user_data["username"],
            email=user_data["email"],
            password=user_data["password"]
        )
        user.verification_code = verification_code

        try:
            db.session.add(user)
            db.session.commit()

            send_verification_email(user.email, verification_code)

            return {"message": "User created. A verification code has been sent to your email!"}, 201
        except Exception as e:
            db.session.rollback()
            abort(500, message=f"Failed to send verification email to {user.email}: {e}")


@blp.route("/verify-email")
class UserEmailVerification(MethodView):
    @blp.arguments(UserVerificationSchema)
    def post(self, user_data):
        user = User.query.filter(User.username == user_data["username"]).first()

        if not user:
            abort(404, message="User not found")

        if user.is_verified:
            return {"message": "User already verified"}, 200

        if user.verification_code and user.verification_code == user_data["verification_code"]:
            user.is_verified = True
            user.verification_code = None
            db.session.commit()
            return {"message": "Email verified successfully!"}, 200
        else:
            abort(400, message="Invalid verification code")


@blp.route("/login")
class UserLogin(MethodView):
    @blp.arguments(UserSchema)
    def post(self, user_data):
        user = User.query.filter(
            User.username == user_data["username"],
        ).first()

        if user and user.check_password(user_data["password"]):
            access_token = create_access_token(identity=str(user.id))

            # Create a JSON response and set the HttpOnly cookie
            response = jsonify({"message": "Login successful"})
            set_access_cookies(response, access_token)

            return response, 200

        abort(401, message="Invalid username or password")


@blp.route("/user/<int:id>")
class UserUser(MethodView):
    """
    This resource can be useful when testing our Flask app.
    We may not want to expose it to public users, but it can be useful
    when we are manipulating data regarding the users.
    """

    @jwt_required()
    @blp.response(200, UserSchema)
    def get(self, id):
        user = User.query.get_or_404(id)
        return user

    @jwt_required()
    def delete(self, id):
        user = User.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted"}, 200


@blp.route("/logout")
class UserLogout(MethodView):
    def post(self):
        response = jsonify({"message": "Logout successful"})
        unset_jwt_cookies(response)
        return response, 200