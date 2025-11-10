"""
Handles authentication and token generation for CPDLC system.

Implements secure password hashing and token-based authentication.
"""

from cryptography import hashing, hmac
import secrets

def hash_password(password):
    """Securely hashes a password using bcrypt."""
    salt = bcrypt.gensalt()
    hashed_pw = bcrypt.hashpw(password.encode(), salt)
    return hashed_pw.decode()

class CPDLCAuthentication:
    def __init__(self):
        pass

    def generate_auth_token(self, user_id):
        """Generates a JWT token for authentication."""
        payload = {'sub': user_id}
        token = jwt.encode(payload, self.secret_key, algorithm='HS256')
        return token

    def validate_auth_token(self, token):
        """Validates an auth token using HMAC."""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            return True
        except JWTError:
            return False
