---
name: "CA Assist Project Guidelines"
description: "Use when building or changing the CA Assist Vite, React, TypeScript, Gemini API, chat UI, accessibility, security, or GitHub Pages deployment code."
applyTo:
  - "src/**/*"
  - "public/**/*"
  - "package.json"
  - "package-lock.json"
  - "vite.config.*"
  - "tsconfig*.json"
  - "eslint.config.*"
  - ".github/workflows/**/*"
  - ".github/instructions/**/*"
  - "*.md"
  - ".gitignore"
---

# CA Assist Project Guidelines

## Product and domain

- Treat `prd.md` as the product source of truth for CA Assist, a general-information assistant for Indian income tax, GST, TDS, ITR filing, and accounting.
- Keep answers scoped to Chartered Accountant topics. Off-topic requests must receive a polite redirect to supported topics.
- Keep the exact persistent disclaimer visible: `For general information only. Consult a qualified CA for advice.`
- Do not add login, stored chat history, uploads, streaming, a backend, serverless functions, or model selection.

## Application architecture

- Use Vite, React, and strict TypeScript with plain CSS. Do not add a UI component library or another framework.
- Keep Gemini calls in a dedicated, typed API client module. Do not use `any`; preserve narrow message and API response types.
- Use `react-markdown` for assistant replies. Do not render model output with `dangerouslySetInnerHTML`.
- Keep the model name in one constant: `gemma-4-26b-a4b-it`. Do not introduce another model or provider.
- Call the Gemini `generateContent` REST endpoint with `fetch` and send the full conversation history. Gemma 4 rejects `systemInstruction`; prepend the fixed CA-focused prompt to the first user turn in the request instead.
- Enforce a 30-second request timeout. Map HTTP 429, timeout, missing-key, and other API failures to clear user-safe errors with a Retry action; never expose raw secrets or internal error details.

## Chat behavior and accessibility

- Preserve the message list, text input, Send action, Enter-to-send behavior, Thinking state, Retry action, and New chat reset behavior.
- Keep the interface responsive on mobile and desktop, keyboard navigable, visibly focused, and compatible with WCAG 2.1 AA expectations.
- Announce new replies and meaningful status changes through an appropriate ARIA live region.
- Keep controls and labels understandable without relying on color alone.

## Configuration and security

- Read the API key only from `import.meta.env.VITE_GEMINI_API_KEY`.
- Use `.env.local` for local development and keep it ignored. CI may provide `VITE_GEMINI_API_KEY` from the `GEMINI_API_KEY` repository secret at build time.
- Never hardcode, commit, log, or include an API key in source, tests, documentation, generated fixtures, or error messages.
- Remember that Vite embeds `VITE_*` values in browser code: keep the key out of version control, but do not treat the deployed client-side value as a runtime secret. Apply provider-side API and referrer restrictions when available.
- Keep the application static; do not introduce a server or database to work around configuration.

## GitHub Pages delivery

- Keep the production base path aligned with the `CA_Chatbot` repository name and verify asset URLs for GitHub Pages.
- The workflow at `.github/workflows/deploy.yml` must run on pushes to `main` and `workflow_dispatch`, use Node 20 and `npm install`, and stop before deployment if lint, type-check, or build fails.
- Preserve the Pages permissions required by the workflow: `contents: read`, `pages: write`, and `id-token: write`.
- Before completing implementation work, run the narrowest relevant checks and, when the project is buildable, run lint, type-check, and production build.
