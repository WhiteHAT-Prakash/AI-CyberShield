from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..core.database import Base


class Alert(Base):
    """Real-time security alerts sent to users."""
    __tablename__ = "alerts"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title      = Column(String(200), nullable=False)
    message    = Column(Text, nullable=False)
    alert_type = Column(String(50), default="info")   # info | warning | danger | success
    is_read    = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="alerts")
