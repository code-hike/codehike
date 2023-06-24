import React from "react"
import { InnerCode } from "../mdx-client/code"
import {
  AnswerEntry,
  ConversationEntry,
  EntryCodeFile,
} from "./types"
import { Swap } from "mdx-client/ssmq"
import { RawTheme } from "@code-hike/lighter/dist/browser.esm.mjs"
import { getCSSVariablesObjectSync } from "utils/theme"

type ChatProps = {
  staticMediaQuery?: string
  height: React.CSSProperties["height"]
  conversation: ConversationEntry[]
  theme: RawTheme
} & React.HTMLAttributes<HTMLElement>

export function NewChat({
  staticMediaQuery = "not screen, (max-width: 930px)",
  theme,
  style,
  ...props
}: ChatProps) {
  const cssVariables = React.useMemo(
    () => getCSSVariablesObjectSync(theme),
    [theme]
  )
  const newStyle = { ...style, ...cssVariables }

  return (
    <Swap
      match={[
        [
          staticMediaQuery,
          <StaticChat style={newStyle} {...props} />,
        ],
        [
          "default",
          <DynamicChat style={newStyle} {...props} />,
        ],
      ]}
    />
  )
}

function StaticChat({
  conversation,
  height,
  ...props
}: Omit<ChatProps, "staticMediaQuery" | "theme">) {
  return (
    <section {...props} className="ch-chat-static">
      {conversation.map((entry, i) =>
        entry.type === "answer" ? (
          <React.Fragment key={i}>
            <Code
              files={entry.files}
              activeFile={entry.activeFile}
            />
            <div className="ch-chat-message ch-chat-answer">
              {entry.children}
            </div>
          </React.Fragment>
        ) : entry.type === "question" ? (
          <div
            key={i}
            className="ch-chat-message ch-chat-question"
          >
            {entry.children}
          </div>
        ) : (
          <React.Fragment key={i}>
            {entry.children}
          </React.Fragment>
        )
      )}
    </section>
  )
}

function DynamicChat({
  conversation,
  height,
  ...props
}: Omit<ChatProps, "staticMediaQuery" | "theme">) {
  const hasCode =
    true ||
    conversation.some(
      s => s.type === "answer" && s.files?.length
    )
  const contentRef = React.useRef<HTMLDivElement>(null)
  const stickerRef = React.useRef<HTMLDivElement>(null)
  React.useLayoutEffect(() => {
    if (stickerRef.current && contentRef.current) {
      alignBottoms(contentRef.current, stickerRef.current)
    }
  }, [conversation])

  const answers = conversation.filter(
    c => c.type === "answer"
  )
  const lastAnswer = answers[answers.length - 1] as any
  const files = lastAnswer?.files

  return (
    <section
      {...props}
      className={
        "ch-scrollycoding ch-chat " +
        (hasCode ? "" : "ch-chat-no-code")
      }
    >
      <div
        className="ch-scrollycoding-sticker"
        style={{ height }}
        ref={stickerRef}
      >
        <Code
          files={files}
          activeFile={lastAnswer?.activeFile}
        />
      </div>

      <div
        className="ch-scrollycoding-content"
        style={{ minHeight: height }}
        ref={contentRef}
      >
        {conversation.map((kid, i) => (
          <div
            key={i}
            className="ch-scrollycoding-step-content"
          >
            {kid.type === "answer" ? (
              <div className="ch-chat-message ch-chat-answer">
                {kid.children}
              </div>
            ) : kid.type === "question" ? (
              <div className="ch-chat-message ch-chat-question">
                {kid.children}
              </div>
            ) : (
              kid.children
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function alignBottoms(
  stickerElement: HTMLElement,
  contentElement: HTMLElement
) {
  const stickerElementRect =
    stickerElement.getBoundingClientRect()
  const stickerElementBottom = stickerElementRect.bottom

  const lastStepElementRect =
    contentElement.getBoundingClientRect()
  const lastStepElementHeight = lastStepElementRect.height

  const targetScrollTop =
    stickerElementBottom - lastStepElementHeight

  const currentScrollTop = window.pageYOffset
  const newWindowScrollTop =
    currentScrollTop +
    (targetScrollTop - lastStepElementRect.top)

  window.scrollTo({
    top: newWindowScrollTop,
  })
}

const Code = React.memo(
  ({
    files,
    activeFile,
  }: {
    files: EntryCodeFile[]
    activeFile?: string
  }) => {
    const [active, setActiveFile] =
      React.useState(activeFile)

    React.useEffect(() => {
      setActiveFile(activeFile)
    }, [activeFile])

    if (!files || !files.length) return null

    return (
      <InnerCode
        codeConfig={{
          showCopyButton: true,
          showExpandButton: true,
        }}
        northPanel={{
          tabs: files.map(f => f.name),
          active: active || activeFile,
          heightRatio: 1,
        }}
        files={files}
        style={{ height: "100%" }}
        onTabClick={tab => {
          setActiveFile(tab)
        }}
      />
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.activeFile === nextProps.activeFile &&
      prevProps.files?.length === nextProps.files?.length &&
      prevProps.files?.every(
        (f, i) => f.text === nextProps.files[i]?.text
      )
    )
  }
)
