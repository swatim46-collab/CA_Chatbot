<!--
Sync Impact Report
Version change: 1.0.0 → 1.0.1
Modified principles: II (Gemma-compatible prompt placement clarified)
Added sections: Additional Constraints; Development Workflow
Removed sections: none
Follow-up TODOs: Confirm the original ratification date.
-->

# CA Assist Constitution

## Core Principles

### I. Indian CA Domain and General-Information Boundary
CA Assist MUST focus on Indian income tax, GST, TDS, ITR filing, and accounting. The
assistant MUST politely redirect off-topic requests to these subjects and MUST present
responses as general information, not individualized professional advice. The exact
disclaimer, “For general information only. Consult a qualified CA for advice.”, MUST
remain visible on every screen size. This boundary keeps the product useful without
misrepresenting its authority.

### II. Single Approved Model and Grounded API Contract
The only approved model and provider are `gemma-4-26b-a4b-it` through the Google Gemini
API `generateContent` REST endpoint. The model identifier MUST live in one application
constant; the UI MUST NOT offer model or provider selection. Requests MUST use the
CA-focused prompt prepended to the first user turn, because the tested Gemma
endpoint rejects `systemInstruction`, and include the conversation history. Gemini
integration MUST remain in a dedicated typed client using `fetch`, without `any`. These
constraints keep behavior and API ownership consistent and auditable.

### III. Strict, Accessible, Responsive User Experience
The application MUST use Vite, React, strict TypeScript, and plain CSS, with no UI
component library. Chat MUST support a message list, text input, Send button, Enter to
send, a Thinking status, retryable user-safe errors, and a New chat action. The interface
MUST support keyboard navigation, visible focus, an ARIA live region that announces new
assistant replies and meaningful status changes, and mobile and desktop layouts. Assistant
responses MUST render Markdown with `react-markdown`
and MUST NOT use `dangerouslySetInnerHTML`. These requirements make the experience
maintainable and usable across devices and assistive technologies.

### IV. Reliable and Verifiable Delivery
Gemini requests MUST time out after 30 seconds and MUST give a clear, user-safe response
to HTTP 429 and other failures with a Retry action. Changes MUST pass linting, TypeScript
checks, and a production build before deployment. The production bundle MUST remain below
300 KB gzipped, and the app MUST load in under 2 seconds on a 4G connection. Automated
quality gates and explicit budgets reduce regressions in a static app.

### V. Static Architecture and Responsible Key Handling
The product MUST remain a static single-page application; it MUST NOT add a backend,
database, serverless function, login, persisted chat history, document upload, or
streaming responses. API keys MUST NOT be committed, hardcoded, logged, or placed in
documentation. Local development MUST use ignored `.env.local`; CI MUST obtain the key
from the `GEMINI_API_KEY` repository secret and pass it to the build as
`VITE_GEMINI_API_KEY`. Because Vite embeds `VITE_*` values in browser assets, the deployed
key is inspectable and MUST be restricted by API/referrer controls and quotas where
available. This preserves the requested serverless architecture while making its key
exposure risk explicit.

## Additional Constraints

- The technology stack is Vite, React, TypeScript, plain CSS, `react-markdown`, and the
  Google Gemini `generateContent` REST API called with `fetch`.
- The app reads its key only from `import.meta.env.VITE_GEMINI_API_KEY`.
- GitHub Pages is the sole hosting target. Vite's `base` MUST match the repository path.
- The Vite proxy for Gemini MUST be limited to local development; production MUST remain
  a static site that calls the Gemini endpoint directly.
- The persistent disclaimer and general-information boundary in Principle I apply to
  every release.

## Development Workflow

- The GitHub Actions workflow MUST run for pushes to `main` and `workflow_dispatch`, use
  Node 20 and `npm install`, and run lint and type-check before building.
- The workflow MUST stop before deployment if lint, type-check, or build fails. It MUST
  deploy the generated static artifact through GitHub Pages Actions.
- Workflow permissions MUST be limited to the required `contents: read`, `pages: write`,
  and `id-token: write` permissions.
- Changes to chat behavior MUST verify a supported CA question, an off-topic redirect,
  the disclaimer, and request failure handling. UI changes MUST also verify keyboard
  interaction and responsive layouts.

## Governance

This constitution governs product, implementation, review, and release decisions. The
PRD and implementation plans MUST conform to it; any conflict MUST be resolved by
amending this constitution or changing the conflicting artifact before release.

Amendments MUST be proposed in writing with the rationale and affected principles,
reviewed for consistency with the PRD and security constraints, and recorded by updating
the version and last-amended date. Reviewers and implementers MUST check affected work
against the principles and the quality gates in this document. The version uses
MAJOR.MINOR.PATCH: MAJOR for backward-incompatible governance changes or removals,
MINOR for new principles or materially expanded requirements, and PATCH for clarifications
and non-semantic edits. Compliance MUST be reviewed during feature planning and before
deployment; unmet requirements MUST block release or be explicitly resolved through a
constitution amendment.

**Version**: 1.0.1 | **Ratified**: TODO(RATIFICATION_DATE): Original adoption date is not documented. | **Last Amended**: 2026-09-25
