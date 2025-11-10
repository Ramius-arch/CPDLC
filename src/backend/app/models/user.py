from datetime import datetime
from bson import ObjectId

class User:
    def __init__(self, username, email, password_hash, role='pilot'):
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.role = role
        self.created_at = datetime.utcnow()
    
    @staticmethod
    def from_db_object(db_object):
        if not db_object:
            return None
        return User(
            username=db_object['username'],
            email=db_object['email'],
            password_hash=db_object['password_hash'],
            role=db_object.get('role', 'pilot')
        )
    
    def to_dict(self):
        return {
            'username': self.username,
            'email': self.email,
            'password_hash': self.password_hash,
            'role': self.role,
            'created_at': self.created_at
        }