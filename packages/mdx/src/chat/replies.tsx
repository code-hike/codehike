import ReactMarkdown from "react-markdown"
import React from 'react'

export function Replies({
  replies,
  onReply,
}: {
  replies: string[]
  onReply: (reply: string) => void
}) {
  if (!replies || replies.length === 0) return null
  return (
    <div className="ch-chat-replies">
      {replies.map((reply, i) => (
        <button
          key={i}
          onClick={() => onReply(reply)}
          className="ch-chat-reply"
        >
          <ReactMarkdown>{reply}</ReactMarkdown>
        </button>
      ))}
    </div>
  )
}

export const BouncingDots = () => {
  return (
    <div className="ch-chat-bouncing-dots">
      <div />
      <div />
      <div />
    </div>
  )
}
