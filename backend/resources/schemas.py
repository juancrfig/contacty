from marshmallow import Schema, fields


class ContactSchema(Schema):
    id = fields.Str(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    email = fields.Email(required=True)
    favorite = fields.Boolean(required=True)

class ContactUpdateSchema(Schema):
    email = fields.Email(required=True)
    favorite = fields.Boolean(required=False)

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)