# AI CyberShield – Intelligent Cybersecurity Assistant

AI CyberShield is an Agentic AI-powered intelligent cybersecurity assistant built to protect digital environments from social engineering threats, weak credentials, and malicious links. Powered by the Google Gemini API, it provides live analysis, exposure scoring, custom check checklists, and automated n8n notifications.

---

## 🚀 Tech Stack

### Frontend
- **React 18** (UI structure)
- **Vite** (Rapid development & compilation bundler)
- **Tailwind CSS v3** (Glassmorphism cybersecurity dark theme)
- **React Router v6** (Protected routing & route guards)
- **Axios** (API query engine with 401 interceptors)
- **Framer Motion** (Visual micro-animations)
- **React Icons** (UI icons)

### Backend
- **FastAPI** (Python web framework)
- **SQLAlchemy 2.0** (Database ORM model layer)
- **Alembic** (Database migration schemas migrations)
- **JWT (python-jose)** (Bearer token authentication)
- **Bcrypt (passlib)** (Password hashing)

### Database & Automation
- **Neon PostgreSQL** (Serverless cloud database)
- **Google Gemini API** (Generative AI logic core)
- **n8n Community Edition** (Workflow notification automations)

---

## 📂 Folder Structure

```
ai-cybershield/
├── frontend/                  # React + Vite + Tailwind CSS
│   ├── public/                # Static public assets
│   ├── src/
│   │   ├── api/               # Axios API modules
│   │   ├── components/        # Reusable common elements and layout
│   │   ├── contexts/          # State providers (Auth/Alerts)
│   │   ├── pages/             # Route-level view folders
│   │   ├── router/            # React Router configurations
│   │   ├── utils/             # Helper formatters and indicators
│   │   └── index.css          # Main stylesheet with custom themes
│   ├── vercel.json            # Vercel deployment overrides
│   └── tailwind.config.js     # Custom color tokens
│
├── backend/                   # FastAPI Web API
│   ├── app/
│   │   ├── api/               # Router endpoints (auth, chatbot, scanner)
│   │   ├── core/              # DB configs, secrets settings, auth guards
│   │   ├── models/            # SQLAlchemy schemas declarations
│   │   ├── schemas/           # Pydantic payloads validations
│   │   ├── services/          # Gemini AI connector modules
│   │   └── main.py            # FastAPI server entrypoint
│   ├── alembic/               # DB migration history versions
│   ├── tests/                 # Pytest unit tests
│   └── Procfile               # Render web container configuration
│
└── n8n/                       # Automation workflow templates
    ├── phishing_alert_workflow.json
    ├── email_notification_workflow.json
    └── threat_report_workflow.json
```

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://neondb_owner:...neon.tech/neondb?sslmode=require
SECRET_KEY=6b9102862d693b5a20aaf0339755ec32...
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GEMINI_API_KEY=AQ.Ab8RN...
N8N_WEBHOOK_URL=http://localhost:5678/webhook/...
FRONTEND_URL=http://localhost:5173
```

---

## 💻 Running the Application Locally

### Prerequisite Checklist
- **Node.js LTS** (v20+) installed
- **Python** (v3.12+) installed
- **Neon PostgreSQL** account & connection string
- **Google Gemini API** key

### 1. Backend Server Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Run migrations to update Neon PostgreSQL
alembic upgrade head

# Start development API server
uvicorn app.main:app --reload
```
API docs will be available at: `http://localhost:8000/api/docs`

### 2. Frontend client Setup
```bash
cd frontend
npm install
npm run dev
```
Client will launch at: `http://localhost:5173`

---

## 🌐 Deploying to Production

### 1. Backend on Render
- Connect your GitHub repository to **Render**.
- Create a new **Web Service**.
- Select environment: **Python**.
- Build Command: `pip install -r requirements.txt`.
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Add environment variables from `backend/.env` into Render's dashboard.

### 2. Frontend on Vercel
- Import your repository into **Vercel**.
- Add environment variable `VITE_API_BASE_URL` pointing to your deployed Render API (e.g. `https://api-cybershield.onrender.com/api/v1`).
- Trigger deployment. `vercel.json` will automatically configure routing.

---

## 🤖 n8n Automations Setup
1. Open your **n8n dashboard** (`http://localhost:5678`).
2. Click **Import from File** and select any JSON workflow from the `n8n/` folder.
3. Configure your mail node settings (SMTP credentials).
4. Activate the webhooks.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
