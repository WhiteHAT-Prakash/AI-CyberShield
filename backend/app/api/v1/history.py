from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...models.scan_result import ScanResult

router = APIRouter(prefix="/history", tags=["User History"])


@router.get("/")
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    scan_type: str = Query(None),
):
    """
    Return paginated user scan history.
    Optionally filter by scan_type (phishing, password, url_scanner).
    """
    query = db.query(ScanResult).filter(ScanResult.user_id == current_user.id)

    if scan_type:
        query = query.filter(ScanResult.scan_type == scan_type)

    total   = query.count()
    records = query.order_by(ScanResult.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    return {
        "total":    total,
        "page":     page,
        "per_page": page_size,
        "records": [
            {
                "id":         r.id,
                "scan_type":  r.scan_type,
                "input_data": r.input_data,
                "risk_level": r.risk_level,
                "created_at": r.created_at,
            }
            for r in records
        ],
    }
