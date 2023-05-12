export type Message = {
  md: string;
  model?: string;
};

export async function sendQuestion(messages: Message[], model?: string) {
  const chat = messages.map((m) => m.md);
  const r = await fetch("/api/ask", {
    method: "POST",
    body: JSON.stringify({ chat, model }),
  });
  return await r.json();
}
