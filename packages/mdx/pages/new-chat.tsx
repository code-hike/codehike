import React from "react"
import { NewChat } from "../src/chat/new-chat"
import { useConversation } from "../src/chat/use-conversation"
import theme from "@code-hike/lighter/themes/github-dark.json"

export default function Page() {
  const conversation = useConversation(
    messages,
    false,
    x => {
      console.log(x)
    },
    theme
  )
  console.log(conversation)
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
          margin: 10vh auto;
        }
      `}</style>
      <NewChat
        conversation={conversation}
        height="80vh"
        theme={theme as any}
      />
    </div>
  )
}

const messages = [
  {
    role: "user",
    content: "hi",
  },
  {
    role: "assistant",
    content: `
~~~js foo.js
console.log("this is foo")
~~~

~~~js bar.js
console.log("this is bar")
~~~

That is foo
`,
  },
  {
    role: "user",
    content: "help me `code`",
  },
].map(m => ({
  ...m,
  content: m.content.replace(/~/g, "`"),
}))
