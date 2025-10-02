from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    password_hash = Column(String(100))
    role = Column(String(20))  # 'controller' or 'pilot'
    last_login = Column(DateTime)
    status = Column(String(20))  # 'active', 'inactive'

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"
