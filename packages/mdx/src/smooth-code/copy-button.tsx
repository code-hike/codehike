import React from "react"

export function CopyButton({
  content,
  style,
  className,
}: {
  content: string
  style?: React.CSSProperties
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  return (
    <button
      type="button"
      title="Copy code"
      className={className}
      style={style}
      onClick={() => {
        copyToClipboard(content)
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 1200)
      }}
    >
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {copied ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6px"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        )}
      </svg>
    </button>
  )
}

function copyToClipboard(text: string) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text)
    return
  }
  navigator.clipboard.writeText(text)
}

function fallbackCopyTextToClipboard(text: string) {
  var textArea = document.createElement("textarea")
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = "0"
  textArea.style.left = "0"
  textArea.style.position = "fixed"

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    var successful = document.execCommand("copy")
    // var msg = successful ? "successful" : "unsuccessful"
    // console.log("Fallback: Copying text command was " + msg)
  } catch (err) {
    // console.error("Fallback: Oops, unable to copy", err)
  }

  document.body.removeChild(textArea)
}
