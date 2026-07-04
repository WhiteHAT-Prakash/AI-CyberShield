from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from ..core.database import Base


class ScanResult(Base):
    """Persists all AI scan results (phishing, password, url_scanner)."""
    __tablename__ = "scan_results"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    scan_type  = Column(String(50), nullable=False)        # phishing | password | url_scanner
    input_data = Column(Text, nullable=True)               # Truncated input (never full password)
    result     = Column(JSON, nullable=True)               # Full Gemini JSON response
    risk_level = Column(String(20), default="low")         # low | medium | high | critical
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="scan_results")
