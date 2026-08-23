# Implementation Plan: Competitive Gap Features

This plan outlines the architecture and steps required to build the top features that will bring Career OS up to par with industry leaders like TealHQ and Simplify Copilot, and eventually surpass them.

## Phase 1: Career OS Chrome Extension (Job Scraper & Auto-Fill)
A standalone satellite project that injects a UI into LinkedIn and Indeed. This addresses the immediate gap established by Simplify and Teal, acting as a massive user acquisition funnel.

### Extension Architecture (`career-os-extension`)
- **[NEW] `manifest.json` (V3)**
  - Request permissions for `activeTab`, `storage`, and `identity`.
- **[NEW] `src/contentScrapers/linkedin.js` & `indeed.js`**
  - DOM traversal scripts to extract: `Job Title`, `Company Name`, `Location`, `Salary`, and `Description`.
- **[NEW] `src/autoFill/formMapper.js`**
  - Auto-fill logic to map candidate data into common ATS inputs (e.g. Greenhouse, Lever) on a button click.
- **[NEW] `src/popup/Popup.jsx`**
  - A mini React app that accepts the scraped data, prompts the user to select which "Pipeline Phase" (e.g., Wishlist) to save it in, and makes an authenticated `POST` request to `https://api.careeros.com/api/jobs`.
- **[MODIFY] `career-os-api/app/Http/Controllers/Api/AuthController.php`**
  - Ensure API supports long-lived Personal Access Tokens (Sanctum/Passport) specifically for the Chrome Extension.

---

## Phase 2: AI Cover Letter Generator
Leverages the existing OpenAI/Groq integration used by the Resume Match Checker to generate highly tailored cover letters.

### Backend Changes (`career-os-api`)
- **[NEW] `database/migrations/xxxx_create_cover_letters_table.php`**
  - Create a table linking `job_id`, `resume_id`, `user_id`, and `content` (text).
- **[NEW] `app/Models/CoverLetter.php`**
- **[NEW] `app/Services/OpenAIService.php` (or modify existing)**
  - Expand the AI service to include a `generateCoverLetter($resumeText, $jobDescription)` method.
- **[NEW] `app/Http/Controllers/Api/CoverLetterController.php`**
  - Endpoints: `POST /api/jobs/{job}/cover-letter/generate`, `GET /api/jobs/{job}/cover-letter`.

### Frontend Changes (`career-os-frontend`)
- **[NEW] `src/features/jobs/components/CoverLetterGenerator.jsx`**
  - A new sub-view inside the `JobDetails` component that displays the generated text in a rich-text editor for manual tweaks.
- **[MODIFY] `src/features/jobs/components/JobDetails.jsx`**
  - Add a "Cover Letter" tab next to the job description and notes.

---

## Phase 3: CRM & Contacts Integration
Adds a relational database layer that allows candidates to track recruiters and referral contacts, closing the Networking CRM gap with Teal.

### Backend Changes (`career-os-api`)
- **[NEW] `database/migrations/xxxx_create_job_contacts_table.php`**
  - Fields: `id`, `job_id`, `name`, `role`, `email`, `linkedin_url`, `last_contact_date`, `notes`.
- **[NEW] `app/Models/JobContact.php`**
  - Define `belongsTo(Job::class)` relationship.
- **[NEW] `app/Http/Controllers/Api/JobContactController.php`**
  - Basic CRUD endpoints for managing contacts.

### Frontend Changes (`career-os-frontend`)
- **[NEW] `src/features/jobs/components/ContactsList.jsx`**
  - A CRM list-style UI inside Job Details to track people related to the application.
- **[NEW] `src/features/reminders/services/reminderAutomation.jsx`**
  - Automatically suggest standard "Follow-up" reminders 7 days after the `last_contact_date`.

---

## Phase 4: Conversational AI Career Assistant (Chatbot)
Our first major competitive moat against form-based competitors. An intelligent floating chat interface.

### Backend Changes (`career-os-api`)
- **[NEW] `app/Services/AICoachService.php`**
  - RAG logic: bundles `active jobs`, `uploaded resume`, and `mock test scores` context silently into the system prompt.
- **[NEW] `app/Http/Controllers/Api/AICoachController.php`**
  - Endpoint: `POST /api/coach/chat` (streaming).

### Frontend Changes (`career-os-frontend`)
- **[NEW] `src/features/dashboard/components/AICoachWidget.jsx`**
  - A persistent floating React component with a chat UI.

---

## Phase 5: Autonomous Auto-Apply Engine (The Ultimate Moat)
Our long-term value driver: A serverless backend worker that spins up headless browsers to autonomously fill out forms without user intervention. (*See `auto_apply_engine_rd.md` for dedicated architecture*).

---

## Verification Plan

### Phase 1
- Load the unpacked extension locally in Chrome.
- Navigate to a LinkedIn Job posting, extract fields, and verify it appears instantly in the frontend React dashboard.
- Test Autofill into Greenhouse forms.

### Phase 2 & 3
- Run backend database migrations.
- Validate Cover Letter generation endpoint timeouts.
- Test cascading deletes on Jobs ensuring contacts delete properly.
