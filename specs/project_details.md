# AI Teaching Assistant  
## Product, UX/UI Specification & Tech Stack

---

## 1. Product Overview

**Name:** AI Teaching Assistant  
**Type:** Web application (SaaS-style)

**Goal:**  
Help learners organize their course materials and get course-aware help from an AI teaching assistant, using Retrieval-Augmented Generation (RAG) and light personalization based on user profile.

The system supports:

- Private, credential-gated courses (similar to Moodle – users only see courses they’re registered for).
- Structured storage of course materials (lectures, notes, exams, etc.).
- A chat interface where the AI uses course materials and user background to answer questions and give study support.

---

## 2. Core Concepts & Roles

### 2.1 User Roles

**User** (default; includes students and instructors)

- Can sign up, log in, and log out.
- Can create courses (becoming Course Admin for those courses).
- Can join existing courses using a Course Code and Enrollment Key.
- Can upload personal resources to courses they are enrolled in.
- Can chat with the AI Teaching Assistant.

**Course Admin**

Any user who creates a course is the Course Admin for that course.

Additional permissions:

- Edit course metadata.
- Add “shared” resources visible to all enrolled users.

(For now: no UI for multiple admins, no roles beyond “admin” and “enrolled user”.)

---

### 2.2 Domain Objects

**User**

- Authenticated account.
- Has profile info and onboarding answers.

**Course**

Identified by:

- Title (e.g., “Algorithms 1”)
- Course Code (e.g., “ALG1-2025” – used to join)
- Description
- Enrollment Key (optional, secret)

Has a single Course Admin (creator).  
Contains multiple sections and resources.

**Course Enrollment**

- Relation between User and Course.
- Determines which courses appear in “My Courses”.
- A user can only access a course if enrolled or admin.

**Resource**

Linked to a course and a section.

Fields:

- **Type:** File | Link | Note  
- **Title**
- **Storage info** (e.g. S3 path or URL)
- **Visibility:** shared | personal
- **Owner user ID** (for personal resources)

Shared resources are visible to all enrolled users.  
Personal resources are visible only to their owner.

**Chat Session / Message**

- Conversations between a user and the AI.
- Optional context: Course ID.
- Messages stored (if desired) for history and personalization.

---

## 3. Onboarding & Personalization

After sign-up, the user completes a minimal onboarding flow.

### 3.1 Onboarding Questions (MVP)

Two short steps:

**Usage Context**

- Question: “I am using this platform to learn:”  
  Free-text field or “ I don’t know yet, just exploring :) “

- Question: “I am learning for:”  
  Options (single or multi-select):  
  - School  
  - University  
  - Self-Study / Personal Interest  
  - Career

**Background**

- Question: “What is your background?” (optional)  
  So we can better personalize the answers

These answers are:

- Stored in the database.
- Passed as part of the system prompt for the AI, to slightly personalize explanations (e.g., more technical for CS background, more foundational for self-study).

---

## 4. UX / UI Specification

### 4.1 Visual Style

- **Theme:** Dark-first, clean and minimal (inspired by ChatGPT).
- **Layout:**
  - Left sidebar: navigation (courses, actions).
  - Top bar: app name + user menu (simple).
  - Main content: dashboard, course pages, chat.
- **Typography:** Simple, legible sans-serif (e.g., Inter).
- **Components:** Use a UI library (e.g., shadcn/ui) for consistent buttons, inputs, modals.

---

### 4.2 Global Layout

Once logged in, the user sees:

**Left Sidebar**

- App logo/name.
- Button: “New Chat”.
- Section: “My Courses”
  - List of courses the user is enrolled in or admin of.
  - Clicking a course opens Course Detail view.
- Actions:
  - “Create Course”
  - “Join Course”
- At bottom: User avatar/name (opens Settings/Profile).

**Top Bar**

- App name.
- Optional: current course indicator when in chat (“Course: Algorithms 1”).
- User menu: Settings, Log out.

**Main Content**

- Dashboard (home).
- Course Detail page.
- Chat page.
- Settings/Profile.

---

### 4.3 Authentication

#### 4.3.1 Sign Up Page

Centered card on dark background.

Fields:

- Full Name
- Email
- Password

Buttons:

- Primary: “Sign Up”
- Secondary link: “Already have an account? Log In”

On success → Onboarding flow.

#### 4.3.2 Log In Page

Centered card.

Fields:

- Email
- Password

Buttons:

- Primary: “Log In”
- Secondary link: “Create an account”
- “Forgot password?” link (optional for MVP).

On success → Dashboard.

---

### 4.4 Dashboard (Home)

**Empty State (no courses)**

- Message: “You’re not enrolled in any courses yet.”
- Actions:
  - “Create Course”
  - “Join Course”
  - “Start a general chat with AI Teaching Assistant”

**Populated State**

Section: **“My Courses”**

List of cards:

- Course Title
- Course Code
- Short description
- Optional: “Recent Chats” list.

Tapping a course card opens Course Detail.

---

### 4.5 Course Management

#### 4.5.1 Create Course Flow

From Dashboard or sidebar:

“Create Course” opens a form:

Fields:

