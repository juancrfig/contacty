from .db import db

class Contacts(db.Model):
    __tablename__ = 'contacts'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(40), nullable=False)
    favorite = db.Column(db.Boolean, nullable=False, default=False)

    # 🔑 Foreign key to link to the User table
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Relationship back to User (optional, for ORM navigation)
    user = db.relationship("User", back_populates="contacts")
