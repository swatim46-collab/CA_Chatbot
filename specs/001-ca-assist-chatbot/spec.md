# Feature Specification: CA Assist Chatbot

**Feature Branch**: `001-ca-assist-chatbot`

**Created**: 2026-09-24

**Status**: Draft

**Input**: User description: "please create spec using #file:prd.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ask a CA Question (Priority: P1)

An individual or small business owner in India asks a question about income tax, GST,
TDS, ITR filing, or accounting and receives a clear, relevant answer in a professional
CA-assistant voice. The answer is general information, reflects the conversation so far,
and is easy to scan.

**Why this priority**: Answering a supported CA question is the core value of CA Assist.

**Independent Test**: Ask a supported question, such as the ITR filing due date for
salaried individuals, and verify that a relevant answer appears and the general-information
disclaimer is visible.

**Acceptance Scenarios**:

1. **Given** the chat is ready, **When** the user submits a supported CA question, **Then**
   the question appears in the conversation and a relevant assistant response is shown.
2. **Given** a conversation already contains messages, **When** the user asks a follow-up,
   **Then** the response reflects the preceding conversation.
3. **Given** an assistant response contains lists, emphasis, or tabular information,
   **When** the response is displayed, **Then** that structure is readable and the
   persistent disclaimer remains visible.

---

### User Story 2 - Redirect an Off-Topic Question (Priority: P2)

A user asks for something unrelated to Indian CA topics and receives a polite refusal that
points them back to supported tax and accounting subjects.

**Why this priority**: A clear domain boundary makes the assistant predictable and reduces
misleading use outside its intended scope.

**Independent Test**: Ask for a recipe and confirm the response declines the request
politely and redirects to Indian tax, GST, TDS, ITR filing, or accounting.

**Acceptance Scenarios**:

1. **Given** the user asks an unrelated question, **When** the assistant responds, **Then**
   it politely declines to answer the unrelated request and suggests supported CA topics.
2. **Given** an unrelated request follows a CA question, **When** the assistant responds,
   **Then** it preserves the domain boundary and does not provide the off-topic content.

---

### User Story 3 - Recover from a Delayed or Failed Answer (Priority: P2)

A user can tell when an answer is being prepared and can recover when a request times out,
fails, or is rate limited, without seeing sensitive technical details.

**Why this priority**: Clear progress and recovery behavior prevents uncertainty and keeps
temporary service failures from ending a conversation unnecessarily.

**Independent Test**: Simulate a delayed request and failures including rate limiting; verify
the progress state, safe error message, and retry path.

**Acceptance Scenarios**:

1. **Given** a request is pending, **When** the assistant is waiting for a response, **Then**
   the user sees a clear Thinking status.
2. **Given** a request fails, times out after 30 seconds, or is rate limited, **When** the
   failure is shown, **Then** the user receives a clear message and a Retry action,
   without raw internal error details or secret service credentials.
3. **Given** a prior request failed, **When** the user chooses Retry, **Then** the same
   question is submitted again and a successful response is displayed when the service
   becomes available.

---

### User Story 4 - Start a Fresh Conversation (Priority: P3)

A user clears the current conversation and starts again without messages from the previous
chat being retained.

**Why this priority**: A simple reset supports a new topic while honoring the product's
no-history scope.

**Independent Test**: Send messages, choose New chat, and verify the conversation is empty
and prior messages do not return after reloading the page.

**Acceptance Scenarios**:

1. **Given** the conversation contains messages, **When** the user chooses New chat,
   **Then** the visible conversation is cleared and the user can submit a new question.
2. **Given** the page is reloaded after a conversation, **When** the chat is opened,
   **Then** the previous conversation is not restored.

---

### User Story 5 - Use the Chat Across Devices and Input Methods (Priority: P2)

A user can use the assistant on a phone or desktop, navigate with a keyboard, and understand
new replies and important status changes with assistive technology.

**Why this priority**: Responsive and accessible interaction is essential for a broad,
reliable public service.

**Independent Test**: Complete a question-and-answer interaction at mobile and desktop
viewport sizes using keyboard-only navigation and an assistive technology live-region
check.

**Acceptance Scenarios**:

1. **Given** the user opens the chat on a mobile or desktop screen, **When** they view and
   use the interface, **Then** the conversation, input, Send action, and disclaimer remain
   usable without broken or obscured content.
2. **Given** the user navigates without a mouse, **When** they reach and operate chat
   controls, **Then** every action is keyboard accessible and the current focus is visible.
