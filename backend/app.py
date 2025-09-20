from flask import Flask, jsonify
from flask_smorest import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
import secrets
import datetime

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
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url or os.getenv("DATABASE_URL", "sqlite:///data.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # db.init_app(app)
    api = Api(app)

    app.config["JWT_SECRET_KEY"] = secrets.token_urlsafe(15)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(minutes=60)

    jwt = JWTManager(app)

    @jwt.expired_token_loader
    def expired_token_callback():
        return (
            jsonify({"message": "The token has expired", "error": "token_expired"}),
            401
        )

    @jwt.invalid_token_loader
    def invalid_token_callback():
        return (
            jsonify({"message": "Invalid token", "error": "invalid_token"}),
            401
        )

    @jwt.unauthorized_loader
    def missing_token_callback():
        return (
            jsonify({"message": "Missing token", "error": "missing_token"}),
            401
        )

    return app

