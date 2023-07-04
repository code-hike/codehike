import React from "react"
import { CodeBrowser } from "./code-browser"
import { EditorStep } from "./editor-shift"
import { CodeStep } from "../smooth-code/code-tween"

export function EditorExpandButton({
  step,
  ...props
}: {
  style?: React.CSSProperties
  step: EditorStep
  className?: string
}) {
  const files = step.files
  const activeFileName = step.northPanel.active

  return (
    <ExpandButton
      {...props}
      files={step.files}
      activeFileName={step.northPanel?.active}
    />
  )
}

export function CodeExpandButton({
  step,
  ...props
}: {
  style?: React.CSSProperties
  step: CodeStep
  className?: string
}) {
  const file = { ...step, name: "" }
  const activeFileName = ""

  return (
    <ExpandButton
      {...props}
      files={[file]}
      activeFileName={activeFileName}
    />
  )
}

function ExpandButton({
  style,
  className,
  files,
  activeFileName,
}: {
  style?: React.CSSProperties
  files: EditorStep["files"]
  activeFileName: string
  className?: string
}) {
  const [expanded, setExpanded] = React.useState(false)
  const [dialogSupported, setDialogSupported] =
    React.useState(true)
  const ref = React.useRef<any>(null)

  // check if <dialog /> is supported
  React.useEffect(() => {
    if (ref.current && !ref.current.showModal) {
      setDialogSupported(false)
    }
  }, [])

  if (!dialogSupported) {
    return null
  }

  return (
    <>
      <ExpandIcon
        className={className}
        style={style}
        onClick={() => {
          ref.current.showModal()
          document.body.classList.add("ch-no-scroll")
          setExpanded(true)
        }}
      />
      <dialog
        ref={ref}
        className="ch-expand-dialog"
        onClose={() => {
          setExpanded(false)
        }}
        onClick={e => {
          if (e.currentTarget === e.target) {
            ref.current.close()
            document.body.classList.remove("ch-no-scroll")
          }
        }}
      >
        <CloseButton
          onClick={() => {
            ref.current.close()
            document.body.classList.remove("ch-no-scroll")
          }}
        />
        {expanded ? (
          <div className="ch-expand-dialog-content">
            <CodeBrowser
              files={files}
              startingFileName={activeFileName}
            />
          </div>
        ) : undefined}
      </dialog>
    </>
  )
}

function ExpandIcon({
  onClick,
  style,
  className,
}: {
  onClick: () => void
  style?: React.CSSProperties
  className?: string
}) {
  return (
    <button
      type="button"
      title="Expand"
      style={style}
      onClick={onClick}
      className={className}
    >
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
        />
      </svg>
    </button>
  )
}
function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ch-expand-close"
      type="button"
      title="Close"
    >
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  )
}
