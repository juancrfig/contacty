from marshmallow import Schema, fields


class ContactSchema(Schema):
    id = fields.Str(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    email = fields.Email(required=True)
    favorite = fields.Boolean(required=True)
    profile_image_url = fields.Url(required=False)

class ContactUpdateSchema(Schema):
    email = fields.Email(required=True)
    favorite = fields.Boolean(required=False)
    profile_image_url = fields.Url(required=False)

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    email = fields.Email(required=False)
    is_verified = fields.Boolean(dump_only=True)

class UserRegisterSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    email = fields.Email(required=True)

class UserVerificationSchema(Schema):
    username = fields.Str(required=True)
    verification_code = fields.Str(required=True)