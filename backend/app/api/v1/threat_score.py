from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...models.scan_result import ScanResult
from ...services.gemini_service import gemini_analyze

router = APIRouter(prefix="/threat-score", tags=["Threat Scoring"])


@router.get("/")
def get_threat_score(current_user: User = Depends(get_current_user)):
    """Return the user's current persisted threat risk score."""
    return {
        "score":        current_user.threat_score or 0,
        "grade":        _score_to_grade(current_user.threat_score or 0),
        "last_updated": current_user.updated_at,
    }


@router.post("/calculate")
async def calculate_threat_score(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Re-calculate the user's threat risk score using Gemini AI based on activity."""
    recent_scans = (
        db.query(ScanResult)
        .filter(ScanResult.user_id == current_user.id)
        .order_by(ScanResult.created_at.desc())
        .limit(30)
        .all()
    )

    scan_summary = [{"type": s.scan_type, "risk": s.risk_level} for s in recent_scans]

    prompt = f"""You are a cybersecurity risk assessor. Based on this user's security activity:
{scan_summary}

Calculate a threat risk score.

Respond with a JSON object:
- "score": integer 0-100 (higher = more at risk)
- "grade": "A" | "B" | "C" | "D" | "F"
- "risk_factors": list of identified risk factors (strings)
- "explanation": 2-3 sentence summary
- "trend": "improving" | "stable" | "worsening"

Return ONLY the JSON object, no markdown.
"""
    result = await gemini_analyze(prompt)

    # Persist updated score to user record
    current_user.threat_score = result.get("score", 0)
    db.commit()

    return result


def _score_to_grade(score: int) -> str:
    if score <= 20: return "A"
    if score <= 40: return "B"
    if score <= 60: return "C"
    if score <= 80: return "D"
    return "F"
