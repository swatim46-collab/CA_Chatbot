interface ChatHeaderProps {
  onNewChat: () => void;
  hasConversation: boolean;
}

export default function ChatHeader({ onNewChat, hasConversation }: ChatHeaderProps) {
  return (
    <header className="topbar">
      <a className="brand" href="#main" aria-label="CA Assist home">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M16 3.5 27 9.7v12.6L16 28.5 5 22.3V9.7L16 3.5Z" />
            <path d="M10.2 18.6c.8 1.1 2.1 1.8 3.7 1.8 2.5 0 4.4-1.9 4.4-4.4s-1.9-4.4-4.4-4.4c-1.6 0-2.9.7-3.7 1.8M20.1 19.8l3-7.7 3 7.7m-5-2.1h4" transform="translate(-2.1 0)" />
          </svg>
        </span>
        <span className="brand-copy">
          <strong>CA Assist</strong>
          <span>INDIA · TAX & ACCOUNTING</span>
        </span>
      </a>

      <div className="topbar-actions">
        <span className="availability"><span aria-hidden="true" /> General guidance</span>
        <button className="new-chat-button" type="button" onClick={onNewChat} disabled={!hasConversation}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 4v12M4 10h12" />
          </svg>
          <span>New chat</span>
        </button>
      </div>
    </header>
  );
}
