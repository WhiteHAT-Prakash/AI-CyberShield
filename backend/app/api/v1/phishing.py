from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...models.scan_result import ScanResult
from ...services.gemini_service import gemini_analyze

router = APIRouter(prefix="/phishing", tags=["Phishing Detection"])


class PhishingRequest(BaseModel):
    content: str  # Email body or suspicious text to analyze


@router.post("/analyze")
async def analyze_phishing(
    payload: PhishingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Analyze text/email content for phishing indicators using Google Gemini AI.
    Persists the result to the database.
    """
    prompt = f"""You are a cybersecurity expert specializing in phishing detection.
Analyze the following text/email for phishing indicators.

Text to analyze:
---
{payload.content}
---

Respond with a JSON object containing:
- "is_phishing": boolean
- "confidence": number 0-100
- "risk_level": "low" | "medium" | "high" | "critical"
- "indicators": list of phishing indicators found (strings)
- "explanation": detailed explanation (2-3 sentences)
- "recommendation": what the user should do

Return ONLY the JSON object, no markdown.
"""
    result = await gemini_analyze(prompt)

    # Persist scan result
    scan = ScanResult(
        user_id=current_user.id,
        scan_type="phishing",
        input_data=payload.content[:500],
        result=result,
        risk_level=result.get("risk_level", "low"),
    )
    db.add(scan)
    db.commit()

    return result
