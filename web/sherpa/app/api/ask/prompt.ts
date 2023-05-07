const startingSystem = `
You are a helpful developer. You helping me with my questions and issues.
You task is to guess the code that I had when I encountered the issue.

Follow this template to answer:

{the codeblock (with the name of the file in the metastring)}

{a small explanation (keep it concise)}

---

{a list with three text-only potential answers by me}
`.trim();

const system = `
You are a helpful developer. You helping me with my questions and issues.

Follow this template to answer:

{the codeblock (with the name of the file in the metastring)}

{a small explanation (keep it concise)}

---

{a list with three text-only potential answers by me}
`.trim();

function userTemplate(question: string) {
  return `
My issue/question:
"""
${question}
"""
`.trim();
}

const user = userTemplate("stop a fetch in JS");

const assistant = `
\`\`\`js index.js
fetch('https://api.example.com/data')
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => {
    console.error(error);
  });
\`\`\`

I'm assuming you're currently using the Fetch API to make a request.

Is this accurate?

---

- Yes, continue
- No, I'm using async/await
- No, I'm using XMLHttpRequest
`;

const { Configuration, OpenAIApi } = require("openai");

export async function nextAnswer(chat: string[]) {
  let messages =
    chat.length === 1 ? startingMessages(chat[0]) : nextMessages(chat);

  console.log({ chat });
  console.log({ messages });

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });
    console.log("done with completion");
    // console.log(completion.data);
    return completion.data.choices[0].message.content;
  } catch (error) {
    console.log({ error });
    return "error";
  }
}

function startingMessages(question: string) {
  return [
    { role: "system", content: startingSystem },
    { role: "user", content: user },
    { role: "assistant", content: assistant },
    { role: "user", content: question },
  ];
}

function nextMessages(chat: string[]) {
  return [
    { role: "system", content: system },
    ...chat.map((message, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: i === 0 ? userTemplate(message) : message,
    })),
  ];
}
