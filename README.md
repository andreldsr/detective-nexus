# Detective Nexus

A Next.js (App Router) + Firebase/Firestore detective game starter. Includes email/Google auth and Firestore-backed cases with per-user progress.

## Quick Start

1) Install and run
- npm install
- npm run dev

2) Configure Firebase Admin (server)
This app uses Firebase Admin on the server to read/write Firestore and manage session cookies. Provide a service account as a single-line JSON string in `.env.local`:

```
FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", "project_id": "...", ...}'
```

3) Seed Firestore with a demo case
```
npm run db:upload
```

Then open http://localhost:3000. You’ll be redirected to /login; create an account or use Google Sign-In.

---

## Architecture Overview

- Framework: Next.js App Router (server components for data fetching and client components for interactivity)
- Data store: Firestore (via Firebase Admin SDK on the server; client SDK only for auth)
- Auth: Firebase Auth (email/password + Google). Client obtains ID token, server exchanges it for an httpOnly session cookie
- UI: Tailwind + shadcn/ui components

Key directories
- src/app: Routes, layouts, and API routes
  - page.tsx: Home page lists cases from Firestore
  - cases/[caseId]/page.tsx: Case detail page renders the Detective Board
  - api/auth/session/route.ts: Exchanges ID token for a secure session cookie and clears it on logout
- src/components: UI and feature components (Detective Board, panels, modals, auth UI)
- src/lib: Firebase/client setup, Firebase Admin setup, services for cases/users, types and seed data
- scripts/upload-case.ts: CLI script to upload the demo case

---

## How It Works (Request Lifecycle)

1) Authentication
- Client uses Firebase Auth SDK (email/password or Google popup)
- After login, the client calls POST /api/auth/session with the Firebase ID token
- The server verifies the ID token with Firebase Admin and sets an httpOnly `session` cookie
- Server routes read the `session` cookie and verify it to identify the user (src/lib/server-auth.ts)

2) Home page (/)
- Server component calls listCases() (src/lib/case-service.ts) via Firebase Admin to read the `cases` collection
- If the user is logged in, the header shows their displayName and a Sign Out button
- Clicking a case navigates to /cases/[caseId]

3) Case page (/cases/[caseId])
- Server component calls getCase(caseId) to fetch case data and validate it with zod
- It also calls getCurrentUser() and, if logged in, loads saved progress (getCaseProgress)
- It initializes the DetectiveBoard client component with initial unlocked clues/characters (either saved progress or defaults)

4) DetectiveBoard (client)
- Maintains UI state: unlocked clues/characters, current selections, and dialogue modal
- On a “Confront” action, it finds the matching dialogue response for the selected clue and may unlock new clues/characters
- After state changes and if a user is logged in, it saves progress via updateCaseProgress() (server action writing to Firestore)

5) Sign-out
- Client calls signOut() from Firebase Auth and DELETE /api/auth/session to clear the cookie, then redirects to /login

---

## Data Model (zod in src/lib/types.ts)

- CaseData: title, description, difficulty, characters[], clues[], startingClueIds[], startingCharacterIds[]
- Character: id, name, image, imageHint, statement, dialogueTree[]
- Clue: id, title, description, image, imageHint
- Dialogue: clueId, response, optional unlocksClueId, unlocksCharacterId
- UserData: uid, name, email, caseProgress: { [caseId]: CaseProgress }
- CaseProgress: unlockedClueIds[], unlockedCharacterIds[]

---

## Firebase Setup

- Client SDK (src/lib/firebase.ts): used for auth only. Note: values are currently hard-coded for the demo project
- Admin SDK (src/lib/firebase-admin.ts): used on the server for Firestore and auth cookie verification. Reads FIREBASE_SERVICE_ACCOUNT_KEY

To avoid exposing keys, prefer environment variables for all Firebase client config (see Improvements).

---


## Scripts

- npm run db:upload: Validates the demo CaseData with zod and writes it to Firestore at cases/case-1

---

## Auth Guarding

- AuthProvider (client) uses useUser() to detect auth state and redirects:
  - Unauthenticated users are sent to /login for protected pages
  - Authenticated users are redirected away from /login and /signup to /
- Server components rely on getCurrentUser() which verifies the `session` cookie

---

## Things To Improve (Prioritized)

Security and configuration
1) Move client Firebase config to environment variables
   - Replace hard-coded values in src/lib/firebase.ts with NEXT_PUBLIC_ env vars and document them in README
2) Restrict service account permissions
   - Use least-privilege roles; avoid broad Editor for production
3) Cookie and session hardening
   - Set sameSite='lax' (or 'strict' if viable); consider shorter expiry and refresh logic

Developer experience
4) Add local emulator support
   - Support Firebase emulators for Auth and Firestore in development
5) Add linting and formatting
   - eslint + prettier configurations and scripts
6) Add basic tests
   - Unit tests for services (zod validation, mapping) and a few component tests (e.g., confrontation logic)

Reliability and performance
7) Error boundaries and graceful fallbacks
   - Add error.tsx and loading.tsx for routes; handle Firestore failures more gracefully
8) Logging improvements
   - Use a lightweight logger instead of console; gate logs by NODE_ENV
9) Reduce client bundle
   - Lazy-load modal-heavy components; ensure icons/components are tree-shaken

Product features
10) Multi-case progress and resume UI
    - Show progress per case, last played time, and “Continue” CTA on the home page
11) Admin tooling
    - A protected page to create/edit cases and preview dialogue trees

Documentation
13) Expand docs/ with architecture diagrams and contribution guide
14) Add .env.example listing all required variables (client and server)

---

## Connecting to Firebase (Server Admin for local dev)

This application is configured to use Firebase Admin/Firestore to load case data. To run locally and connect to your Firestore project, provide service account credentials.

### 1. Generate a Service Account Key
- Go to your Google Cloud IAM & Admin page
- Select your Firebase project
- Create a service account (e.g., firebase-admin-sdk) with least privileges needed
- Create a JSON key and download it

### 2. Set Up Environment Variable
- Create `.env.local` in the project root
- Paste the entire JSON into FIREBASE_SERVICE_ACCOUNT_KEY as a single line (wrap in single quotes)

```
FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", "project_id": "...", ...}'
```

### 3. Upload Case Data
```
npm run db:upload
```

Now start the dev server:
```
npm run dev
```
