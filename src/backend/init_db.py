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
    db.messages.create_index([('timestamp', ASCENDING)])
    db.messages.create_index([('sender_id', ASCENDING)])
    db.messages.create_index([('recipient', ASCENDING)])
    
    # Create default users if they don't exist
    default_users = [
        {
            'username': 'pilot1',
            'email': 'pilot1@example.com',
            'password': 'pilot123',
            'role': 'pilot',
            'mode_s_address': 'C0A1F2'
        },
        {
            'username': 'atc1',
            'email': 'atc1@example.com',
            'password': 'atc123',
            'role': 'controller',
            'facility_designator': 'EGTT'
        }
    ]
    
    for user in default_users:
        if not db.users.find_one({'username': user['username']}):
            user['password_hash'] = bcrypt.hashpw(user['password'].encode('utf-8'), bcrypt.gensalt())
            del user['password']
            db.users.insert_one(user)
            
    # Seed messages if database is empty
    if db.messages.count_documents({}) == 0:
        pilot = db.users.find_one({'username': 'pilot1'})
        atc = db.users.find_one({'username': 'atc1'})
        
        if pilot and atc:
            from datetime import datetime, timedelta
            base_time = datetime.utcnow()
            
            mock_messages = [
                {
                    'sender_id': atc['_id'],
                    'sender_username': 'atc1',
                    'recipient': 'pilot1',
                    'content': 'CLIMB TO FL350',
                    'msg_code': 'UM19',
                    'seq_num': 0,
                    'ref_seq_num': None,
                    'status': 'delivered',
                    'timestamp': base_time - timedelta(minutes=10)
                },
                {
                    'sender_id': pilot['_id'],
                    'sender_username': 'pilot1',
                    'recipient': 'atc1',
                    'content': 'WILCO',
                    'msg_code': 'DM0',
                    'seq_num': 0,
                    'ref_seq_num': 0,
                    'status': 'delivered',
                    'timestamp': base_time - timedelta(minutes=9)
                },
                {
                    'sender_id': pilot['_id'],
                    'sender_username': 'pilot1',
                    'recipient': 'atc1',
                    'content': 'REQUEST FL370 DUE TURBULENCE',
                    'msg_code': 'DM6',
                    'seq_num': 1,
                    'ref_seq_num': None,
                    'status': 'delivered',
                    'timestamp': base_time - timedelta(minutes=5)
                },
                {
                    'sender_id': atc['_id'],
                    'sender_username': 'atc1',
                    'recipient': 'pilot1',
                    'content': 'DESCEND TO FL330 DUE TRAFFIC',
                    'msg_code': 'UM20',
                    'seq_num': 1,
                    'ref_seq_num': 1,
                    'status': 'delivered',
                    'timestamp': base_time - timedelta(minutes=4)
                },
                {
                    'sender_id': pilot['_id'],
                    'sender_username': 'pilot1',
                    'recipient': 'atc1',
                    'content': 'WILCO',
                    'msg_code': 'DM0',
                    'seq_num': 2,
                    'ref_seq_num': 1,
                    'status': 'delivered',
                    'timestamp': base_time - timedelta(minutes=3)
                },
                {
                    'sender_id': atc['_id'],
                    'sender_username': 'atc1',
                    'recipient': 'pilot1',
                    'content': 'CONTACT NEW YORK OCEAN CENTER 127.8',
                    'msg_code': 'UM117',
                    'seq_num': 2,
                    'ref_seq_num': None,
                    'status': 'delivered',
                    'timestamp': base_time - timedelta(minutes=1)
                }
            ]
            db.messages.insert_many(mock_messages)
            print("Database seeded with realistic ICAO CPDLC communications.")
    
    print("Database initialized successfully with compliant ICAO accounts.")

if __name__ == '__main__':
    init_db()