- Course Title (required)
- Course Code (required, unique per owner or system-wide)
- Description (optional)
- Enrollment Key (optional text; if provided, must be entered on join)

Actions:

- “Create Course”
- Cancel

Result:

- User becomes Course Admin.
- Course is automatically added to My Courses.
- Redirect user to the Course Detail page.

---

#### 4.5.2 Join Course Flow

From Dashboard or sidebar:

“Join Course” opens a form:

Fields:

- Course Code (required)
- Enrollment Key (required if course has one configured)

Behavior:

- Validate against existing course.
- If match:
  - Create enrollment for this user.
  - Add course to My Courses.
  - Redirect to Course Detail.
- If mismatch:
  - Show error: “Incorrect course code or enrollment key.”

Note:  
There is no public browsing / discover page in MVP. All courses are effectively private and accessed only via code+key.

---

### 4.6 Course Detail Page

When a user selects a course, they see:

**Layout:**

**Left Column (Sections Navigation)**

- Overview
- Course Media
- Notes
- Past Exams
- Past Assignments
- Additional Resources
- General

**Main Content Area**

At top:

- Course Title
- Brief description
- Button: “Ask AI Teaching Assistant about this course” → opens Chat with course context.

Below: content for the selected section.

**Each Section View:**

- Header: Section name (e.g., “Notes”).
- Button: “Add Resource”.
- List of resources:
  - Icon based on type (file/link/note).
  - Title.
  - Label:
    - Shared – visible to all enrolled users.
    - My resource – visible only to the current user.
  - Optional: small subtitle (e.g., filename or URL domain).

**Add Resource Modal:**

Tabs or select for resource type:

**Upload File**

- File input (drag & drop).
- Title (auto-filled from filename; editable).
- For Course Admin:  
  Visibility dropdown: Shared | Personal.
- For non-admin:  
  Visibility fixed to Personal.

**Add Link**

- URL field.
- Title.
- (Optional) Type selector: Video / Reading / Other.  
  Visibility rules same as above.

**Create Note**

- Text area or simple rich-text editor.
- Title.
- Visibility rules same as above.

---

### 4.7 Chat Interface – AI Teaching Assistant

The chat is the core GenAI experience.

#### 4.7.1 Access

**Global:**

- “New Chat” in the sidebar: opens chat in general mode (no course context).

**From Course Detail:**

- Button: “Ask AI Teaching Assistant about this course”:  
  Opens chat with course context pre-selected.

---

#### 4.7.2 Layout

**Left Panel (Context Settings)**

- “Course Context” dropdown:
  - Option: “None (general chat)”
  - List of user’s enrolled courses:
    - e.g., “Algorithms 1”, “Linear Algebra”, etc.
- (Optional toggle): “Use my profile info for personalization” (On/Off).

**Central Area (Conversation)**

Scrollable list of messages:

- User messages (right aligned).
- AI messages (left aligned).

Each AI message shows:

- Answer text.
- A “Sources” block at the bottom (when applicable):
  - Chips listing resources used in the answer:
    - e.g., Lecture1.pdf, My_Notes_Week3, StanfordVideo_Link.
  - Clicking a chip:
    - Opens the resource in the course UI (in a new tab or modal).

Typing indicator: “AI Teaching Assistant is thinking…”.

**Bottom Area (Input)**

- Multiline text input.
- “Send” button.
- (Optional) indicator: “Currently using course: Algorithms 1” or “General chat”.

---

#### 4.7.3 Behavior

**General chat (no course selected):**

- AI responds based on general knowledge (via the LLM).
- Can still incorporate profile info (usage/background).

**Course-aware chat (course selected):**

Backend performs a RAG flow:

- Takes the user’s question and selected Course ID.
- Retrieves relevant chunks from:
  - Shared resources in that course.
  - The user’s own personal resources for that course.
- Builds a prompt including:
  - Relevant content.
  - User’s onboarding info (usage & background).
- Calls the LLM and returns the answer + resource references.

**No relevant materials found:**

AI reply:

- “I couldn’t find relevant information in your course materials. I can give a general explanation or you can upload more resources.”

Optionally suggests:

- “Upload resources to this course”.

---

### 4.8 Settings / Profile

Accessible from avatar/user menu.

**Sections (MVP):**

**Profile**

- Name (editable).
- Email (read-only or editable depending on auth strategy).

**Onboarding Info**

- “You’re using this for: …”
- “Your background: …”
- Editable via simple controls.

**AI Personalization (optional)**

- Toggle: “Allow AI Teaching Assistant to use my profile info for personalization.”

**Account**

- Logout button (actual logic in app header).
- Optional: Delete account.

---

## 5. Suggested Tech Stack & Architecture

This stack is chosen to:

- Look good to hiring managers (modern, widely used tools).
- Integrate well with AWS and the GenAI services you’ve learned (Bedrock, Knowledge Bases, optionally AgentCore).
- Be realistic for an MVP you can build and maintain.

---

## 5.1 Frontend

- **Framework:** Next.js (v14/15, App Router)
- **Language:** TypeScript
- **UI:** React, Tailwind CSS, shadcn/ui
- **Deployment:** AWS Amplify Hosting or S3 + CloudFront

