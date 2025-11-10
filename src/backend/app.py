from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize extensions
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Configure CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Configure the app
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-change-in-prod')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-change-in-prod')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # Tokens don't expire

    jwt.init_app(app)

    try:
        # Setup MongoDB connection
        mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/cpdlc')
        client = MongoClient(mongo_uri)
        # Verify connection
        client.admin.command('ismaster')
        db = client.get_database('cpdlc')
        
        # Add database to app context
        app.mongo = db
        
    except ConnectionFailure:
        print("Failed to connect to MongoDB. Make sure MongoDB is running.")
        return None
        
    # Import and register blueprints
    from .routes.auth_routes import bp as auth_routes
    from .routes.message_routes import bp as message_routes
    from .routes.airspace_routes import bp as airspace_routes
    
    print(f"Registering auth_routes: {auth_routes.name}")
    app.register_blueprint(auth_routes)
    print(f"Registering message_routes: {message_routes.name}")
    app.register_blueprint(message_routes)
    print(f"Registering airspace_routes: {airspace_routes.name}")
    app.register_blueprint(airspace_routes)
    
    return app