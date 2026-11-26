import { useEffect, useRef, useState } from "react";
import { useChat } from "../../features/chat/hooks/useChat";
import { MessageBubble } from "../../features/chat/components/MessageBubble";
import { ChatInput } from "../../features/chat/components/ChatInput";
import { ChatSidebar } from "../../features/chat/components/ChatSidebar";
import { useChatStore } from "../../store/useChatStore";

export function ChatPage() {
  const { activeChat, isGenerating, sendMessage, stopGeneration } = useChat();
  const { toggleMessagePin } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [openedPinnedChatId, setOpenedPinnedChatId] = useState<string | null>(
    null,
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= 768,
  );

  const isPinnedOpen = openedPinnedChatId === activeChat?.id;

  const pinnedMessages = activeChat?.messages.filter((m) => m.isPinned) || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const scrollToMessage = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("bg-blue-100/50", "dark:bg-blue-900/20");
      setTimeout(() => {
        el.classList.remove("bg-blue-100/50", "dark:bg-blue-900/20");
      }, 1500);
    }
    setOpenedPinnedChatId(null);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-0"
        } shrink-0 overflow-hidden`}
      >
        <ChatSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-3 left-4 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all z-50"
            title="Открыть меню"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}
        <header className="border-b border-slate-200 dark:border-slate-700 p-4">
          <h1 className="font-semibold text-center">
            {activeChat?.title || "Новый чат"}
          </h1>
        </header>

        {pinnedMessages.length > 0 && (
          <div className="relative">
            <div
              className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/50 px-4 py-2 text-sm flex items-center justify-between cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              onClick={() =>
                setOpenedPinnedChatId(
                  isPinnedOpen ? null : activeChat?.id || null,
                )
              }
            >
              <div className="flex items-center gap-2 truncate text-blue-800 dark:text-blue-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
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
                <span className="font-medium">
                  Закреплено ({pinnedMessages.length})
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${isPinnedOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {isPinnedOpen && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-lg max-h-60 overflow-y-auto z-50">
                {pinnedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => scrollToMessage(msg.id)}
                    className="p-3 border-b border-slate-100 dark:border-slate-700 last:border-0 flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <p className="text-sm line-clamp-3 text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMessagePin(activeChat!.id, msg.id);
                      }}
                      className="text-blue-500 hover:text-blue-700 text-xs font-medium shrink-0 mt-1"
                    >
                      Открепить
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            {!activeChat?.messages.length ? (
              <div className="flex flex-col items-center justify-center h-full mt-20 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-4"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <p>Начните диалог с ИИ</p>
              </div>
            ) : (
              activeChat.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  chatId={activeChat.id}
                  onTogglePin={toggleMessagePin}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <ChatInput
          onSend={sendMessage}
          onStop={stopGeneration}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}
