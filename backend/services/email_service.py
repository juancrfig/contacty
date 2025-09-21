import random
from flask import current_app
from flask_mail import Message, Mail

def generate_verification_code():
    # Generates a random 6-digit verification code
    return str(random.randint(100000, 999999))

def send_verification_email(to_email, verification_code):
    with current_app.app_context():
        mail = current_app.extensions['mail']
        msg = Message(
            subject="Your verification code",
            recipients=[to_email],
            body=f"Your verification code is: {verification_code}",
            sender=current_app.config.get("MAIL_DEFAULT_SENDER")
        )
        try:
            mail.send(msg)
            print(f"Sending verification email to {to_email}")
            return True
        except Exception as e:
            print(f"Failed to send verification email to {to_email}: {e}")
            return False