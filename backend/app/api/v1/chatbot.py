from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from ...core.database import get_db
from ...core.security import get_current_user
from ...models.user import User
from ...models.history import ChatHistory
from ...services.gemini_service import gemini_chat

router = APIRouter(prefix="/chatbot", tags=["Cybersecurity Chatbot"])


class MessageRequest(BaseModel):
    message: str
    conversation_id: str = "default"


class MessageResponse(BaseModel):
    reply: str
    conversation_id: str


@router.post("/message", response_model=MessageResponse)
async def send_message(
    payload: MessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Send a message to the AI cybersecurity chatbot powered by Gemini.
    Maintains conversation context via stored history.
    """
    system_prompt = """You are CyberShield AI, an expert cybersecurity assistant. 
You help users with: threat analysis, security best practices, password advice, 
phishing awareness, network security, data protection, and incident response.
Always be concise, professional, and actionable. Format responses with markdown when helpful."""

    # Fetch recent conversation history for context
    recent = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id, ChatHistory.conversation_id == payload.conversation_id)
        .order_by(ChatHistory.created_at.desc())
        .limit(10)
        .all()
    )
    history = [{"role": h.role, "content": h.content} for h in reversed(recent)]

    reply = await gemini_chat(system_prompt, history, payload.message)

    # Persist user message and assistant reply
    db.add(ChatHistory(user_id=current_user.id, conversation_id=payload.conversation_id, role="user",      content=payload.message))
    db.add(ChatHistory(user_id=current_user.id, conversation_id=payload.conversation_id, role="assistant", content=reply))
    db.commit()

    return {"reply": reply, "conversation_id": payload.conversation_id}


@router.get("/history")
def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Fetch recent chat messages for the authenticated user."""
    messages = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.created_at.asc())
        .limit(100)
        .all()
    )
    return [{"role": m.role, "content": m.content, "created_at": m.created_at} for m in messages]
