from flask.views import MethodView
from flask_smorest import Blueprint

from backend.models.db import db
from backend.models.users import User
from backend.resources.schemas import UserSchema
from backend.resources.supabase_auth import supabase_auth_required


blp = Blueprint("Users", "users", description="Operations on users")

@blp.route("/user/<int:id>")
class UserUser(MethodView):
    """
    (Optional) Endpoint for retrieving or deleting user profiles
    based on their internal ID. Secured with Supabase auth.
    """

    @supabase_auth_required
    @blp.response(200, UserSchema)
    def get(self, id):
        user = User.query.get_or_404(id)
        return user

    @supabase_auth_required
    def delete(self, id):
        user = User.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted"}, 200