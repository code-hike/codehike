import { InnerCode } from "./code"
import React from "react"
import { highlight } from "@code-hike/lighter/dist/browser.esm.mjs"
import { extractAnnotations } from "@code-hike/lighter/dist/browser.esm.mjs"
import { evaluateSync } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"
import { getDiffFocus } from "./focus-diff"

export function Chat({ steps, style, height, onReply }) {
  const [selectedStep, setSelectedStep] = React.useState(0)
  const [newFiles, setNewFiles] = React.useState(null)

  const contentRef = React.useRef(null)
  const stickerRef = React.useRef(null)

  const hasCode = steps.some(s => s.code)

  React.useEffect(() => {
    const step = steps[selectedStep]
    if (!step?.code) return
    mapFile(step.code, steps[selectedStep - 1]?.code).then(
      file => {
        setNewFiles([file])
      }
    )
  }, [selectedStep, steps[selectedStep]?.code])

  React.useEffect(() => {
    setSelectedStep(steps.length - 1)
  }, [steps.length])

  React.useLayoutEffect(() => {
    if (
      stickerRef.current &&
      contentRef.current &&
      selectedStep === steps.length - 1
    ) {
      alignBottoms(contentRef.current, stickerRef.current)
    }
  }, [steps, selectedStep])

  return (
    <section
      className={
        "ch-scrollycoding ch-chat " +
        (hasCode ? "" : "ch-chat-no-code")
      }
      style={style}
    >
      <div
        className="ch-scrollycoding-sticker"
        style={{ height }}
        ref={stickerRef}
      >
        {newFiles && (
          <InnerCode
            codeConfig={{
              theme: {} as any,
              showCopyButton: true,
              showExpandButton: true,
              // lineNumbers: true,
            }}
            northPanel={{
              tabs: newFiles.map(f => f.name),
              active: newFiles[0]?.name,
              heightRatio: 1,
            }}
            files={newFiles}
            style={{ height: "100%" }}
          />
        )}
      </div>
      <div
        className="ch-scrollycoding-content"
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: height,
          justifyContent: "flex-end",
          gap: 10,
        }}
        ref={contentRef}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            className="ch-scrollycoding-step-content"
            data-selected={
              selectedStep === i ? true : undefined
            }
            onClick={() => setSelectedStep(i)}
          >
            <Content step={step} />
          </div>
        ))}
        {steps.length > 0 && (
          <Replies
            replies={steps[steps.length - 1].replies}
            onReply={onReply}
          />
        )}
      </div>
    </section>
  )
}

function Replies({ replies, onReply }) {
  if (!replies || replies.length === 0) return null
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      {replies.map((reply, i) => (
        <Option key={i} value={reply} onClick={onReply} />
      ))}
    </div>
  )
}
function Option({ value, onClick }) {
  return (
    <button
      onClick={() => onClick(value)}
      className="ch-chat-reply-button"
      style={{ width: "fit-content" }}
    >
      {value}
    </button>
  )
}

function Content({ step }) {
  const { default: AnswerContent } = step.answer
    ? evaluateSync(step.answer, runtime as any)
    : { default: () => undefined }
  return (
    <>
      {step.question && (
        <Question>{step.question}</Question>
      )}
      {step.answer ? (
        <Answer>
          <AnswerContent />
        </Answer>
      ) : (
        <Answer>
          <BouncingDots />
        </Answer>
      )}
    </>
  )
}

const BouncingDots = () => {
  return (
    <div className="bouncing-dots">
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
    </div>
  )
}

async function mapFile({ lang, text, title }, oldCode) {
  const focus = oldCode?.text
    ? getDiffFocus(oldCode?.text, text)
    : ""
  // const { code, annotations } = await extractAnnotations(
  //   text,
  //   lang,
  //   ["focus"]
  // )
  // const focus = annotations
  //   .map(a =>
  //     a.ranges
  //       .map((r: any) =>
  //         r.lineNumber
  //           ? `${r.lineNumber}[${r.fromColumn}:${r.toColumn}]`
  //           : `${r.fromLineNumber}:${r.toLineNumber}`
  //       )
  //       .join(",")
  //   )
  //   .join(",")
  const code = text

  const result = await highlight(code, lang, "dracula")
  return {
    name: title,
    focus,
    annotations: [],
    code: {
      lang: result.lang,
      lines: result.lines.map(line => ({
        tokens: line.map(t => ({
          content: t.content,
          props: { style: t.style },
        })),
      })),
    },
  }
}

function Bubble({ children, isQuestion }) {
  const extraStyle = isQuestion
    ? {
        backgroundColor: "#0084ff",
        borderBottomRightRadius: 3,
      }
    : {
        backgroundColor: "rgb(47, 51, 54)",
        borderTopLeftRadius: 3,
      }
  return (
    <div
      className={isQuestion ? "question" : "answer"}
      style={{
        // margin: '10px 0',
        padding: "16px",
        borderRadius: 16,
        color: "white",
        lineHeight: "1.5",
        ...extraStyle,
      }}
    >
      {children}
    </div>
  )
}

function Question({ children }) {
  return <Bubble isQuestion>{children}</Bubble>
}

function Answer({ children }) {
  return <Bubble isQuestion={false}>{children}</Bubble>
}

function alignBottoms(stickerElement, contentElement) {
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
