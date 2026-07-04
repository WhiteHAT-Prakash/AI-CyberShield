from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...models.scan_result import ScanResult
from ...services.gemini_service import gemini_analyze

router = APIRouter(prefix="/password", tags=["Password Analyzer"])


class PasswordRequest(BaseModel):
    password: str


@router.post("/analyze")
async def analyze_password(
    payload: PasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Analyze password strength using Gemini AI."""
    prompt = f"""You are a cybersecurity expert. Analyze the following password for strength and security.

Password: {payload.password}

Respond with a JSON object containing:
- "score": integer 0-4 (0=very weak, 4=very strong)
- "strength_label": "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong"
- "length": password length
- "has_uppercase": boolean
- "has_lowercase": boolean
- "has_numbers": boolean
- "has_symbols": boolean
- "issues": list of security issues found
- "suggestions": list of improvement suggestions
- "estimated_crack_time": human-readable string
- "explanation": brief explanation

Return ONLY the JSON object, no markdown.
"""
    result = await gemini_analyze(prompt)

    scan = ScanResult(
        user_id=current_user.id,
        scan_type="password",
        input_data="[REDACTED]",  # Never store actual passwords
        result=result,
        risk_level="low" if result.get("score", 0) >= 3 else "high",
    )
    db.add(scan)
    db.commit()

    return result
