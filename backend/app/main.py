from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings

# Import all route modules
from .api.v1 import auth, dashboard, phishing, password, url_scanner, chatbot, recommendations, threat_score, checklist, alerts, history

app = FastAPI(
    title="AI CyberShield API",
    description="Agentic AI Powered Intelligent Cybersecurity Assistant",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS – allow the configured frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all feature routers under /api/v1
PREFIX = "/api/v1"
app.include_router(auth.router,            prefix=PREFIX)
app.include_router(dashboard.router,       prefix=PREFIX)
app.include_router(phishing.router,        prefix=PREFIX)
app.include_router(password.router,        prefix=PREFIX)
app.include_router(url_scanner.router,     prefix=PREFIX)
app.include_router(chatbot.router,         prefix=PREFIX)
app.include_router(recommendations.router, prefix=PREFIX)
app.include_router(threat_score.router,    prefix=PREFIX)
app.include_router(checklist.router,       prefix=PREFIX)
app.include_router(alerts.router,          prefix=PREFIX)
app.include_router(history.router,         prefix=PREFIX)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "AI CyberShield API", "version": "1.0.0"}
