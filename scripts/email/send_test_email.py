import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

# 1. Define credentials and message details
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 465))
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL")

# 2. Create the message object
msg = EmailMessage()
msg.set_content("This is a test email sent from Python!")
msg['Subject'] = "Python SMTP Test"
msg['From'] = SENDER_EMAIL
msg['To'] = RECEIVER_EMAIL

# 3. Send the email
try:
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
    print("Email sent successfully!")
except Exception as e:
    print(f"Error: {e}")
