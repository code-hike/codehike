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
    content:
      "---\nmodel: gpt-3.5-turbo-0301\n---\nremove margin from first and last child",
  },
  {
    role: "assistant",
    content:
      "```css style.css\n.parent > *:first-child {\n  margin-top: 0;\n}\n\n.parent > *:last-child {\n  margin-bottom: 0;\n}\n```\n\n\nUse the `:first-child` and `:last-child` pseudo-classes to target the first and last child elements respectively. Then set their `margin-top` and `margin-bottom` properties to `0`.\n\nDoes this solve your problem?\n\n---\n\n- Yes, thank you!\n- Can I use this with other properties like padding?\n- What if the first/last child already has a margin?",
  },
  {
    role: "user",
    content: "---\nmodel: gpt-3.5-turbo-0301\n---\nhtml",
  },
  {
    role: "assistant",
    content:
      '```html index.html\n<div class="parent">\n  <div>First child</div>\n  <div>Second child</div>\n  <div>Last child</div>\n</div>\n```\n\n\nThis is an example of a parent `div` element with three child `div` elements. The first child has the text "First child", the second child has the text "Second child", and the last child has the text "Last child".\n\nIs there anything else you need help with?\n\n---\n\n- No, that\'s all for now.',
  },
  {
    role: "user",
    content:
      "---\nmodel: gpt-3.5-turbo-0301\n---\nwith flex",
  },
  {
    role: "assistant",
    content:
      "```css style.css\n.parent {\n  display: flex;\n  flex-direction: column;\n}\n\n.parent > *:first-child {\n  margin-top: 0;\n}\n\n.parent > *:last-child {\n  margin-bottom: 0;\n}\n```\n\n\nThis code sets the parent element to a flex container with a column direction. Then, it uses the `:first-child` and `:last-child` pseudo-classes to remove the top margin from the first child and the bottom margin from the last child.\n\nDoes this help you with your issue?\n\n---\n\n- Yes, thank you!\n- Can I use this with other flex properties?\n- What if I want to remove the margin from the second child?",
  },
  {
    role: "user",
    content:
      "---\nmodel: gpt-3.5-turbo-0301\n---\nCan I use this with other flex properties?",
  },
  {
    content:
      "```css style.css\n.parent {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n\n.parent > *:first-child {\n  margin-top: 0;\n}\n\n.parent > *:last-child {\n  margin-bottom: 0;\n}\n```\n\n\nYes, you can use this code with other flex properties. In this example, the `justify-content` and `align-items` properties are set to `center` to center the child elements both horizontally and vertically.\n\nIs there anything else you need help with?\n\n---\n\n- No, that's all for now.",
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
