# AI Teaching Assistant — Monorepo (Frontend + Backend)

This repository contains:

- `frontend/` — Next.js (TypeScript, Tailwind, ESLint/Prettier)
- `backend/` — FastAPI (Python), with Ruff, mypy, and pytest

## Prerequisites

- Node.js 20.x (see `.nvmrc`)
- Python 3.11.x (see `.python-version`)

## Quick Start

1) Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

App runs on `http://localhost:3000`.

2) Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

API runs on `http://localhost:8000`.

## Environment Variables

- Frontend: `frontend/.env.local.example` shows required public envs.
- Backend: `backend/.env.example` lists server envs (DB, AWS, Cognito, etc.).

Never commit real secrets. The `.gitignore` excludes `.env*` by default.

### Frontend Auth (NextAuth)

- Set in `frontend/.env.local`:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-me-in-prod
```

- Demo login: any email, password `demo123` (stubbed Credentials provider).

## Scripts

Frontend:

- `npm run dev` — start Next.js dev server
- `npm run lint` — run ESLint
- `npm run typecheck` — TypeScript check (no emit)
- `npm run build` — production build

Backend:

- `ruff check .` — lint
- `mypy app` — type checking
- `pytest` — tests

## CI

GitHub Actions run:

- Frontend CI: install deps, ESLint, TypeScript check
- Backend CI: install deps, Ruff, mypy, pytest

See `.github/workflows/`.


