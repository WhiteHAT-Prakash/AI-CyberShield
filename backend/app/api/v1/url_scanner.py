from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, HttpUrl

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...models.scan_result import ScanResult
from ...services.gemini_service import gemini_analyze

router = APIRouter(prefix="/url-scanner", tags=["URL Scanner"])


class URLRequest(BaseModel):
    url: str


@router.post("/scan")
async def scan_url(
    payload: URLRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Scan a URL for suspicious or malicious indicators using Gemini AI."""
    prompt = f"""You are a cybersecurity expert specializing in URL threat analysis.
Analyze this URL for security threats: {payload.url}

Respond with a JSON object containing:
- "is_suspicious": boolean
- "is_malicious": boolean
- "risk_level": "safe" | "low" | "medium" | "high" | "critical"
- "threat_types": list of detected threat types (e.g., "phishing", "malware", "typosquatting")
- "domain_analysis": object with "age_suspicious", "uses_https", "suspicious_tld"
- "indicators": list of suspicious indicators found
- "explanation": brief explanation
- "recommendation": what action the user should take

Return ONLY the JSON object, no markdown.
"""
    result = await gemini_analyze(prompt)

    scan = ScanResult(
        user_id=current_user.id,
        scan_type="url_scanner",
        input_data=payload.url,
        result=result,
        risk_level=result.get("risk_level", "safe"),
    )
    db.add(scan)
    db.commit()

    return result
