export async function sendQuestion(chat: string[]) {
  const r = await fetch("/api/ask", {
    method: "POST",
    body: JSON.stringify({ chat }),
  });
  const { answer } = await r.json();
  return answer;
}
