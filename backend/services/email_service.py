import os
import random
import requests

def generate_verification_code():
    """
    Generates a random 6-digit verification code.
    """
    return str(random.randint(100000, 999999))

def send_verification_email(to_email, verification_code):
    """
    Sends a verification email using the Brevo API.

    Args:
        to_email (str): The recipient's email address.
        verification_code (str): The 6-digit verification code.

    Returns:
        bool: True if the email was sent successfully, False otherwise.
    """
    url = "https://api.brevo.com/v3/smtp/email"
    payload = {
        "sender": {"email": os.getenv("BREVO_SENDER")},
        "to": [{"email": to_email}],
        "subject": "Your verification code",
        "htmlContent": f"<p>Your verification code is: <b>{verification_code}</b></p>"
    }
    headers = {
        "accept": "application/json",
        "api-key": os.getenv("BREVO_SMTP_KEY"),
        "content-type": "application/json"
    }
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        print(f"✅ Email sent to {to_email}")
        return True
    except Exception as e:
        print("EMAIL ERROR:", e)
        return False
