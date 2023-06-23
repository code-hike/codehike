import React from "react"
import { InnerCode } from "./code"

type ChatProps = {
  height: React.CSSProperties["height"]
  kids: Kid[]
} & React.HTMLAttributes<HTMLElement>

export type Kid =
  | {
      type: "question" | "other"
      children: React.ReactNode
    }
  | {
      type: "answer"
      children: React.ReactNode
      files: CodeFile[]
    }

type CodeFile = {
  title: string
  lang: string
  text: string
}

export function NewChat({
  kids,
  height,
  ...props
}: Omit<ChatProps, "staticMediaQuery">) {
  const hasCode =
    true ||
    kids.some(s => s.type === "answer" && s.files?.length)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const stickerRef = React.useRef<HTMLDivElement>(null)
  React.useLayoutEffect(() => {
    if (stickerRef.current && contentRef.current) {
      alignBottoms(contentRef.current, stickerRef.current)
    }
  }, [kids])

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
        <StickerCode
          files={[
            {
              name: "test.js",
              code: {
                lines: [{ tokens: [] }],
                lang: "js",
              },
              focus: "",
              annotations: [],
            },
          ]}
          setActiveFile={() => null}
          activeFile={"test.js"}
        />
      </div>

      <div
        className="ch-scrollycoding-content"
        style={{ minHeight: height }}
        ref={contentRef}
      >
        {kids.map((kid, i) => (
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

const StickerCode = React.memo(
  ({
    files,
    setActiveFile,
    activeFile,
  }: {
    files: any[]
    setActiveFile: any
    activeFile: any
  }) => {
    return (
      <InnerCode
        codeConfig={{
          showCopyButton: true,
          showExpandButton: true,
        }}
        northPanel={{
          tabs: files.map(f => f.name),
          active: activeFile || files[0]?.name,
          heightRatio: 1,
        }}
        files={files}
        style={{ height: "100%" }}
        onTabClick={tab => {
          setActiveFile(tab)
        }}
      />
    )
  }
)
