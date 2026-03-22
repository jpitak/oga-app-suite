# OGA International Enterprise Suite

Modern glossy enterprise web application for OGA International with five modules (Marketing, Facial, Robotics, Inventory, Product), AI Chat, Google login, user management, export tools, and a shared multi-user database.

## Highlights
- Deep navy sidebar with glossy glassmorphism UI
- Gradient KPI widgets and clean operational tables
- AI Chat with Gemini-ready provider switch and adaptive mock replies
- Google OAuth login (or demo login fallback)
- Shared SQLite database for all users on the same deployment
- Export to PDF and Excel
- One-click Docker installation

## Quick Start (One-Click)
### Option A: Docker
1. Copy `.env.example` to `.env`
2. Fill in Google OAuth keys if needed
3. Run:
   - macOS/Linux: `bash scripts/install.sh`
   - Windows: `scripts\\install.bat`
4. Open `http://localhost:8080`

### Option B: Local Development
```bash
npm install --workspaces
cp .env.example .env
npm run dev
```

## Google Login Setup
Create Google OAuth credentials and set:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`

Authorized redirect URI example:
`http://localhost:8080/auth/google/callback`

## AI Providers
- `DEFAULT_AI_PROVIDER=mock` → always use mock response
- Add `GEMINI_API_KEY` and set `DEFAULT_AI_PROVIDER=gemini` to use Gemini
- OpenAI / Anthropic keys are reserved in config for future expansion

## Shared Database
Database file is stored at `server/data/oga.db` and persisted through Docker volume `oga_data`.

## Demo Accounts
If Google OAuth is not configured, use Demo Login from the sign-in screen.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS + Recharts
- Backend: Node.js + Express + SQLite + Passport Google OAuth
- Export: PDFKit + ExcelJS
- Deployment: Docker Compose
