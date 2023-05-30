import React from "react"
import { Chat } from "../../src/mdx-client/chat"
import { useFakeGPT } from "../../dev/chat/fake-gpt"

export default function Page() {
  const inputRef = React.useRef<any>(null)
  const [convo, sendQuestion] = useFakeGPT(conversation)

  const handleSend = () => {
    const value = inputRef?.current?.value
    sendQuestion(value)
    // clean input
    inputRef.current.value = ""
  }
  const handleKeyDown = event => {
    if (event.key === "Enter") {
      handleSend()
    }
  }

  return (
    <div>
      <style jsx global>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div {
          background: #ccc !important;
          color: #fff;
        }
      `}</style>
      <Chat
        steps={convo}
        style={{
          width: 900,
          margin: "10vh auto",
        }}
        height="80vh"
        onReply={sendQuestion}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          background: "#444d",
        }}
      >
        <div
          style={{
            width: 600,
            margin: "20px auto",
            display: "flex",
            gap: 10,
          }}
        >
          <input
            ref={inputRef}
            style={{ flex: 1 }}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>

    // copy to
  )
}

const conversation = [
  {
    question: `how to stop a *fetch* in js?`,
    answer: `I'm assuming you're currently using the Fetch API
to make a request.

Is this accurate?
`,
    code: [
      {
        title: "foo.js",
        lang: "js",
        text: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}`,
      },
      {
        title: "foo.html",
        lang: "html",
        text: `<button onclick="fetchData()">Fetch Data</button>`,
      },
    ],
    replies: [
      "Yes",
      "No, I'm using XMLHttpRequest. Please help with a solution for that",
      "No, I'm using promises",
      "Ask GPT-4",
    ],
  },
  {
    question: "how to stop a fetch in js?",
    answer: `I'm assuming you're currently using the Fetch API
to make a request.

Is this accurate?
`,
    code: [
      {
        title: "foo.js",
        lang: "js",
        text: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}`,
      },
      {
        title: "foo.html",
        lang: "html",
        text: `<button onclick="fetchData()">Fetch Data</button>
<div>Yes</div>`,
      },
    ],
    replies: ["Yes", "No", "Maybe", "Ask GPT-4"],
  },
  {
    question: "I'm using promises",
    answer: `Thanks for the clarification.

Is this accurate?`,
    code: [
      {
        title: "foo.js",
        lang: "js",
        text: `fetch('https://api.example.com/data')
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => {
    console.error(error);
  });`,
      },
    ],
    replies: ["Yes, continue"],
  },
  {
    question: "Yes, continue",
    answer: ` Now, let's introduce the AbortController to enable
aborting the fetch request.

Here, we create an instance of AbortController and
get its signal property. We then pass this signal
to the fetch request options. The signal allows us
to control the fetch request and abort it when
necessary.`,
    code: [
      {
        title: "foo.js",
        lang: "js",
        text: `const controller = new AbortController();
const signal = controller.signal;

fetch('https://api.example.com/data', { signal })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => {
    console.error(error);
  });`,
      },
    ],
  },
  {
    question: "Go on",
    answer: (
      <>
        <p>
          Now, to abort the fetch request, you can simply
          call the abort method on the AbortController
          instance. For example, you can abort the request
          after a certain time.
        </p>
        <p>
          This will abort the fetch request if it hasn't
          completed within 5 seconds.
        </p>
      </>
    ),
    code: [
      {
        title: "foo.js",
        lang: "js",
        text: `const controller = new AbortController();
const signal = controller.signal;

fetch('https://api.example.com/data', { signal })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => {
    console.error(error);
  });

setTimeout(() => controller.abort(), 5000);`,
      },
    ],
  },
  {
    question: "Go on",
    answer: (
      <>
        <p>
          When you call controller.abort(), the fetch
          request is interrupted, and the promise returned
          by the fetch function is rejected with an
          AbortError. You can catch this error in the .catch
          block of your fetch request and handle it
          accordingly.
        </p>
        <p>
          The .catch block in the fetch request will handle
          the abort error, logging "Fetch aborted" to the
          console.
        </p>
      </>
    ),
    code: [
      {
        title: "foo.js",
        lang: "js",
        text: `const controller = new AbortController();
const signal = controller.signal;

fetch('https://api.example.com/data', { signal })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error(error);
    }
  });

setTimeout(() => controller.abort(), 5000);`,
      },
    ],
  },
  {
    question: "Go on",
    answer: (
      <div>
        In summary, to stop a fetch request in JavaScript:
        <ul>
          <li>
            Create an instance of AbortController and get
            its signal property
          </li>
          <li>
            Pass the signal to the fetch request options
          </li>
          <li>
            Call the abort method on the AbortController
            instance to abort the fetch request
          </li>
          <li>
            Catch the AbortError in the .catch block of the
            fetch request
          </li>
        </ul>
      </div>
    ),
    code: [
      {
        title: "foo.js",
        lang: "js",
        text: `const controller = new AbortController();
const signal = controller.signal;

fetch('https://api.example.com/data', { signal })
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error(error);
    }
  });

setTimeout(() => controller.abort(), 5000);`,
      },
    ],
  },
]
