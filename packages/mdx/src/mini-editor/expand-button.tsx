import React from "react"
import { IRawTheme } from "vscode-textmate"
import { CodeBrowser } from "./code-browser"
import { EditorStep } from "./editor-shift"

export function ExpandButton({
  style,
  step,
  theme,
}: {
  style?: React.CSSProperties
  step: EditorStep
  theme: IRawTheme
}) {
  const [expanded, setExpanded] = React.useState(false)
  const ref = React.useRef<any>(null)
  const files = step.files
  return (
    <>
      <ExpandIcon
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
              theme={theme}
              startingFileName={step.northPanel.active}
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
}: {
  onClick: () => void
  style?: React.CSSProperties
}) {
  return (
    <svg
      style={style}
      onClick={onClick}
      className="ch-expand-button"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      role="button"
    >
      <title>Expand</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      />
    </svg>
  )
}
function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <svg
      onClick={onClick}
      className="ch-expand-close"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      role="button"
    >
      <title>Close</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}
