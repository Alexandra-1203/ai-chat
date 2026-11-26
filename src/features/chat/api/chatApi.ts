import type { Message, StreamChunk } from "../types";

const PROXY_URL = "/chat.ts";

export async function* streamChat(
  messages: Message[],
  signal?: AbortSignal,
): AsyncGenerator<StreamChunk, void, unknown> {
  console.log("Отправляем запрос...", messages);

  const response = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
    signal,
  });

  console.log("Статус ответа:", response.status, response.statusText);

  if (!response.ok || !response.body) {
    const errorText = await response.text();
    console.error("Ошибка сервера:", errorText);
    throw new Error(`Ошибка сервера: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log("Поток завершен (done)");
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (!trimmedLine) continue;
        if (trimmedLine === "data: [DONE]") {
          console.log("Получен маркер [DONE]");
          continue;
        }

        if (trimmedLine.startsWith("data: ")) {
          const jsonStr = trimmedLine.slice(6);
          try {
            const data = JSON.parse(jsonStr);
            const content = data.choices[0]?.delta?.content || "";

            if (content) {
              yield { content, done: false };
            }
          } catch (e) {
            console.warn("Ошибка парсинга чанка:", e, "Строка:", jsonStr);
          }
        } else {
          console.log("Неизвестная строка от сервера:", trimmedLine);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  yield { content: "", done: true };
}
