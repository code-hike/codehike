import { CodeFile } from "mini-editor"

export type ConversationEntry =
  | {
      type: "question" | "other"
      children: React.ReactNode
    }
  | AnswerEntry

export type AnswerEntry = {
  type: "answer"
  files: CodeFile[]
  activeFile?: string
  children: React.ReactNode
}

export type Message = {
  role: "user" | "assistant" | string
  content: string
}

export type FileInfo = {
  name: string
  lang: string
  text: string
  open: boolean
}
