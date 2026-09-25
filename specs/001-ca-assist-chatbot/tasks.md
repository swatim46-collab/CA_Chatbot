---
description: "Actionable implementation tasks for CA Assist Chatbot"
---

# Tasks: CA Assist Chatbot

**Input**: Design documents from `specs/001-ca-assist-chatbot/`

**Prerequisites**: `plan.md` (present but still an unfilled template), `spec.md`; product constraints from `prd.md` and `.specify/memory/constitution.md`

**Tests**: No automated test tasks are included because the feature specification does not explicitly request tests or a TDD workflow. Each story includes an independent manual verification criterion.

**Organization**: Tasks are grouped by the five prioritized user stories in `spec.md`. Paths assume a single-project Vite + React + strict TypeScript app in `src/`, with project configuration at the repository root.

## Phase 1: Setup

**Purpose**: Initialize the static web application and its development tooling.

- [X] T001 Create `package.json` and `package-lock.json` for Vite, React, TypeScript, `react-markdown`, and ESLint; define `dev`, `lint`, `typecheck`, and `build` scripts and use Node 20.
- [X] T002 [P] Configure Vite's production base as `/CA_Chatbot/` in `vite.config.ts`.
- [X] T003 [P] Configure ESLint for React and TypeScript in `eslint.config.js`.
- [X] T004 Create the HTML entry and React bootstrap in `index.html` and `src/main.tsx`, and establish the root component in `src/App.tsx`.
- [X] T005 [P] Ignore `node_modules/`, `dist/`, and `.env.local` in `.gitignore`.

---

## Phase 2: Foundational

**Purpose**: Define shared types and environment typing required by the application stories.

- [X] T006 [P] Define strictly typed `Message`, conversation role, and request-state types in `src/types/chat.ts`.
- [X] T007 [P] Declare the `VITE_GEMINI_API_KEY` environment property without `any` in `src/vite-env.d.ts`.

**Checkpoint**: Project setup and shared types are ready; complete US1 before story work that extends its chat and API integration.

---

## Phase 3: User Story 1 - Ask a CA Question (Priority: P1) 🎯 MVP

**Goal**: Let a user submit a supported Indian CA question, receive a context-aware, readable response, and see the general-information disclaimer.

**Independent Test**: With a valid local API key, ask “What is the ITR filing due date for salaried individuals?” and confirm the question and relevant response appear, a follow-up uses preceding messages, Markdown lists/bold/tables render, and the exact disclaimer remains visible.

### Implementation for User Story 1

- [X] T008 [P] [US1] Define the fixed CA-assistant system instruction for Indian income tax, GST, TDS, ITR filing, and accounting, including the general-information boundary, in `src/services/systemPrompt.ts`.
- [X] T009 [US1] Implement a typed Gemini `generateContent` client in `src/services/gemini.ts` using `fetch`, one `gemma-4-26b-a4b-it` model constant, the fixed CA prompt prepended to the first user turn, and the complete current conversation history.
- [X] T010 [P] [US1] Implement a labeled text-entry form and Send action, including Enter-to-submit and whitespace-only input prevention, in `src/components/ChatInput.tsx`.
- [X] T011 [P] [US1] Render user and assistant messages in order and render assistant Markdown with `react-markdown` in `src/components/MessageList.tsx`.
- [X] T012 [P] [US1] Create a persistent footer containing the exact disclaimer text in `src/components/Disclaimer.tsx`.
- [X] T013 [US1] Connect conversation state, submission, Gemini responses, `ChatInput`, `MessageList`, and `Disclaimer` in `src/App.tsx`.

**Checkpoint**: A supported question and follow-up work end-to-end with readable output and a persistent disclaimer.

---

## Phase 4: User Story 2 - Redirect an Off-Topic Question (Priority: P2)

**Goal**: Politely decline unrelated questions and direct users back to supported CA topics.

**Independent Test**: Ask for a recipe, both in a new conversation and after a CA question; confirm the assistant declines the unrelated request, gives no recipe instructions, and redirects to Indian tax, GST, TDS, ITR filing, or accounting.

