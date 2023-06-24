import ReactMarkdown from "react-markdown"
import { parseAnswer } from "./answer-parser"
import { BouncingDots, Replies } from "./replies"
import {
  AnswerEntry,
  ConversationEntry,
  EntryCodeFile,
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
  const newConversation = getNewConversation(
    [],
    messages,
    oldConversation,
    isStreaming,
    onReply,
    theme
  )

  ref.current.oldConversation = newConversation

  // console.log(messages, newConversation)
  return newConversation
}

function getNewConversation(
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
    const isStreamingEntry =
      isStreaming && i === newMessages.length - 1
    const newEntry = getEntry(
      oldMessage,
      newMessage,
      oldEntry,
      conversation,
      onReply,
      isStreamingEntry,
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
  conversation: ConversationEntry[],
  onReply: (v: string) => void,
  isStreaming: boolean,
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

  const content = isStreaming
    ? newMessage.content.split("\n").slice(0, -1).join("\n")
    : newMessage.content

  const parsedAnswer = parseAnswer(content)

  const { files, activeFile } = getFiles(
    parsedAnswer.fileInfoList,
    oldEntry,
    conversation,
    theme
  )
  return {
    type: "answer",
    files,
    activeFile,
    children: (
      <>
        {parsedAnswer.content ? (
          <ReactMarkdown>
            {parsedAnswer.content}
          </ReactMarkdown>
        ) : (
          <BouncingDots />
        )}

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
  oldEntry: ConversationEntry | undefined,
  conversation: ConversationEntry[],
  theme: RawTheme
): {
  files: EntryCodeFile[]
  activeFile: string
} {
  // we need the files from the previous answer
  // if it's a new file it goes first

  // if there's an open file it is active
  // else we keep the same from the prev convo
  // else we set the first one

  let prevFiles = [] as EntryCodeFile[]
  let prevActiveFile = ""

  if (oldEntry?.type === "answer") {
    prevFiles = oldEntry.files
    prevActiveFile = oldEntry.activeFile
  } else {
    const lastAnswer = conversation
      .reverse()
      .find(entry => entry.type === "answer") as
      | AnswerEntry
      | undefined
    prevFiles = lastAnswer?.files ?? []
    prevActiveFile = lastAnswer?.activeFile ?? ""
  }

  const files = prevFiles.map(prevFile => {
    const newFile = fileInfoList.find(
      newFile => newFile.name === prevFile.name
    )

    if (!newFile || newFile.text === prevFile.text) {
      return prevFile
    }

    return highlightFile(newFile, theme)
  })

  fileInfoList.forEach(fileInfo => {
    if (!files.find(file => file.name === fileInfo.name)) {
      files.unshift(highlightFile(fileInfo, theme))
    }
  })

  const activeFile = fileInfoList.find(
    fileInfo => fileInfo.open
  )?.name
  return {
    files,
    activeFile:
      activeFile || prevActiveFile || files[0]?.name,
  }
}

function highlightFile(
  fileInfo: FileInfo,
  theme: RawTheme
): EntryCodeFile {
  if (!isLangLoaded(fileInfo.lang)) {
    return {
      name: fileInfo.name,
      code: {
        lines: [
          {
            tokens: [
              {
                content: ".",
                props: {
                  style: { color: "transparent" },
                },
              },
            ],
          },
        ],
        lang: fileInfo.lang,
      },
      text: "",
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
    text: fileInfo.text,
    focus: "",
    annotations: [],
  }
}
