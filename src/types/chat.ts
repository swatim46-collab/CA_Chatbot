export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

export type RequestStatus = 'idle' | 'pending' | 'error';

export interface RetryRequest {
  question: string;
  history: ChatMessage[];
}
