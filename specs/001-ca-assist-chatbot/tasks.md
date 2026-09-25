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

- [ ] T001 Create `package.json` and `package-lock.json` for Vite, React, TypeScript, `react-markdown`, and ESLint; define `dev`, `lint`, `typecheck`, and `build` scripts and use Node 20.
- [ ] T002 [P] Configure Vite's production base as `/CA_Chatbot/` in `vite.config.ts`.
- [ ] T003 [P] Configure ESLint for React and TypeScript in `eslint.config.js`.
- [ ] T004 Create the HTML entry and React bootstrap in `index.html` and `src/main.tsx`, and establish the root component in `src/App.tsx`.
- [ ] T005 [P] Ignore `node_modules/`, `dist/`, and `.env.local` in `.gitignore`.

## Phase 2: Foundational

- [ ] T006 [P] Define strictly typed `Message`, conversation role, and request-state types in `src/types/chat.ts`.
- [ ] T007 [P] Declare the `VITE_GEMINI_API_KEY` environment property without `any` in `src/vite-env.d.ts`.

## Phase 3: User Story 1 - Ask a CA Question (Priority: P1) MVP

**Goal**: Let a user submit a supported Indian CA question, receive a context-aware, readable response, and see the general-information disclaimer.

**Independent Test**: With a valid local API key, ask “What is the ITR filing due date for salaried individuals?” and confirm the question and relevant response appear, a follow-up uses preceding messages, Markdown lists/bold/tables render, and the exact disclaimer remains visible.

- [ ] T008 [P] [US1] Define the fixed CA-assistant system instruction for Indian income tax, GST, TDS, ITR filing, and accounting, including the general-information boundary, in `src/services/systemPrompt.ts`.
- [ ] T009 [US1] Implement a typed Gemini `generateContent` client in `src/services/gemini.ts` using `fetch`, one `gemma-4-26b-a4b-it` model constant, `systemInstruction`, and the complete current conversation history.
- [ ] T010 [P] [US1] Implement a labeled text-entry form and Send action, including Enter-to-submit and whitespace-only input prevention, in `src/components/ChatInput.tsx`.
- [ ] T011 [P] [US1] Render user and assistant messages in order and render assistant Markdown with `react-markdown` in `src/components/MessageList.tsx`.
- [ ] T012 [P] [US1] Create a persistent footer containing the exact disclaimer text in `src/components/Disclaimer.tsx`.
- [ ] T013 [US1] Connect conversation state, submission, Gemini responses, `ChatInput`, `MessageList`, and `Disclaimer` in `src/App.tsx`.

## Phase 4: User Story 2 - Redirect an Off-Topic Question (Priority: P2)

**Goal**: Politely decline unrelated questions and direct users back to supported CA topics.

**Independent Test**: Ask for a recipe, both in a new conversation and after a CA question; confirm the assistant declines the unrelated request, gives no recipe instructions, and redirects to Indian tax, GST, TDS, ITR filing, or accounting.

- [ ] T014 [US2] Add explicit off-topic refusal and redirect behavior to the fixed system instruction in `src/services/systemPrompt.ts`, preserving the supported CA scope and general-information disclaimer boundary.

## Phase 5: User Story 3 - Recover from a Delayed or Failed Answer (Priority: P2)

**Goal**: Show request progress and allow safe retry after timeout, rate limiting, or other API failures.

**Independent Test**: Simulate a delayed request and API responses for HTTP 429, other HTTP errors, and a missing key; confirm Thinking is shown, requests stop at 30 seconds, safe explanatory errors appear without raw credentials/details, and Retry resubmits the same question.

- [ ] T015 [P] [US3] Add a 30-second `AbortController` timeout and map HTTP 429, timeout, missing-key, and other failures to typed user-safe outcomes in `src/services/gemini.ts`.
- [ ] T016 [P] [US3] Create a request-status component that displays Thinking and recoverable error messages with a Retry action in `src/components/RequestStatus.tsx`.
- [ ] T017 [US3] Integrate pending/error/success status and same-question retry behavior with the chat flow in `src/App.tsx`.

