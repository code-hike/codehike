export type Message = {
  md: string;
  model?: string;
};

export async function sendQuestion(messages: Message[], model?: string) {
  const chat = messages.map((m) => m.md);
  try {
    const r = await fetch("/api/ask", {
      method: "POST",
      body: JSON.stringify({ chat, model }),
    });

    if (!r.ok) {
      const errorMessage = await r.text();
      throw new Error(errorMessage);
    }

    return await r.json();
  } catch (e) {
    console.error(e);
    return { answer: "Sorry, something went wrong." };
  }
}
