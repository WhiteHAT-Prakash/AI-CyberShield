from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...models.scan_result import ScanResult
from ...models.alert import Alert

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def get_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return aggregated stats for the dashboard."""
    total_scans    = db.query(ScanResult).filter(ScanResult.user_id == current_user.id).count()
    phishing_found = db.query(ScanResult).filter(
        ScanResult.user_id == current_user.id,
        ScanResult.scan_type == "phishing",
        ScanResult.risk_level == "high"
    ).count()
    unread_alerts  = db.query(Alert).filter(
        Alert.user_id == current_user.id,
        Alert.is_read == False
    ).count()

    return {
        "total_scans":    total_scans,
        "phishing_found": phishing_found,
        "unread_alerts":  unread_alerts,
        "threat_score":   current_user.threat_score or 0,
        "user":           {"full_name": current_user.full_name, "email": current_user.email},
    }
