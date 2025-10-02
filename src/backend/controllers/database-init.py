
# Flask and extensions
from flask import Flask, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

# SQLAlchemy core
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import scoped_session, sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base

# Password hashing
import hashlib
from werkzeug.security import check_password_hash

# Other common imports
import os

Base = declarative_base()

engine = create_engine('sqlite:///cpdlc.db')
db_session = scoped_session(sessionmaker(bind=engine))

engine = create_engine('sqlite:///cpdlc.db')
db_session = scoped_session(sessionmaker(bind=engine))

class Database:
    @staticmethod
    def init():
        with engine.connect() as connection:
            connection.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR UNIQUE, password_hash TEXT, role TEXT, last_login DATETIME, status TEXT)")
            connection.execute("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTO_INCREMENT, sender_id INTEGER, receiver_id INTEGER, message_text TEXT, timestamp DATETIME, status TEXT, FOREIGN KEY(sender_id) REFERENCES users(id), FOREIGN KEY(receiver_id) REFERENCES users(id))")
