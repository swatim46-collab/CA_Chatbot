interface RequestStatusProps {
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  canRetry: boolean;
}

export default function RequestStatus({
  isLoading,
  errorMessage,
  onRetry,
  canRetry,
}: RequestStatusProps) {
  if (isLoading) {
    return (
      <div className="request-status pending" role="status" aria-live="polite" aria-atomic="true">
        <span className="thinking-dots" aria-hidden="true"><i /><i /><i /></span>
        <span>Thinking...</span>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="request-status error" role="alert">
        <span className="error-indicator" aria-hidden="true">!</span>
        <span className="error-copy">{errorMessage}</span>
        {canRetry && (
          <button className="retry-button" type="button" onClick={onRetry}>
            Try again
            <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M14.8 8.1A5.8 5.8 0 1 0 15 10m-.2-5v3.7h-3.7" /></svg>
          </button>
        )}
      </div>
    );
  }

  return null;
}
