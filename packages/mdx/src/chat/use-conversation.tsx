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
import { RawTheme } from "@code-hike/lighter/dist/browser.esm.mjs"
import {
  getLoadedLanguages,
  isLangLoaded,
  loadLang,
} from "./languages"
import { highlightFile } from "./highlight-code"

export function useConversation(
  messages: Message[],
  isStreaming: boolean,
  onReply: (reply: string) => void,
  theme: RawTheme
): ConversationEntry[] {
  const ref = React.useRef({
    oldConversation: [] as ConversationEntry[],
  })

  const [loadingLangs, setLoadingLangs] = React.useState(
    [] as string[]
  )

  console.log(loadingLangs)

  const { oldConversation } = ref.current
  let newConversation = getNewConversation(
    [],
    messages,
    oldConversation,
    isStreaming,
    onReply,
    theme
  )

  const missingLangs = [] as string[]
  for (const entry of newConversation) {
    if (entry.type === "answer") {
      for (const file of entry.files) {
        if (
          !isLangLoaded(file.code.lang) &&
          !missingLangs.includes(file.code.lang) &&
          !loadingLangs.includes(file.code.lang)
        ) {
          missingLangs.push(file.code.lang)
        }
      }
    }
  }

  React.useEffect(() => {
    if (missingLangs.length === 0) return
    missingLangs.forEach(lang => {
      loadLang(lang).then(() => {
        setLoadingLangs(prev =>
          prev.includes(lang) ? prev : [...prev, lang]
        )
      })
    })
  }, [missingLangs.join(",")])

  // newConversation.forEach(entry => {
  //   if (entry.type === "answer") {
  //     entry.files = entry.files?.filter(
  //       f => !missingLangs.includes(f.code.lang)
  //     )
  //   }
  // })

  if (!isStreaming && missingLangs.length > 0) {
    newConversation = []
  }

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

  const parsedAnswer = parseAnswer(
    newMessage.content,
    isStreaming
  )

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

    const prevAnswer = conversation
      .reverse()
      .find(entry => entry.type === "answer") as
      | AnswerEntry
      | undefined

    const prevAnswerFile = prevAnswer?.files.find(
      file => file.name === prevFile.name
    )

    return highlightFile(newFile, theme, prevAnswerFile)
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
