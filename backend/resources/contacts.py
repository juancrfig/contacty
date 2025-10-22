from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import g
from backend.models.db import db
from backend.models.contacts import Contacts
from backend.resources.schemas import ContactUpdateSchema, ContactImageSchema
from backend.resources.supabase_auth import supabase_auth_required
from .schemas import ContactSchema
from sqlalchemy.exc import SQLAlchemyError


blp = Blueprint("contacts", __name__, description="Operations related to contacts")


@blp.route("/test-auth")
class AuthTest(MethodView):
    @supabase_auth_required
    def get(self):
        """A simple endpoint to verify JWT authentication."""
        current_user_id = g.user_id
        return {"message": "Authentication successful!", "user_id": current_user_id}

@blp.route("/contacts")
class ContactList(MethodView):

    @supabase_auth_required
    @blp.response(200, ContactSchema(many=True))
    def get(self):
        """Retrieves all contacts for the current user, optionally filtering favorites"""
        favorite_param = request.args.get("favorite")  # e.g., ?favorite=true
        current_user_id = g.user_id # Get user id from JWT

        query = Contacts.query.filter_by(user_id=current_user_id)

        if favorite_param is not None:
            is_fav = favorite_param.lower() == "true"
            query = query.filter_by(favorite=True)

        return query.all()

    @supabase_auth_required
    @blp.arguments(ContactSchema)
    @blp.response(201, ContactSchema)
    def post(self, contact_data):
        """Creates a new contact"""
        # The database can enforce email uniqueness, which is more reliable
        user_id = g.user_id

        if Contacts.query.filter(Contacts.email == contact_data["email"]).first():
            abort(409, message="A contact with that email already exists")

        contact_data["user_id"] = user_id
        contact = Contacts(**contact_data)

        try:
            db.session.add(contact)
            db.session.commit()
        except SQLAlchemyError as e:
            abort(409, message=f"There was a problem creating a new contact: {e}")

        return contact

@blp.route("/contacts/<int:contact_id>")
class Contact(MethodView):

    @supabase_auth_required
    @blp.response(200, ContactSchema)
    def delete(self, contact_id):
        """Deletes a contact by its ID"""
        contact = Contacts.query.get_or_404(contact_id)
        db.session.delete(contact)
        db.session.commit()
        # A 204 response is standard for successful deletion with no content to return
        return {"message": "Contact deleted successfully"}, 200


    @supabase_auth_required
    @blp.response(200, ContactSchema)
    def patch(self, contact_id):
        """Updates an existing contact's favorite state by ID"""
        contact = Contacts.query.get_or_404(contact_id)

        contact.favorite = not contact.favorite


        db.session.add(contact)
        db.session.commit()

        return contact


@blp.route("/contacts/<int:contact_id>/url")
class ContactImage(MethodView):

    @supabase_auth_required
    @blp.arguments(ContactImageSchema)
    @blp.response(200, ContactSchema)
    def patch(self, data, contact_id):
        """Updates a contact's profile image URL"""
        contact = Contacts.query.get_or_404(contact_id)

        # make sure the contact belongs to the logged-in user
        current_user_id = int(g.user_id)
        if contact.user_id != current_user_id:
            abort(403, message="You are not authorized to update this contact.")

        contact.profile_image_url = data["url"]

        try:
            db.session.add(contact)
            db.session.commit()
        except SQLAlchemyError as e:
            abort(400, message=f"Error updating contact image: {e}")

        return contact
