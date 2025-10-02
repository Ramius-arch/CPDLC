from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Token(Base):
    __tablename__ = 'tokens'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    token_value = Column(String(100))
    expiration_date = Column(DateTime)

    def __repr__(self):
        return f"<Token(id={self.id}, user_id={self.user_id})>"
