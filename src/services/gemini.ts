import type { ChatMessage } from '../types/chat';
import { CA_ASSIST_SYSTEM_PROMPT } from './systemPrompt';

export const GEMINI_MODEL = 'gemma-4-26b-a4b-it';
const GEMINI_ENDPOINT = import.meta.env.DEV
  ? '/__gemini'
  : `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const REQUEST_TIMEOUT_MS = 30_000;

export type GeminiErrorKind = 'configuration' | 'rate-limit' | 'timeout' | 'empty' | 'network' | 'service';

const USER_MESSAGES: Record<GeminiErrorKind, string> = {
  configuration: 'The assistant is not configured yet. Please try again later.',
  'rate-limit': 'The assistant is receiving too many requests right now. Please try again shortly.',
  timeout: 'This is taking longer than expected. Please try your question again.',
  empty: 'The assistant did not return an answer. Please try again.',
  network: 'We could not reach the assistant. Check your connection and try again.',
  service: 'The assistant could not complete that request. Please try again.',
};

export class GeminiApiError extends Error {
  readonly kind: GeminiErrorKind;

  constructor(kind: GeminiErrorKind) {
    super(USER_MESSAGES[kind]);
    this.name = 'GeminiApiError';
    this.kind = kind;
  }
}

interface GeminiPart {
  text?: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
}

export async function generateAssistantReply(history: ChatMessage[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiApiError('configuration');
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: history.map(({ role, text }, index) => ({
          role,
          parts: [{
            text: index === 0 && role === 'user'
              ? `${CA_ASSIST_SYSTEM_PROMPT}\n\nUser question: ${text}`
              : text,
          }],
        })),
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (response.status === 429) {
      throw new GeminiApiError('rate-limit');
    }
    if (!response.ok) {
      throw new GeminiApiError('service');
    }

    const payload = (await response.json()) as GeminiResponse;
    const answer = payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('')
      .trim();

    if (!answer) {
      throw new GeminiApiError('empty');
    }

    return answer;
  } catch (error: unknown) {
    if (error instanceof GeminiApiError) {
      throw error;
    }
    if (controller.signal.aborted) {
      throw new GeminiApiError('timeout');
    }
    throw new GeminiApiError('network');
  } finally {
    window.clearTimeout(timeoutId);
  }
}
