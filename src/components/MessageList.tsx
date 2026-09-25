import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '../types/chat';

interface MessageListProps {
  messages: ChatMessage[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="message-list" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text">
      {messages.map((message) => (
        <article className={`message message-${message.role}`} key={message.id}>
          {message.role === 'model' && (
            <span className="assistant-avatar" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 3.2 20 7.7v8.6l-8 4.5-8-4.5V7.7l8-4.5Z" /><path d="M9 14.8c.6.6 1.4 1 2.4 1 1.8 0 3.1-1.4 3.1-3.2s-1.3-3.2-3.1-3.2c-1 0-1.8.4-2.4 1" /></svg>
            </span>
          )}
          <div className="message-body">
            {message.role === 'model' && <div className="message-label">CA Assist <span>·</span> General information</div>}
            <div className="message-content">
              {message.role === 'model'
                ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                : <p>{message.text}</p>}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
