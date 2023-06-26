import React from "react"
import { Chat } from "../src/chat/chat"
import { useConversation } from "../src/chat/use-conversation"
import theme from "@code-hike/lighter/themes/github-dark.json"
import { Message } from "../src/chat/types"
import { setMetadata } from "../src/chat/metadata"

export default function Page() {
  const [progress, setProgress] = React.useState(max)
  const messages = steps[progress]
  const isStreaming =
    messages[messages.length - 1]?.isStreaming
  const conversation = useConversation(
    messages,
    !!isStreaming,
    x => {
      console.log(x)
    },
    theme
  )
  // console.log(progress)
  // console.log({ messages })
  // console.log(messages[messages.length - 1]?.content)
  // console.log({ conversation })

  React.useEffect(() => {
    // focus input range
    const input = document.querySelector(
      "input[type=range]"
    ) as HTMLInputElement
    input.focus()
  }, [])

  const preRef = React.useRef<HTMLPreElement>(null)

  React.useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight
    }
  }, [progress])

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

        .ch-chat {
          width: 900px;
          margin: 0 auto;
        }

        .ch-scrollycoding-sticker {
        }
      `}</style>
      <Chat
        conversation={conversation}
        height="80vh"
        theme={theme as any}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "20vh",
          padding: "2px 0 8px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <pre
          ref={preRef}
          style={{
            width: "100%",
            flex: 1,
            background: "black",
            color: "white",
            overflow: "auto",
            // opacity: 0,
          }}
        >
          {messages[messages.length - 1]?.content}
        </pre>
        <input
          autoFocus
          style={{ width: "100%", padding: 0, margin: 0 }}
          type="range"
          min="0"
          max={max}
          value={progress}
          onChange={e =>
            setProgress(Number(e.target.value))
          }
          onKeyDown={event => {
            if (
              event.key === "ArrowRight" &&
              progress < 100
            ) {
              setProgress(prevValue =>
                Math.min(prevValue + 1, max)
              )
            } else if (
              event.key === "ArrowLeft" &&
              progress > 0
            ) {
              setProgress(prevValue =>
                Math.max(prevValue - 1, 0)
              )
            }
          }}
        />
      </div>
    </div>
  )
}

const messages = [
  {
    role: "user",
    content: "fetch json in react",
  },
  {
    content:
      "```jsx index.jsx\nfunction MyComponent() {\n  const [data, setData] = useState(null)\n\n  useEffect(() => {\n    fetch(\"https://api.example.com/data\")\n      .then(response => response.json())\n      .then(data => setData(data))\n      .catch(error => console.error(error))\n  }, [])\n\n  return (\n    <div>\n      {data ? (\n        <ul>\n          {data.map(item => (\n            <li key={item.id}>{item.name}</li>\n          ))}\n        </ul>\n      ) : (\n        <p>Loading...</p>\n      )}\n    </div>\n  )\n}\n```\n\nYou can use the Fetch API to make a request to the API endpoint that returns JSON data. Then, use the `json()` method to parse the response into a JavaScript object.\n\nHere's an example of how to use `fetch()` with React's `useState()` and `useEffect()` hooks to fetch and display JSON data.\n\nDoes this help?\n\n---\n\n- Yes, thank you!\n- Can you explain what `useEffect()` does?\n- How can I handle errors when fetching data?",
    role: "assistant",
  },
]
  .map(m => ({
    ...m,
    content: m.content.replace(/~/g, "`"),
  }))
  .map(m =>
    m.role === "assistant"
      ? m
      : {
          ...m,
          content: setMetadata(m.content, {
            model: "GPT-3",
          }),
        }
  )

function getSteps() {
  const steps = [[]] as (Message & {
    isStreaming?: boolean
  })[][]
  const current = [] as Message[]
  messages.forEach(m => {
    if (m.role === "user") {
      current.push(m)
      steps.push([...current])
      return
    }

    let newContent = ""
    steps.push([
      ...current,
      { ...m, content: newContent, isStreaming: true },
    ])

    const splits = m.content.match(/.{1,2}/gs) || []
    splits.forEach(s => {
      newContent += s
      steps.push([
        ...current,
        { ...m, content: newContent, isStreaming: true },
      ])
    })

    steps.push([
      ...current,
      { ...m, content: newContent, isStreaming: false },
    ])

    current.push(m)
  })
  return steps
}

const steps = getSteps()
const max = steps.length - 1