## Phase 6: User Story 5 - Use the Chat Across Devices and Input Methods (Priority: P2)

**Goal**: Make chat usable on mobile and desktop, operable by keyboard, and understandable through assistive technology.

**Independent Test**: Complete a question-and-answer flow at mobile and desktop widths using only the keyboard; verify visible focus, operable controls, announcements for new replies and meaningful status changes, and no obscured input or disclaimer.

- [ ] T018 [P] [US5] Add an appropriate ARIA live region for new assistant replies in `src/components/MessageList.tsx`.
- [ ] T019 [P] [US5] Announce pending and recoverable error status changes through an accessible live region in `src/components/RequestStatus.tsx`.
- [ ] T020 [P] [US5] Ensure input labels, button names, keyboard operation, and visible focus behavior are accessible in `src/components/ChatInput.tsx`.
- [ ] T021 [P] [US5] Implement responsive mobile and desktop layout, readable long messages, visible focus styling, and an unobscured persistent disclaimer in `src/App.css`.

## Phase 7: User Story 4 - Start a Fresh Conversation (Priority: P3)

**Goal**: Clear the active conversation and ensure messages are not restored after reload.

**Independent Test**: Send messages, activate New chat, and confirm the view is empty; reload after another conversation and confirm previous messages do not return.

- [ ] T022 [US4] Create a clearly labeled New chat control in `src/components/ChatHeader.tsx`.
- [ ] T023 [US4] Wire New chat to clear conversation and transient request/error state in `src/App.tsx`; keep conversation state in memory only and do not read or write browser storage.

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T024 [P] Create `.github/workflows/deploy.yml` to run on pushes to `main` and `workflow_dispatch`, use Node 20 and `npm ci`, run lint/type-check/build before deployment, and deploy `dist/` with GitHub Pages Actions using only `contents: read`, `pages: write`, and `id-token: write` permissions.
- [ ] T025 Document local `.env.local` setup, `npm run dev`, required `GEMINI_API_KEY` repository secret, Pages configuration, and the fact that a Vite `VITE_*` value is inspectable in browser assets in `README.md`; do not include a real key.
- [ ] T026 Measure the production bundle's gzip size and reduce dependencies or adjust imports in `package.json` and `src/` as needed to keep it below 300 KB gzipped; record the measured size and load-budget verification approach in `README.md`.
- [ ] T027 Verify lint, TypeScript checking, and production build scripts in `package.json`; confirm the Pages base path resolves app assets under `/CA_Chatbot/` in `vite.config.ts` and `.github/workflows/deploy.yml`.

## Dependencies & Execution Order

- Setup first; shared foundational types and env declaration next.
- US1 is the P1 MVP. US2 and US3 depend on its prompt, API client, or chat flow. US5 depends on the UI and request-status component. US4 depends on in-memory conversation state. Finish with cross-cutting deployment and budget checks.

## Parallel Opportunities

- US1: T008 and T010–T012 can start independently; T009 follows T008, T013 integrates the components and API.
- US3: T015 and T016 can run in parallel; T017 integrates them.
- US5: T018–T021 target different files and can run in parallel after their component foundations exist.
- Polish: T024 can proceed alongside T025/T026; sequence T025 and T026 because both edit `README.md`; run T027 last.

## Implementation Strategy

1. Complete Setup and Foundational tasks.
2. Deliver and independently validate the US1 MVP.
3. Add US2, US3, US5, and US4 in dependency order, independently validating each.
4. Complete GitHub Pages automation, documentation, bundle-size, and quality-gate checks.

## Notes

- Automated test implementation tasks are omitted because the feature specification does not request them; independent manual criteria are provided above.
- The local `plan.md` is still an unfilled template. This file records the technologies from the PRD/spec and must be reconciled with a completed plan when that planning workflow is run.
- Never commit or document a real API key. Vite embeds `VITE_*` values in browser assets, so the deployed client-side value is inspectable.
