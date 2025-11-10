from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask extensions
jwt = JWTManager()

# Initialize MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.cpdlc_db

def create_app():
    app = Flask(__name__)
    
    # Configure the app
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-change-in-prod')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-change-in-prod')
    
    # Initialize extensions
    CORS(app)
    jwt.init_app(app)
    
    # Setup MongoDB connection
    mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/cpdlc')
    client = MongoClient(mongo_uri)
    db = client.get_database('cpdlc')
    
    # Add database to app context
    app.mongo = db
    
    # Import and register blueprints
    from app.routes import auth_routes, message_routes
    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(message_routes.bp)
    
    return app