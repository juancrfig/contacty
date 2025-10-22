import os
import jwt # PyJWT library
from functools import wraps
from flask import request, g
from flask_smorest import abort
from backend.models.db import db
from backend.models.users import User


SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

if not SUPABASE_JWT_SECRET:
    raise ValueError("SUPABASE_JWT_SECRET environment variable not set.")

def supabase_auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            abort(401, message="Missing Authorization header")

        parts = auth_header.split()
        # Check for Bearer prefix and correct number of parts
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            abort(401, message="Invalid Authorization header format. Expected 'Bearer <token>'.")

        token = parts[1]

        try:
            # Decode the token using the secret and specify the algorithm
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"]
            )

            # Get the Supabase Auth UUID (subject) from the decoded token
            auth_user_uuid = payload.get('sub')
            if not auth_user_uuid:
                abort(401, message="Invalid token: missing 'sub' (subject)")

            # Find internal user using the Auth UUID
            user = User.query.filter_by(auth_user_id=auth_user_uuid).first()

            if not user:
                print(f"Auth user {auth_user_uuid} not found in public.users table.")
                abort(404, message="User profile not found for this authenticated user.")

            # Store internal user ID (the integer primary key) in Flask's request context (g)
            g.user_id = user.id
            print(f"Authenticated user: internal_id={g.user_id}, auth_uuid={auth_user_uuid}")

        except jwt.ExpiredSignatureError:
            abort(401, message="Token has expired")
        except jwt.InvalidTokenError as e:
            # Log the specific error for debugging
            print(f"Invalid token error: {e}")
            abort(401, message=f"Invalid token: {e}")
        except Exception as e:
            # Catch other potential errors during decoding/lookup
            print(f"Unexpected error during auth: {e}")
            abort(500, message="An internal error occurred during authentication.")

        return f(*args, **kwargs)
    return decorated_function