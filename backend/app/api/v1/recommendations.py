from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...models.scan_result import ScanResult
from ...services.gemini_service import gemini_analyze

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/")
async def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate personalized security recommendations based on the user's scan history."""
    # Fetch recent scan results to personalize recommendations
    recent_scans = (
        db.query(ScanResult)
        .filter(ScanResult.user_id == current_user.id)
        .order_by(ScanResult.created_at.desc())
        .limit(20)
        .all()
    )

    scan_summary = [
        {"type": s.scan_type, "risk_level": s.risk_level} for s in recent_scans
    ]

    prompt = f"""You are a cybersecurity advisor. Based on this user's recent security scan history:
{scan_summary}

Generate personalized security recommendations.

Respond with a JSON object containing:
- "overall_security_grade": "A" | "B" | "C" | "D" | "F"
- "recommendations": list of objects, each with:
  - "title": recommendation title
  - "description": detailed description
  - "priority": "high" | "medium" | "low"
  - "category": "password" | "phishing" | "network" | "data" | "general"
  - "action_steps": list of specific action steps

Return ONLY the JSON object, no markdown.
"""
    return await gemini_analyze(prompt)