**Responsibilities:**

- Render all pages described above (auth, dashboard, course pages, chat, settings).
- Use Next.js API routes or call a backend API for server logic.
- Maintain client-side state for logged-in user, selected course, etc.

---

## 5.2 Authentication & Identity

**Service:** Amazon Cognito User Pool

**Flow:**

- Users sign up and log in via Cognito.
- The frontend gets an ID token / access token.
- Backend uses the token to:
  - Identify the user.
  - Authorize operations (e.g., reading a course requires enrollment).

**Alternative:** NextAuth/Auth.js + Postgres (simpler but less “AWS-native”).

---

## 5.3 Backend

- **Frontend:** Next.js as above.
- **Backend:** Python FastAPI  

Backend exposes REST endpoints for:

- /courses CRUD
- /enrollments
- /resources
- /chat (RAG pipeline)

Deployed on:

- AWS ECS Fargate **or**
- AWS Lambda + API Gateway

---

## 5.4 Data Storage

**Relational DB:**  
Amazon RDS (PostgreSQL) or Aurora Postgres.  
**ORM:** SQLAlchemy

Tables include (simplified):

- users (app-level user data; Cognito ID as foreign key)
- courses
- enrollments (user_id, course_id)
- resources (course_id, owner_user_id, visibility, type, path/url, section)
- chat_sessions (optional)
- chat_messages (optional)

**File Storage:** Amazon S3

- Store S3 keys/URLs in resources table.
- Use pre-signed URLs for secure uploads/downloads.

---

## 5.5 Vector Store / RAG Layer

Two main approaches:

### **Approach 1 – Managed RAG with Amazon Bedrock Knowledge Bases**

- Use S3 as a source of truth for course materials.
- Configure an Amazon Bedrock Knowledge Base:
  - Connected to the S3 bucket.
  - Uses an embedding model and a managed vector store behind the scenes.
- For course-scoped retrieval:
  - Either:
    - Use separate KBs per course, or
    - Use metadata (e.g., course_id in object path) and filter.

**Pros:** Managed, production-grade, less implementation work.  
**Cons:** Less low-level control (fine for MVP).

---

### **Approach 2 – Custom RAG with OpenSearch / pgvector**

- Use Amazon OpenSearch Serverless with vector fields, or Postgres + pgvector.

Implement ingestion:

- Extract text from PDFs & notes.
- Call Bedrock embedding model.
- Store embeddings in vector index with metadata (course_id, resource_id).

At query time:

- Perform vector similarity search.
- Pass results to the LLM.

**Pros:** Demonstrates deep understanding of RAG internals.  
**Cons:** More infra + implementation work.

Recommendation:

- Start with **Approach 1** (Knowledge Bases).
- Optionally add a small feature using **Approach 2** as an “advanced experiment”.

---

## 5.6 GenAI Models (LLM + Embeddings)

**Provider:** Amazon Bedrock

**LLM:**

- Claude 3.5 Sonnet  
- Llama 3 instruct  
- (or similar)

**Embeddings:**

- Bedrock embedding models (if doing custom RAG).
- If using Knowledge Bases → handled automatically.

**Main backend flow for chat:**

1. Validate user and course context.
2. Retrieve documents from KB or vector store.
3. Construct a prompt including:
   - user question  
   - relevant chunks with citations  
   - user onboarding info  
4. Call Bedrock LLM.
5. Return response + resource IDs.
6. Frontend displays answer + clickable sources.

---

## 5.7 Optional: Agent Workflows with Amazon Bedrock AgentCore

Not required for MVP — but a “stretch goal”.

Use AgentCore for things like:

- “Generate a practice exam for this course based on Past Exams section.”

Backend defines an agent workflow:

- Tools: call KB, generate questions/solutions.

Frontend:

- Button (e.g., “Generate practice questions”) triggers the workflow.

Mentioning AgentCore adds value in interviews.

---

## 5.8 Infrastructure & DevOps

**Infrastructure as Code:**

- AWS CDK (TypeScript) or Terraform.

Define:

- VPC
- RDS
- S3 buckets
- Cognito
- Bedrock permissions
- Optional: OpenSearch

**Monitoring:**

- CloudWatch (logs + metrics)

**Local Dev:**

- Docker for backend
- .env files (use Secrets Manager in production)

---

## 5.9 Development Tooling

- Amazon Q Developer in IDE (for AWS tasks)
- **Testing:**
  - Jest / Vitest (frontend)
  - Pytest / Jest (backend depending on language)

---

## 6. Summary

This document defines:

- **The product:** an AI Teaching Assistant that organizes courses and gives course-aware help.
- **The UX/UI:** dark, ChatGPT-like interface; private, credential-gated courses; structured resources; course-aware chat with citations.
- **The MVP:** onboarding, course creation/join, resources with shared/personal visibility, RAG-powered course-aware chat.
- **The tech stack:**  
  Next.js + Tailwind → Frontend  
  Cognito, RDS Postgres, S3, Bedrock (LLM + Knowledge Bases or custom RAG) → Backend  
  Optional → FastAPI + AgentCore for advanced workflows.

---
