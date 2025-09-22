import os, secrets, datetime
from flask import Flask
from flask_smorest import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_migrate import Migrate
from backend.resources.jwt_security import jwt_required_handler
from backend.resources.contacts import blp as contacts_blueprint
from backend.resources.users import blp as users_blueprint
from backend.models.db import db

# Load password from env
PASSWORD = os.getenv("DB_PASS")

# Debugging logs (safe)
if PASSWORD:
    print("🔎 Render Debug -> DB_PASS length:", len(PASSWORD))
else:
    print("❌ Render Debug -> DB_PASS not found in environment variables")

DATABASE_URL = (
    f"postgresql+psycopg2://postgres.dyinicotlnxqvpoasslg:{PASSWORD}"
    "@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
)

print("🔎 Render Debug -> DATABASE_URL:", DATABASE_URL.replace(PASSWORD if PASSWORD else "", "*****"))

mail = Mail()

# Factory Pattern
def create_app(db_url=None):
    app = Flask(__name__)
    CORS(app)
    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["API_TITLE"] = "Contact App REST API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config["MAIL_SERVER"] = "smtp-relay.brevo.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USE_SSL"] = False
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USERNAME"] = os.getenv("BREVO_USERNAME")
    app.config["MAIL_PASSWORD"] = os.getenv("BREVO_SMTP_KEY")
    app.config["MAIL_DEFAULT_SENDER"] = os.getenv("BREVO_SENDER")

    db.init_app(app)
    Migrate(app, db)
    mail.init_app(app)
    api = Api(app)

    app.config["JWT_SECRET_KEY"] = secrets.token_urlsafe(15)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(minutes=60)

    jwt = JWTManager(app)
    jwt_required_handler(jwt)

    with app.app_context():
        db.create_all()

    api.register_blueprint(users_blueprint)
    api.register_blueprint(contacts_blueprint)

    return app
