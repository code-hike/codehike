import ReactMarkdown from "react-markdown"
import { parseAnswer } from "./answer-parser"
import { Replies } from "./replies"
import {
  ConversationEntry,
  FileInfo,
  Message,
} from "./types"
import React from "react"
import { CodeFile } from "mini-editor"
import {
  highlightSync,
  RawTheme,
} from "@code-hike/lighter/dist/browser.esm.mjs"
import {
  getLoadedLanguages,
  isLangLoaded,
  loadLang,
} from "./laguages"

export function useConversation(
  messages: Message[],
  isStreaming: boolean,
  onReply: (reply: string) => void,
  theme: RawTheme
): ConversationEntry[] {
  const ref = React.useRef({
    oldConversation: [] as ConversationEntry[],
  })

  const { oldConversation } = ref.current
  const newConversation = getPartialConversation(
    [],
    messages,
    oldConversation,
    isStreaming,
    onReply,
    theme
  )

  ref.current.oldConversation = newConversation

  console.log(messages, newConversation)
  return newConversation
}

function getPartialConversation(
  oldMessages: Message[],
  newMessages: Message[],
  oldConversation: ConversationEntry[],
  isStreaming: boolean,
  onReply: (reply: string) => void,
  theme: RawTheme
): ConversationEntry[] {
  const [loadedLangs, setLoadedLangs] = React.useState(
    getLoadedLanguages
  )

  const headCount = Math.max(oldConversation.length - 2, 0)
  const conversation = oldConversation.slice(0, headCount)

  for (let i = headCount; i < newMessages.length; i++) {
    const oldMessage = oldMessages[i]
    const newMessage = newMessages[i]
    const oldEntry = oldConversation[i]
    const newEntry = getEntry(
      oldMessage,
      newMessage,
      oldEntry,
      onReply,
      theme
    )
    if (newEntry) {
      conversation.push(newEntry)
    } else {
      break
    }
  }

  const missingLangs = [] as string[]
  for (const entry of conversation) {
    if (entry.type === "answer") {
      for (const file of entry.files) {
        if (
          !loadedLangs.includes(file.code.lang) &&
          !missingLangs.includes(file.code.lang)
        ) {
          missingLangs.push(file.code.lang)
        }
      }
    }
  }
  console.log(missingLangs)

  // todo - should be effect
  missingLangs.forEach(lang => {
    loadLang(lang).then(() => {
      setLoadedLangs(prev =>
        prev.includes(lang) ? prev : [...prev, lang]
      )
    })
  })

  return conversation
}

function getEntry(
  oldMessage: Message | undefined,
  newMessage: Message | undefined,
  oldEntry: ConversationEntry | undefined,
  onReply: (v: string) => void,
  theme: RawTheme
): ConversationEntry | undefined {
  if (!newMessage) return undefined
  if (newMessage.role === "user") {
    return {
      type: "question",
      children: (
        <ReactMarkdown>{newMessage.content}</ReactMarkdown>
      ),
    }
  }

  const parsedAnswer = parseAnswer(newMessage.content)
  const { files, activeFile } = getFiles(
    parsedAnswer.fileInfoList,
    theme
  )
  return {
    type: "answer",
    files,
    activeFile,
    children: (
      <>
        <ReactMarkdown>
          {parsedAnswer.content}
        </ReactMarkdown>
        <Replies
          replies={parsedAnswer.replies}
          onReply={onReply}
        />
      </>
    ),
  }
}

function getFiles(
  fileInfoList: FileInfo[],
  theme: RawTheme
): {
  files: CodeFile[]
  activeFile: string
} {
  const files = fileInfoList.map(fileInfo => {
    if (!isLangLoaded(fileInfo.lang)) {
      return {
        name: fileInfo.name,
        code: {
          // TODO this should be just lines: []
          lines: [{ tokens: [{ content: "" }] }],
          lang: fileInfo.lang,
        },
        focus: "",
        annotations: [],
      }
    }
    const result = highlightSync(
      fileInfo.text,
      fileInfo.lang,
      theme
    )
    const lines = result.lines.map(line => ({
      tokens: line.map(token => ({
        content: token.content,
        props: { style: token.style },
      })),
    }))
    return {
      name: fileInfo.name,
      code: {
        lines,
        lang: fileInfo.lang,
      },
      focus: "",
      annotations: [],
    }
  }) as CodeFile[]
  return {
    files,
    activeFile: files[0]?.name,
  }
}
