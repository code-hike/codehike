"use client";
import React from "react";
import ChatInput from "../chat-input";
import Convo from "../convo";

export default function Home() {
  const [i, setI] = React.useState(0);

  const onSend = () => {
    setI((i) => i + 1);
  };

  const convo = [c0, c1, c2][i];
  const started = convo.length > 0;

  return (
    <main className="  ">
      <Convo convo={convo} onReply={onSend} />

      <ChatInput onSend={onSend} started={started} isWaiting={i === 1} />
    </main>
  );
}

const c0 = [] as string[];
const c1 = ["how to stop a fetch in js"];
const c2 = [
  "how to stop a fetch in js",
  "```js index.js\nconst controller = new AbortController();\nconst signal = controller.signal;\n\nfetch('https://api.example.com/data', { signal })\n  .then((response) => response.json())\n  .then((data) => console.log(data))\n  .catch((error) => {\n    if (error.name === 'AbortError') {\n      console.log('Fetch aborted');\n    } else {\n      console.error(error);\n    }\n  });\n\n// To abort the fetch, call:\ncontroller.abort();\n```\n\nTo stop a fetch request in JavaScript, you can use the AbortController API. First, create a new instance of the AbortController class and get its associated signal. Then, pass the signal to the fetch request as an option. Finally, to abort the fetch, call the `abort()` method on the controller.\n\nIn the example above, I'm also handling the `AbortError` that will be thrown when the fetch is aborted.\n\nDoes this help?\n\n---\n\n- Yes, thank you!\n- Can you show me an example with async/await?\n- Is there a way to stop a XMLHttpRequest?",
];
