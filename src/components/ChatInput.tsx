import { useState, type FormEvent } from 'react';

interface ChatInputProps {
  disabled: boolean;
  onSubmit: (question: string) => void;
}

export default function ChatInput({ disabled, onSubmit }: ChatInputProps) {
  const [value, setValue] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = value.trim();
    if (!question || disabled) return;
    onSubmit(question);
    setValue('');
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="chat-question">Ask a question about Indian tax or accounting</label>
      <input
        id="chat-question"
        name="question"
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask about tax, GST, TDS or accounting…"
        autoComplete="off"
        disabled={disabled}
      />
      <button className="send-button" type="submit" disabled={disabled || !value.trim()} aria-label="Send message">
        <span>Send</span>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 10h12m-5-5 5 5-5 5" /></svg>
      </button>
    </form>
  );
}
