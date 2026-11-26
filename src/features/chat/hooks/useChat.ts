import { useState } from "react";
import { useChatStore } from "../../../store/useChatStore";
import { streamChat } from "../api/chatApi";

export function useChat() {
  const {
    chats,
    activeChatId,
    createChat,
    addMessage,
    updateMessage,
    updateChatTitle,
  } = useChatStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isGenerating) return;

    setError(null);
    let currentChatId = activeChatId;

    if (!currentChatId) {
      currentChatId = createChat();
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content,
      createdAt: Date.now(),
    };
    addMessage(currentChatId, userMessage);

    const currentChat = chats.find((c) => c.id === currentChatId);

    if (currentChat?.messages.length === 0) {
      const title =
        content.trim().replace(/\n/g, " ").slice(0, 30) +
        (content.length > 30 ? "..." : "");
      updateChatTitle(currentChatId, title);
    }

    const assistantMessageId = crypto.randomUUID();
    addMessage(currentChatId, {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
      isStreaming: true,
    });

    setIsGenerating(true);
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const chatMessages = [...(activeChat?.messages || []), userMessage];

      let fullContent = "";

      for await (const chunk of streamChat(chatMessages, controller.signal)) {
        if (chunk.done) break;

        fullContent += chunk.content;

        updateMessage(currentChatId, assistantMessageId, {
          content: fullContent,
        });
      }

      updateMessage(currentChatId, assistantMessageId, {
        isStreaming: false,
      });
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Генерация отменена пользователем");
      } else {
        console.error("Ошибка генерации:", err);
        setError(err.message || "Произошла ошибка при генерации");

        updateMessage(currentChatId, assistantMessageId, {
          isStreaming: false,
          isError: true,
          content: "Не удалось получить ответ. Попробуйте еще раз.",
        });
      }
    } finally {
      setIsGenerating(false);
      setAbortController(null);
    }
  };

  const stopGeneration = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  return {
    activeChat,
    isGenerating,
    error,
    sendMessage,
    stopGeneration,
  };
}
