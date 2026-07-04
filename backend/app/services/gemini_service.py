import json
import re
import google.generativeai as genai
from ..core.config import settings

# Configure Gemini once at module load time
genai.configure(api_key=settings.GEMINI_API_KEY)

# Use gemini-1.5-flash for fast, cost-effective responses
_model = genai.GenerativeModel("gemini-1.5-flash")


def _extract_json(text: str) -> dict:
    """
    Extracts a JSON object from a Gemini response string.
    Handles cases where Gemini wraps output in markdown code fences.
    """
    # Remove markdown code fences if present
    text = re.sub(r"```(?:json)?", "", text).strip().rstrip("`").strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # If JSON parsing fails, return a structured error response
        return {"error": "Failed to parse AI response", "raw": text[:500]}


async def gemini_analyze(prompt: str) -> dict:
    """
    Send a single-turn prompt to Gemini and return the parsed JSON response.
    Used for all analysis endpoints (phishing, password, URL, etc.).
    """
    try:
        response = _model.generate_content(prompt)
        return _extract_json(response.text)
    except Exception as e:
        return {"error": str(e), "message": "Gemini AI request failed"}


async def gemini_chat(system_prompt: str, history: list, user_message: str) -> str:
    """
    Send a multi-turn chat message to Gemini with conversation history context.
    Returns the assistant's plain-text reply.
    """
    try:
        # Build conversation history in Gemini format
        chat_history = []
        for msg in history:
            role = "user" if msg["role"] == "user" else "model"
            chat_history.append({"role": role, "parts": [msg["content"]]})

        # Start chat session with history
        chat = _model.start_chat(history=chat_history)

        # Include system context in the first user message if no history
        full_message = f"{system_prompt}\n\nUser: {user_message}" if not history else user_message
        response = chat.send_message(full_message)
        return response.text

    except Exception as e:
        return f"I encountered an error: {str(e)}. Please try again."
