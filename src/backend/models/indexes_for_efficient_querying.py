from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Message(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True)
    sender_id = Column(Integer, ForeignKey('users.id'))
    receiver_id = Column(Integer, ForeignKey('users.id'))
    message_text = Column(String(500))
    timestamp = Column(DateTime)
    status = Column(String(20))  # 'sent', 'delivered', 'read'

    __table_args__ = (
        Index('idx_sender_id', sender_id),
        Index('idx_receiver_id', receiver_id),
        Index('idx_timestamp', timestamp),
    )

    def __repr__(self):
        return f"<Message(id={self.id}, sender_id={self.sender_id})>"
