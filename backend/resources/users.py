from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import create_access_token

from backend.models.db import db
from backend.models.users import User
from backend.resources.schemas import UserSchema


blp = Blueprint("Users", "users", description="Operations on users")

@blp.route("/register")
class UserRegister(MethodView):
    @blp.arguments(UserSchema)
    def post(self, user_data):
        if User.query.filter(User.username == user_data["username"]).first():
            abort(409, message="Username already exists")

        user = User(
            username=user_data["username"],
            password=user_data["password"]
        )
        db.session.add(user)
        db.session.commit()

        return {"message": "User created successfully"}, 201

@blp.route("/login")
class UserLogin(MethodView):
    @blp.arguments(UserSchema)
    def post(self, user_data):
        user = User.query.filter(
            User.username == user_data["username"],
        ).first()

        if user and user.check_password(user_data["password"]):
            access_token = create_access_token(identity=str(user.id))
            return {"access_token": access_token}, 200

        abort(401, message="Invalid username or password")


@blp.route("/user/<int:id>")
class UserUser(MethodView):
    """
    This resource can be useful when testing our Flask app.
    We may not want to expose it to public users, but it can be useful
    when we are manipulating data regarding the users.
    """

    @blp.response(200, UserSchema)
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        return user

    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted"}, 200