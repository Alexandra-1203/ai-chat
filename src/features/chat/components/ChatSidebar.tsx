import { useChatStore } from "../../../store/useChatStore";
import { useState } from "react";

interface ChatSidebarProps {
  onClose: () => void;
}

export function ChatSidebar({ onClose }: ChatSidebarProps) {
  const {
    chats,
    activeChatId,
    setActiveChat,
    createChat,
    deleteChat,
    updateChatTitle,
    togglePin,
  } = useChatStore();

  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const startEditing = (id: string, currentTitle: string) => {
    setEditingChatId(id);
    setEditTitle(currentTitle);
  };

  const saveTitle = (id: string) => {
    if (editTitle.trim()) {
      updateChatTitle(id, editTitle.trim());
    }
    setEditingChatId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") saveTitle(id);
    if (e.key === "Escape") setEditingChatId(null);
  };

  const sortedChats = [...chats].sort(
    (a, b) => Number(b.isPinned) - Number(a.isPinned),
  );

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col h-full">
      <div className="p-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            AI
          </div>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            AI Ассистент
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          title="Скрыть меню"
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div className="p-2">
        <button
          onClick={createChat}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
        >
          + Новый чат
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {sortedChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm transition-colors ${
              activeChatId === chat.id
                ? "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100"
                : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            {editingChatId === chat.id ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => saveTitle(chat.id)}
                onKeyDown={(e) => handleKeyDown(e, chat.id)}
                autoFocus
                className="w-full bg-white dark:bg-slate-700 px-1 rounded outline-none border border-blue-500 text-sm text-slate-900 dark:text-slate-100"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div
                className="truncate pr-2"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  startEditing(chat.id, chat.title);
                }}
              >
                {chat.title}
              </div>
            )}

            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(chat.id);
                }}
                className={`p-1 transition-all ${
                  chat.isPinned
                    ? "text-blue-500 opacity-100"
                    : "text-slate-400 hover:text-blue-500"
                }`}
                title={chat.isPinned ? "Открепить" : "Закрепить"}
              >
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
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(chat.id, chat.title);
                }}
                className="p-1 text-slate-400 hover:text-blue-500 transition-all"
                title="Редактировать название"
              >
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
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="p-1 text-slate-400 hover:text-red-500 transition-all"
                title="Удалить чат"
              >
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
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
