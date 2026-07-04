from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...services.gemini_service import gemini_analyze

router = APIRouter(prefix="/checklist", tags=["Security Checklist"])


class ChecklistRequest(BaseModel):
    context: Optional[str] = "general"  # e.g. "remote work", "small business", "developer"


@router.post("/generate")
async def generate_checklist(
    payload: ChecklistRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate a personalized security checklist using Gemini AI."""
    prompt = f"""You are a cybersecurity expert. Generate a comprehensive security checklist for context: "{payload.context}".

Respond with a JSON object:
- "title": checklist title
- "context": the context provided
- "categories": list of objects, each with:
  - "name": category name
  - "items": list of objects with:
    - "id": unique string id
    - "task": the security task description
    - "priority": "critical" | "high" | "medium" | "low"
    - "completed": false

Return ONLY the JSON object, no markdown.
"""
    return await gemini_analyze(prompt)


@router.get("/")
def get_checklists(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Placeholder — returns empty list until checklist persistence is added."""
    return []
