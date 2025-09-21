from flask import jsonify

def jwt_required_handler(jwt):
    # Configures all JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback():
        return (
            jsonify({"message": "The token has expired", "error": "token_expired"}),
            401
        )

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return (
            jsonify({"message": "Invalid token", "error": "invalid_token"}),
            401
        )

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return (
            jsonify({"message": "Missing token", "error": "missing_token"}),
            401
        )