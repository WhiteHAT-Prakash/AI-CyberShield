from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..core.database import Base


class ChatHistory(Base):
    """Persists chatbot conversation messages per user and conversation thread."""
    __tablename__ = "chat_history"

    id              = Column(Integer, primary_key=True, index=True)
    user_id         = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    conversation_id = Column(String(100), default="default", index=True)
    role            = Column(String(20), nullable=False)   # user | assistant
    content         = Column(Text, nullable=False)
    created_at      = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="chat_history")
