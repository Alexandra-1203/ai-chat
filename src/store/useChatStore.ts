import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Chat, Message } from "../features/chat/types";

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;

  createChat: () => string;
  setActiveChat: (id: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (
    chatId: string,
    messageId: string,
    updates: Partial<Message>,
  ) => void;
  deleteChat: (id: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  togglePin: (id: string) => void;
  toggleMessagePin: (chatId: string, messageId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      activeChatId: null,

      createChat: () => {
        const newChat: Chat = {
          id: crypto.randomUUID(),
          title: "Новый чат",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isPinned: false,
        };
        set((state) => {
          const updatedChats = [newChat, ...state.chats].sort(
            (a, b) => Number(b.isPinned) - Number(a.isPinned),
          );
          return {
            chats: updatedChats,
            activeChatId: newChat.id,
          };
        });
        return newChat.id;
      },

      setActiveChat: (id) => set({ activeChatId: id }),

      addMessage: (chatId, message) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, message],
                  updatedAt: Date.now(),
                }
              : chat,
          ),
        }));
      },

      updateMessage: (chatId, messageId, updates) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, ...updates } : msg,
                  ),
                }
              : chat,
          ),
        }));
      },

      deleteChat: (id) => {
        set((state) => {
          const newChats = state.chats.filter((chat) => chat.id !== id);
          return {
            chats: newChats,
            activeChatId:
              state.activeChatId === id
                ? newChats[0]?.id || null
                : state.activeChatId,
          };
        });
      },

      updateChatTitle: (chatId, title) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, title } : chat,
          ),
        }));
      },

      togglePin: (id) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === id ? { ...chat, isPinned: !chat.isPinned } : chat,
          ),
        }));
      },

      toggleMessagePin: (chatId, messageId) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === messageId
                      ? { ...msg, isPinned: !msg.isPinned }
                      : msg,
                  ),
                }
              : chat,
          ),
        }));
      },
    }),
    {
      name: "ai-chat-storage",
    },
  ),
);
