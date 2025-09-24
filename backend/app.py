import os, secrets, datetime
from flask import Flask
from flask_smorest import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from backend.resources.jwt_security import jwt_required_handler
from backend.resources.contacts import blp as contacts_blueprint
from backend.resources.users import blp as users_blueprint
from backend.models.db import db


# Load password from env
PASSWORD = os.getenv("DB_PASS")
DATABASE_URL = (
    f"postgresql+psycopg2://postgres.dyinicotlnxqvpoasslg:{PASSWORD}"
    "@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
)

# Factory Pattern
def create_app(db_url=None):
    app = Flask(__name__)

    CORS(app, supports_credentials=True, origins=["https://contacty-sand.vercel.app", "https://192.168.20.54:3000"])

    is_production = os.environ.get("FLASK_ENV") == "production"

    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]

    if is_production:
        # Production settings
        app.config["JWT_COOKIE_SECURE"] = True
        app.config["JWT_COOKIE_SAMESITE"] = "None"
    else:
        # Development settings
        app.config["JWT_COOKIE_SECURE"] = False
        app.config["JWT_COOKIE_SAMESITE"] = "Lax"


    key = os.getenv("JWT_SECRET_KEY")
    if not key:
        raise ValueError("JWT_SECRET_KEY is not set in the environment")
    app.config["JWT_SECRET_KEY"] = key

    app.config["JWT_COOKIE_CSRF_PROTECT"] = False
    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["API_TITLE"] = "Contact App REST API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    Migrate(app, db)
    api = Api(app)

    app.config["JWT_SECRET_KEY"] = secrets.token_urlsafe(15)

    jwt = JWTManager(app)
    jwt_required_handler(jwt)

    with app.app_context():
        db.create_all()

    api.register_blueprint(users_blueprint)
    api.register_blueprint(contacts_blueprint)

    return app
