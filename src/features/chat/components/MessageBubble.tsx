import type { Message } from "../types";

interface MessageBubbleProps {
  message: Message;
  chatId: string;
  onTogglePin: (chatId: string, messageId: string) => void;
}

export function MessageBubble({
  message,
  chatId,
  onTogglePin,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isError = message.isError;

  return (
    <div
      id={message.id}
      className={`group flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : isError
              ? "bg-red-50 text-red-900 border border-red-200 rounded-bl-sm"
              : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 rounded-bl-sm"
        }`}
      >
        <button
          onClick={() => onTogglePin(chatId, message.id)}
          className={`absolute top-2 ${
            isUser ? "-left-8" : "-right-8"
          } p-1 rounded-full text-slate-400 hover:text-blue-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all ${
            message.isPinned ? "opacity-100 text-blue-500" : ""
          }`}
          title={
            message.isPinned ? "Открепить сообщение" : "Закрепить сообщение"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="17" x2="12" y2="22"></line>
            <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
          </svg>
        </button>

        <div className="whitespace-pre-wrap wrap-break-word">
          {message.content}
          {message.isStreaming && !message.content && (
            <span className="inline-flex items-center gap-1 h-4 ml-1 align-middle">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-dot" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-dot" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-dot" />
            </span>
          )}
          {message.isStreaming && message.content && (
            <span className="inline-block w-1 h-4 ml-1 bg-slate-400 animate-pulse align-middle" />
          )}
        </div>
      </div>
    </div>
  );
}
