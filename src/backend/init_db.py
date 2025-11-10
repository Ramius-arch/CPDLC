from pymongo import MongoClient, ASCENDING
import os
from dotenv import load_dotenv
import bcrypt

def init_db():
    # Load environment variables
    load_dotenv()
    
    # Connect to MongoDB
    mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/cpdlc')
    client = MongoClient(mongo_uri)
    db = client.get_database('cpdlc')
    
    # Create collections if they don't exist
    if 'users' not in db.list_collection_names():
        db.create_collection('users')
    if 'messages' not in db.list_collection_names():
        db.create_collection('messages')
    
    # Create indexes
    db.users.create_index([('username', ASCENDING)], unique=True)
    db.users.create_index([('email', ASCENDING)], unique=True)
    db.messages.create_index([('created_at', ASCENDING)])
    db.messages.create_index([('sender_id', ASCENDING)])
    db.messages.create_index([('receiver_id', ASCENDING)])
    
    # Create default users if they don't exist
    default_users = [
        {
            'username': 'pilot1',
            'email': 'pilot1@example.com',
            'password': 'pilot123',
            'role': 'pilot'
        },
        {
            'username': 'atc1',
            'email': 'atc1@example.com',
            'password': 'atc123',
            'role': 'atc'
        }
    ]
    
    for user in default_users:
        if not db.users.find_one({'username': user['username']}):
            user['password_hash'] = bcrypt.hashpw(user['password'].encode('utf-8'), bcrypt.gensalt())
            del user['password']
            db.users.insert_one(user)
    
    print("Database initialized successfully")