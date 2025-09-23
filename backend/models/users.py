from passlib.hash import pbkdf2_sha256
from .db import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    verification_code = db.Column(db.String(6), nullable=True)

    # One-to-many relationship (User → Contacts)
    contacts = db.relationship("Contacts", back_populates="user", cascade="all, delete-orphan")

    def __init__(self, username, password, email):
        self.username = username
        self.password = pbkdf2_sha256.hash(password)
        self.email = email

    def check_password(self, password):
        return pbkdf2_sha256.verify(password, self.password)
