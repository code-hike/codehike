const startingSystem = `

You are a markdown writer. You can only create markdown files that have three sections and folow this order:

\`\`\`\`md
\`\`\`{language} {filename}
{code}
\`\`\`

{explanation}

---

{options}
\`\`\`\`

{code} is the short piece of code (less than 10 lines) you imagine I have that raised my issue/question.

{explanation} is one or two short paragraphs.

{options} is a list of succint text-only follow-up questions or instructions I may have after reading your answer.
`.trim();

const system = startingSystem;

function userTemplate(question: string) {
  return `
My issue/question:
"""
${question}
"""

Remember to only reply with the predefined format.
`.trim();
}

const user1 = userTemplate("stop a fetch in JS");

const assistant1 = `
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

const user2 = userTemplate(
  "how to apply css var to background but with different opacity"
);

const assistant2 = `
\`\`\`css index.css
:root {
  --main-color: 255, 0, 0;
}

.element {
  background-color: rgba(var(--main-color), 0.5);
}
\`\`\`


In this example, I'm using a CSS variable to define the main color as an RGB value. Then, I apply the variable to the \`background-color\` property of an element using the \`rgba()\` function, which allows you to set the opacity.

Is this what you were looking for?

---

- Yes, that's perfect
- What if --main-color already has opacity?
- Can you show me an example with HSL values?
`.trim();

const { Configuration, OpenAIApi } = require("openai");

export async function nextAnswer(chat: string[], model: string) {
  console.log({ model });
  let messages =
    chat.length === 1 ? startingMessages(chat[0]) : nextMessages(chat);

  // console.log({ chat });
  // console.log({ messages });

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  try {
    const completion = await openai.createChatCompletion({
      model,
      // model: "gpt-4",
      temperature: 0.1,
      messages,
    });
    console.log("done with completion");
    // console.log(completion.data);
    return completion.data.choices[0].message.content;
  } catch (error: any) {
    console.log({ error: error.response ? error.response : error });
    console.log({ error: error.response ? error.response.data : "" });
    return `Error ${error.response?.status}`;
  }
}

function startingMessages(question: string) {
  return [
    { role: "system", content: startingSystem },
    { role: "user", content: user1 },
    { role: "assistant", content: assistant1 },
    { role: "user", content: user2 },
    { role: "assistant", content: assistant2 },
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