3. **Given** a reply or meaningful request status changes, **When** assistive technology
   monitors the chat, **Then** the update is announced through a live region.

---

### Edge Cases

- The user submits an empty or whitespace-only message; it is not sent.
- The user submits repeated messages while a request is pending; duplicate concurrent
  requests are prevented or clearly controlled.
- The request reaches the 30-second limit; the user receives a timeout message and Retry
  action.
- The service returns a rate-limit response; the user receives a clear rate-limit message
  and can retry.
- The service access key is unavailable; the user receives a safe setup or availability
  message and no credential is exposed.
- The response is empty or cannot be displayed as Markdown; the chat remains usable and
  communicates that no answer was received.
- Long user messages or assistant responses remain readable and do not hide the input,
  controls, or disclaimer on narrow screens.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST provide a chat view with a message list, text input, and
  Send action. Pressing Enter MUST submit the message.
- **FR-002**: The assistant MUST answer questions about Indian income tax, GST, TDS, ITR
  filing, and accounting in a professional Chartered Accountant style.
- **FR-003**: The assistant MUST use the full current conversation as context when
  responding to a new message.
- **FR-004**: The assistant MUST politely decline off-topic requests and redirect users to
  the supported CA subject areas.
- **FR-005**: The product MUST present answers as general information and MUST NOT
  represent them as individualized professional advice.
- **FR-006**: The exact disclaimer, "For general information only. Consult a qualified CA
  for advice.", MUST remain visible on every screen size.
- **FR-007**: While an answer is pending, the product MUST display a "Thinking..." status.
- **FR-008**: If a request fails, times out after 30 seconds, or is rate limited, the
  product MUST display a clear, user-safe message and provide a Retry action.
- **FR-009**: Error messages MUST NOT expose secret service credentials or raw internal
  error details.
- **FR-010**: Assistant replies MUST display common Markdown formatting, including lists,
  bold text, and tables.
- **FR-011**: The product MUST provide a New chat action that clears the current visible
  conversation.
- **FR-012**: The product MUST NOT retain or restore chat history after a new chat or page
  reload.
- **FR-013**: The interface MUST adapt to mobile and desktop screens and support keyboard
  navigation with visible focus.
- **FR-014**: The product MUST announce new assistant replies and meaningful status changes
  through an accessible live region.
- **FR-015**: The product MUST prevent empty or whitespace-only messages from being sent.
- **FR-016**: The product MUST meet WCAG 2.1 AA expectations for the supported chat
  interactions, including keyboard access, visible focus, and accessible status updates.

## Key Entities *(include if feature involves data)*

- **Conversation**: The ordered sequence of messages in the currently open chat; it exists
  only for the current session and is cleared by New chat or a page reload.
- **Message**: A user question or assistant response, with its text and position in the
  current conversation.
- **Request status**: The visible state for waiting, successful response, or recoverable
  failure, including timeout and rate-limit outcomes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 9 of 10 predefined supported Indian CA questions receive responses
  that an independent reviewer judges relevant and within the stated CA scope.
- **SC-002**: All 10 predefined off-topic test questions receive a polite redirect without
  an answer to the unrelated request.
- **SC-003**: In a first-use check, all 5 test users can submit a question and identify the
  assistant's response and the disclaimer without assistance.
- **SC-004**: At least 95% of initial page loads complete in under 2 seconds on a 4G
  connection.
- **SC-005**: Every simulated request failure, timeout, and rate-limit case presents a
  user-safe message and a working retry action; requests do not remain pending beyond 30
  seconds.
- **SC-006**: Users can complete the primary question-and-answer flow at both mobile and
  desktop viewport sizes using keyboard-only navigation.
- **SC-007**: The disclaimer is visible at all tested mobile and desktop viewport sizes.
- **SC-008**: An accessibility review of the supported chat flows finds no WCAG 2.1 AA
  violations in keyboard access, focus visibility, or status announcements.

## Assumptions

- The primary users are individuals and small business owners in India seeking quick,
  general tax and accounting information.
- The supported subject areas are limited to Indian income tax, GST, TDS, ITR filing, and
  accounting; unrelated questions receive a redirect rather than an answer.
- The assistant provides general information only. Users requiring advice for their
  circumstances are directed to consult a qualified Chartered Accountant.
- Chat content is temporary and is not stored across reloads; file uploads, accounts,
  login, streaming responses, backend services, and non-CA assistance are outside this
  release's scope.
- Users need an internet connection to receive AI-generated responses.
- Service availability, response content, and accuracy depend on the configured AI
  service; CA Assist does not guarantee professional advice.
