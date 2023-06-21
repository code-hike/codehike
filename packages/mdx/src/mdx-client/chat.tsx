import { InnerCode } from "./code"
import React from "react"
import { highlight } from "@code-hike/lighter/dist/browser.esm.mjs"
import { getDiffFocus } from "./focus-diff"
import ReactMarkdown from "react-markdown"
import { getCSSVariablesObject } from "utils/theme"

export function Chat({
  steps,
  style,
  height,
  onReply,
  theme,
}) {
  const [selectedStep, setSelectedStep] = React.useState(0)
  const [newFiles, setNewFiles] = React.useState(null)
  const [activeFile, setActiveFile] = React.useState(null)

  const contentRef = React.useRef(null)
  const stickerRef = React.useRef(null)

  const hasCode = steps.some(s => s.code?.length)

  React.useEffect(() => {
    const step = steps[selectedStep]
    if (!step?.code?.length) return
    mapFiles(
      step.code,
      steps[selectedStep - 1]?.code,
      theme
    ).then(files => {
      setNewFiles(files)
      const changedTitles = files
        .filter(f => f.focus !== "")
        .map(f => f.name)
      const newTitles = files
        .filter(f =>
          steps[selectedStep - 1]?.code?.every(
            f2 => f2.name !== f.name
          )
        )
        .map(f => f.name)

      if (changedTitles.includes(activeFile)) {
        // do nothing
      } else if (changedTitles.length > 0) {
        setActiveFile(changedTitles[0])
      } else if (newTitles.length > 0) {
        setActiveFile(newTitles[0])
      } else if (
        activeFile &&
        !files.some(f => f.name === activeFile)
      ) {
        setActiveFile(null)
      }
    })
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

  const [themeVariables, setThemeVariables] =
    React.useState({})
  React.useEffect(() => {
    getCSSVariablesObject(theme).then(setThemeVariables)
  }, [theme])

  return (
    <section
      className={
        "ch-scrollycoding ch-chat " +
        (hasCode ? "" : "ch-chat-no-code")
      }
      style={{ ...themeVariables, ...style }}
    >
      <div
        className="ch-scrollycoding-sticker"
        style={{ height }}
        ref={stickerRef}
      >
        {newFiles && (
          <StickerCode
            files={newFiles}
            setActiveFile={setActiveFile}
            activeFile={activeFile}
          />
        )}
      </div>
      <div
        className="ch-scrollycoding-content"
        style={{ minHeight: height }}
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
            <Content
              step={step}
              onReply={onReply}
              isLast={i === steps.length - 1}
            />
          </div>
        ))}
      </div>
    </section>
  )
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

function Replies({ replies, onReply }) {
  if (!replies || replies.length === 0) return null
  return (
    <div className="ch-chat-replies">
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
      className="ch-chat-reply"
    >
      <ReactMarkdown>{value}</ReactMarkdown>
    </button>
  )
}

function Content({ step, onReply, isLast }) {
  return (
    <>
      {step.question && (
        <Question>
          <ReactMarkdown>{step.question}</ReactMarkdown>
        </Question>
      )}
      {step.answer ? (
        <Answer>
          <ReactMarkdown>{step.answer}</ReactMarkdown>
          {isLast && (
            <Replies
              replies={step.replies}
              onReply={onReply}
            />
          )}
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
    <div className="ch-chat-bouncing-dots">
      <div />
      <div />
      <div />
    </div>
  )
}

async function mapFiles(newCode, oldCode, theme) {
  const files = await Promise.all(
    newCode.map(async file => {
      const oldFile = oldCode?.find(
        f => f?.title === file?.title
      )
      return mapFile(file, oldFile, theme)
    })
  )
  return files
}

async function mapFile(
  { lang, text, title },
  oldCode,
  theme
) {
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

  const result = await highlight(code, lang, theme).catch(
    () => highlight(code, "text", theme)
  )

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
  return (
    <div
      className={
        isQuestion
          ? "ch-chat-message ch-chat-question"
          : "ch-chat-message ch-chat-answer"
      }
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
