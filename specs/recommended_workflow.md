### Recommendation: Start with a thin end-to-end slice, then iterate

- **Decide the defaults (recommended for speed/MVP)**
  - **Auth**: Amazon Cognito (Hosted UI) with JWT verification in backend.
  - **RAG**: Bedrock Knowledge Bases (per-course S3 prefixes + metadata filter).
  - **Backend**: FastAPI on AWS Lambda + API Gateway.
  - **DB**: Postgres (RDS in prod, Docker locally) with SQLAlchemy + Alembic.
  - **Storage**: S3 with pre-signed uploads.
  - **Frontend**: Next.js App Router, TypeScript, Tailwind, shadcn/ui.

### Week 1: Ship a vertical slice (auth → courses → chat without RAG)

1) Project scaffolding and CI
- Initialize repo, set up Node + Python toolchains, Prettier/ESLint, Ruff/mypy (if used), GitHub Actions (lint/test).
- Create `.env.example` for frontend and backend; add secrets via `.env.local` and `.env` for dev.

2) Frontend shell + UI kit
- Next.js app (App Router), Tailwind, shadcn/ui, base layout: sidebar/topbar/routes.
- Pages: `/(auth)/login`, `/(app)/dashboard`, `/(app)/courses/[id]`, `/(app)/chat`.
- State: auth state, selected course.

3) Cognito auth
- Create User Pool, Hosted UI; configure callback/logout URLs.
- Frontend: login/logout buttons; persist tokens client-side; expose ID token to API calls.
- Backend: JWKS verification middleware; extract `sub` as `cognito_user_id`.

4) Backend skeleton + DB
- FastAPI app with auth dependency; health endpoint.
- Local Postgres via Docker; SQLAlchemy + Alembic.
- Models/migrations: `users`, `courses`, `enrollments`, `resources`.
- On first auth hit, upsert `users` by `cognito_user_id`.

5) Courses core
- Endpoints: create course, join course (validate code/key), list “my courses”, get course.
- Frontend: Dashboard empty state → create/join flows → course detail page showing sections.

6) Chat skeleton (no RAG yet)
- Tables: `chat_sessions`, `chat_messages`.
- Endpoint: `POST /chat` accepts message + optional `course_id`; returns a simple placeholder response.
- Frontend: basic chat UI with session handling; messages persist.

Result: You can log in, create/join a course, and chat (placeholder).

### Week 2: Resources + S3 + RAG (Bedrock KB)

7) S3 resources
- Create S3 bucket; backend endpoints for pre-signed upload/download.
- `resources` CRUD: file/link/note, visibility (shared/personal), section.
- Frontend: “Add Resource” modal with file upload (pre-signed), link/note forms; list with labels.

8) Bedrock Knowledge Base
- Create a KB connected to the S3 bucket.
- Organize objects by course prefix and include metadata (e.g., `course_id`) for filtering.
- Ingestion process: ensure new uploads are picked up (KB sync job or event-driven sync).
- Retrieval API in backend: given `course_id` and question, query KB with metadata filter.

9) Course-aware chat
- Prompt assembly: user question + retrieved chunks + onboarding prefs (usage/background).
- Call Bedrock LLM; return answer + citations (resource keys/URLs).
- Frontend: show “Sources” chips that open the resource.

10) Onboarding data
- Frontend onboarding flow; backend fields on `users` (usage, background, personalization flag).
- Include personalization only if toggle is on.

### Deployment & ops (can start in parallel once slice works)

11) IaC and environments
- CDK/Terraform for Cognito, API Gateway + Lambda, RDS, S3, KB, IAM, Secrets.
- Deploy frontend (Amplify Hosting or S3+CloudFront).
- Configure environment variables and secrets per environment.

12) Observability and tests
- Structured logging; CloudWatch alarms; health checks.
- Tests: unit for models/services, API tests for course/enrollment, a chat flow test.
- Basic load/perf sanity on `chat` path.

### Data model (initial)
- `users(id, cognito_user_id, name, email, usage_context, background, personalization_enabled)`
- `courses(id, title, code, description, enrollment_key, admin_user_id)`
- `enrollments(id, user_id, course_id, unique(user_id, course_id))`
- `resources(id, course_id, owner_user_id, visibility, type, title, section, storage_info/url)`
- `chat_sessions(id, user_id, course_id null)`
- `chat_messages(id, session_id, role, content, created_at)`

### Practical 7-day checklist
- Day 1: Repo + toolchain + Next.js shell + shadcn/ui.
- Day 2: Cognito setup + frontend auth + backend JWT verify.
- Day 3: DB + migrations + users upsert + courses endpoints.
- Day 4: Dashboard/create/join + course detail.
- Day 5: Chat UI + chat endpoint (placeholder).
- Day 6: S3 + pre-signed upload + resources UI.
- Day 7: KB creation + retrieval + integrate course-aware chat + citations.

### Key risks/choices to lock early
- If Cognito feels heavy, switch to NextAuth + Postgres quickly (don’t split efforts).
- For RAG, stick to Knowledge Bases for MVP; avoid custom vector infra until later.
- Prefer Lambda for backend unless you need long-running tasks → then ECS Fargate.

- Implement the thin slice first (auth → courses → chat placeholder), then layer S3, resources, and KB-based RAG. This gets you a demoable product fast and de-risks integration points early.