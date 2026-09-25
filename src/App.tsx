import { useCallback, useRef, useState } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatInput from './components/ChatInput';
import Disclaimer from './components/Disclaimer';
import MessageList from './components/MessageList';
import RequestStatus from './components/RequestStatus';
import { generateAssistantReply, GeminiApiError } from './services/gemini';
import type { ChatMessage, RequestStatus as RequestStatusType, RetryRequest } from './types/chat';

const SUGGESTED_QUESTIONS = [
  { category: 'INCOME TAX', text: 'What is the ITR due date for salaried individuals?' },
  { category: 'GST', text: 'When does a small business need to register for GST?' },
  { category: 'TDS', text: 'How is TDS on rent generally calculated?' },
  { category: 'DEDUCTIONS', text: 'What should I know about Section 80C deductions?' },
];

function createMessage(role: ChatMessage['role'], text: string): ChatMessage {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, role, text };
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [requestStatus, setRequestStatus] = useState<RequestStatusType>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const retryRequestRef = useRef<RetryRequest | null>(null);
  const requestIdRef = useRef(0);
  const pendingRef = useRef(false);

  const requestReply = useCallback(async (history: ChatMessage[]) => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    const requestId = ++requestIdRef.current;
    setRequestStatus('pending');
    setErrorMessage(null);

    try {
      const reply = await generateAssistantReply(history);
      if (requestId !== requestIdRef.current) return;
      setMessages((current) => [...current, createMessage('model', reply)]);
      retryRequestRef.current = null;
      setRequestStatus('idle');
    } catch (error: unknown) {
      if (requestId !== requestIdRef.current) return;
      const safeMessage = error instanceof GeminiApiError
        ? error.message
        : 'The assistant could not complete that request. Please try again.';
      setErrorMessage(safeMessage);
      setRequestStatus('error');
    } finally {
      if (requestId === requestIdRef.current) {
        pendingRef.current = false;
      }
    }
  }, []);

  const submitQuestion = useCallback((question: string) => {
    const cleanedQuestion = question.trim();
    if (!cleanedQuestion || pendingRef.current) return;

    const userMessage = createMessage('user', cleanedQuestion);
    const history = [...messages, userMessage];
    setMessages(history);
    retryRequestRef.current = { question: cleanedQuestion, history };
    void requestReply(history);
  }, [messages, requestReply]);

  const retryLastQuestion = useCallback(() => {
    const retryRequest = retryRequestRef.current;
    if (retryRequest) void requestReply(retryRequest.history);
  }, [requestReply]);

  const startNewChat = useCallback(() => {
    requestIdRef.current += 1;
    pendingRef.current = false;
    retryRequestRef.current = null;
    setMessages([]);
    setErrorMessage(null);
    setRequestStatus('idle');
  }, []);

  return (
    <div className="app-shell">
      <ChatHeader onNewChat={startNewChat} hasConversation={messages.length > 0} />

      <main className="main-content" id="main">
        <section className="chat-workspace" aria-label="CA Assist conversation">
          {messages.length === 0 ? (
            <div className="welcome-panel">
              <div className="welcome-emblem" aria-hidden="true">
                <svg viewBox="0 0 44 44" fill="none">
                  <path d="M22 4.8 37 13.4v17.2L22 39.2 7 30.6V13.4L22 4.8Z" />
                  <path d="M16 25.7c1.1 1.4 2.7 2.2 4.7 2.2 3.2 0 5.7-2.5 5.7-5.9s-2.5-5.9-5.7-5.9c-2 0-3.6.8-4.7 2.2m11.6 9.4 3.4-10.6 3.4 10.6m-5.8-2.9h4.9" transform="translate(-4.5 -1.5)" />
                </svg>
              </div>
              <p className="eyebrow"><span /> YOUR INDIAN TAX & ACCOUNTING GUIDE</p>
              <h1>Good questions.<br /><em>Clearer finances.</em></h1>
              <p className="welcome-description">
                Ask about Indian income tax, GST, TDS, ITR filing, or accounting. Get clear general information to help you take the next step.
              </p>
              <div className="topic-row" aria-label="Topics covered">
                <span>Income tax</span><span>GST</span><span>TDS</span><span>ITR filing</span><span>Accounting</span>
              </div>
              <div className="suggestion-heading"><span>NOT SURE WHERE TO START?</span><span className="heading-rule" /></div>
              <div className="suggestion-grid">
                {SUGGESTED_QUESTIONS.map((suggestion) => (
                  <button className="suggestion-card" key={suggestion.category} type="button" onClick={() => submitQuestion(suggestion.text)}>
                    <span className="suggestion-category">{suggestion.category}</span>
                    <span className="suggestion-text">{suggestion.text}</span>
                    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" /></svg>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}

          <RequestStatus
            isLoading={requestStatus === 'pending'}
            errorMessage={errorMessage}
            onRetry={retryLastQuestion}
            canRetry={retryRequestRef.current !== null}
          />

          <ChatInput disabled={requestStatus === 'pending'} onSubmit={submitQuestion} />
          <p className="composer-hint">Press <kbd>Enter</kbd> to send <span aria-hidden="true">·</span> Your conversation isn’t saved</p>
        </section>
        <Disclaimer />
      </main>
    </div>
  );
}
