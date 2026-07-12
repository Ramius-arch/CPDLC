import pytest
from flask import Flask
from bson import ObjectId
from unittest.mock import patch
import sys
import os
import re

# Adjust path to find src/backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src/backend')))

from app import create_app
from app.routes.auth_routes import generate_mode_s

class MockCollection:
    def __init__(self):
        self.data = []
    
    def find_one(self, query):
        for item in self.data:
            match = True
            for k, v in query.items():
                # handle simple operator mapping if query has keys starting with $ (not needed for these tests)
                if item.get(k) != v:
                    match = False
                    break
            if match:
                return item
        return None
        
    def insert_one(self, item):
        if '_id' not in item:
            item['_id'] = ObjectId()
        self.data.append(item)
        class InsertResult:
            inserted_id = item['_id']
        return InsertResult()

class MockDB:
    def __init__(self):
        self.users = MockCollection()
        self.messages = MockCollection()
    def get_database(self, name):
        return self

class MockClient:
    def __init__(self, *args, **kwargs):
        self.db = MockDB()
    def get_database(self, name):
        return self.db

@pytest.fixture
def app():
    # Mock MongoClient with our clean dependency-free MockClient
    with patch('app.MongoClient', new=MockClient):
        # Configure app with test environment
        app = create_app()
        app.config['TESTING'] = True
        app.config['JWT_SECRET_KEY'] = 'test-jwt-secret'
        
        yield app

@pytest.fixture
def client(app):
    return app.test_client()

def test_generate_mode_s():
    code = generate_mode_s()
    assert len(code) == 6
    assert code.startswith("C0A")
    int(code, 16) # Should be valid hex

def test_pilot_registration_success(client, app):
    response = client.post('/api/auth/register', json={
        'username': 'DL456',
        'email': 'dl456@delta.com',
        'password': 'password123',
        'role': 'pilot',
        'mode_s_address': 'A1B2C3'
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data['mode_s_address'] == 'A1B2C3'
    
    # Check database
    user = app.mongo.users.find_one({'username': 'DL456'})
    assert user is not None
    assert user['mode_s_address'] == 'A1B2C3'

def test_controller_registration_fails_missing_designator(client):
    response = client.post('/api/auth/register', json={
        'username': 'EGTT_CTRL',
        'email': 'controller@atc.net',
        'password': 'password123',
        'role': 'controller'
    })
    assert response.status_code == 400
    assert 'Facility designator is required' in response.get_json()['error']

def test_controller_registration_fails_invalid_designator(client):
    response = client.post('/api/auth/register', json={
        'username': 'EGTT_CTRL',
        'email': 'controller@atc.net',
        'password': 'password123',
        'role': 'controller',
        'facility_designator': 'EGT1'  # numbers not allowed in 4-letter ICAO
    })
    assert response.status_code == 400
    assert 'must be a 4-letter ICAO' in response.get_json()['error']
