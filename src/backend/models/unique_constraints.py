from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    password_hash = Column(String(100))
    role = Column(String(20))  # 'controller' or 'pilot'
    last_login = Column(DateTime)
    status = Column(String(20))  # 'active', 'inactive'

    __table_args__ = (UniqueConstraint('username'),)

    messages_sent = relationship('Message', foreign_keys='Message.sender_id')
    messages_received = relationship('Message', foreign_keys='Message.receiver_id')

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"