### Implementation for User Story 2

- [X] T014 [US2] Add explicit off-topic refusal and redirect behavior to the fixed system instruction in `src/services/systemPrompt.ts`, preserving the supported CA scope and general-information disclaimer boundary.

**Checkpoint**: Off-topic requests are redirected consistently without producing unrelated content.

---

## Phase 5: User Story 3 - Recover from a Delayed or Failed Answer (Priority: P2)

**Goal**: Show request progress and allow safe retry after timeout, rate limiting, or other API failures.

**Independent Test**: Simulate a delayed request and API responses for HTTP 429, other HTTP errors, and a missing key; confirm Thinking is shown, requests stop at 30 seconds, safe explanatory errors appear without raw credentials/details, and Retry resubmits the same question.

### Implementation for User Story 3

- [X] T015 [P] [US3] Add a 30-second `AbortController` timeout and map HTTP 429, timeout, missing-key, and other failures to typed user-safe outcomes in `src/services/gemini.ts`.
- [X] T016 [P] [US3] Create a request-status component that displays Thinking and recoverable error messages with a Retry action in `src/components/RequestStatus.tsx`.
- [X] T017 [US3] Integrate pending/error/success status and same-question retry behavior with the chat flow in `src/App.tsx`.

**Checkpoint**: Every pending request has a visible status and every supported failure has a safe, working recovery path.

---

## Phase 6: User Story 5 - Use the Chat Across Devices and Input Methods (Priority: P2)

**Goal**: Make chat usable on mobile and desktop, operable by keyboard, and understandable through assistive technology.

**Independent Test**: Complete a question-and-answer flow at mobile and desktop widths using only the keyboard; verify visible focus, operable controls, announcements for new replies and meaningful status changes, and no obscured input or disclaimer.

### Implementation for User Story 5

- [X] T018 [P] [US5] Add an appropriate ARIA live region for new assistant replies in `src/components/MessageList.tsx`.
- [X] T019 [P] [US5] Announce pending and recoverable error status changes through an accessible live region in `src/components/RequestStatus.tsx`.
- [X] T020 [P] [US5] Ensure input labels, button names, keyboard operation, and visible focus behavior are accessible in `src/components/ChatInput.tsx`.
- [X] T021 [P] [US5] Implement responsive mobile and desktop layout, readable long messages, visible focus styling, and an unobscured persistent disclaimer in `src/App.css`.

**Checkpoint**: The primary chat interaction remains understandable and operable across viewport sizes, keyboard navigation, and live status announcements.

---

## Phase 7: User Story 4 - Start a Fresh Conversation (Priority: P3)

**Goal**: Clear the active conversation and ensure messages are not restored after reload.

**Independent Test**: Send messages, activate New chat, and confirm the view is empty; reload after another conversation and confirm previous messages do not return.

### Implementation for User Story 4

- [X] T022 [US4] Create a clearly labeled New chat control in `src/components/ChatHeader.tsx`.
- [X] T023 [US4] Wire New chat to clear conversation and transient request/error state in `src/App.tsx`; keep conversation state in memory only and do not read or write browser storage.

**Checkpoint**: Users can reset the visible conversation, and reload never restores prior chat content.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Complete secure setup, quality gates, deployment, and documented operation.

