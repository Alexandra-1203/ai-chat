export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  isStreaming?: boolean;
  isError?: boolean;
  isPinned?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
}

export interface ChatRequest {
  messages: { role: MessageRole; content: string }[];
  model?: string;
}

export interface StreamChunk {
  content: string;
  done: boolean;
  error?: string;
}