- [X] T024 [P] Create `.github/workflows/deploy.yml` to run on pushes to `main` and `workflow_dispatch`, use Node 20 and `npm install`, run lint/type-check/build before deployment, and deploy `dist/` with GitHub Pages Actions using only `contents: read`, `pages: write`, and `id-token: write` permissions.
- [X] T025 Document local `.env.local` setup, `npm run dev`, required `GEMINI_API_KEY` repository secret, Pages configuration, and the fact that a Vite `VITE_*` value is inspectable in browser assets in `README.md`; do not include a real key.
- [X] T026 Measure the production bundle's gzip size and reduce dependencies or adjust imports in `package.json` and `src/` as needed to keep it below 300 KB gzipped; record the measured size and load-budget verification approach in `README.md`.
- [X] T027 Verify lint, TypeScript checking, and production build scripts in `package.json`; confirm the Pages base path resolves app assets under `/CA_Chatbot/` in `vite.config.ts` and `.github/workflows/deploy.yml`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No prior dependencies. T002, T003, and T005 can proceed in parallel with the app bootstrap after T001 establishes the project dependencies and scripts.
- **Foundational (Phase 2)**: Depends on Setup; shared type and environment declaration tasks can proceed in parallel.
- **User Story 1 (Phase 3)**: Depends on Setup and Foundational. The system instruction and standalone UI components can be implemented in parallel; the API client depends on the system instruction, and App integration depends on the API client and UI components.
- **User Story 2 (Phase 4)**: Depends on US1's system instruction and Gemini integration.
- **User Story 3 (Phase 5)**: Depends on US1's API and chat flow. The client failure mapping and status component can proceed in parallel; App integration depends on both.
- **User Story 5 (Phase 6)**: Depends on the US1 UI and US3 status component; accessibility refinements to separate components and responsive CSS can proceed in parallel.
- **User Story 4 (Phase 7)**: Depends on US1's conversation state; the App reset wiring depends on the New chat control.
- **Polish (Phase 8)**: Depends on all selected stories and project scripts; documentation and workflow work can proceed in parallel, while final verification depends on both.

### User Story Dependencies

- **US1 (P1)**: First user-facing increment after Setup and Foundational; no dependency on other stories.
- **US2 (P2)**: Depends on the US1 system instruction and Gemini client.
- **US3 (P2)**: Depends on the US1 API client and chat flow.
- **US5 (P2)**: Depends on the US1 interface and US3 request-status UI.
- **US4 (P3)**: Depends on the US1 in-memory conversation state.

### Parallel Opportunities

- After T001, setup configuration tasks T002, T003, and T005 can run in parallel; T004 establishes the application entry files.
- In US1, T008 and the independent component tasks T010-T012 can start in parallel; T009 follows T008, and T013 integrates completed components and API work.
- In US3, T015 and T016 modify separate files and can run in parallel; T017 integrates them.
- In US5, T018-T021 target distinct files and can run in parallel once their component foundations exist.
- In Polish, T024 can proceed in parallel with T025 and T026 because it changes only the workflow file; T025 and T026 both update `README.md` and should be sequenced. T027 is the final cross-file verification.

---

## Parallel Example: User Story 1

```text
Task: T008 Define the fixed CA-focused system instruction in src/services/systemPrompt.ts
Task: T010 Implement the message-entry form in src/components/ChatInput.tsx
Task: T011 Implement Markdown message rendering in src/components/MessageList.tsx
Task: T012 Implement the persistent disclaimer in src/components/Disclaimer.tsx
```

After those independent tasks complete, implement T009 and then integrate the pieces in T013.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases.
2. Complete US1 and validate a supported question, follow-up context, Markdown rendering, and disclaimer.
3. Stop and verify the P1 experience independently before proceeding.

### Incremental Delivery

1. Deliver US1 as the core assistant experience.
2. Add US2 domain-boundary redirects and validate off-topic requests.
3. Add US3 progress, timeout, safe failure handling, and retry.
4. Add US5 responsive and accessible interaction, then US4 conversation reset behavior.
5. Complete Pages automation, documentation, bundle-budget, and release-gate verification.

## Notes

- `[P]` appears only where tasks work on distinct files and have no unmet task dependency.
- `[US#]` labels map directly to the user stories in `specs/001-ca-assist-chatbot/spec.md`.
- Automated test implementation tasks are intentionally omitted; the independent test criteria above are manual verification guidance from the spec.
- The supplied `plan.md` remains an unfilled template. The chosen paths and technologies are grounded in `prd.md`, `spec.md`, and `.specify/memory/constitution.md` and should be reflected in a completed plan in a later planning pass if the plan is intended to be authoritative.
- Never commit or document a real API key. A Vite `VITE_*` value is embedded in client assets and cannot be treated as a runtime secret.
