import React from "react"

type ConversationEntry = {
  question?: JSX.Element
  answer?: JSX.Element
  code?: {
    title: string
    lang: string
    text: string
  }
  replies?: string[]
}

type Conversation = ConversationEntry[]
const THINKING_MS = 2500
const WRITING_MS = 90

export function useFakeGPT(convo: Conversation) {
  const [currentConvo, setCurrentConvo] =
    React.useState<Conversation>([])

  function writeNextWord(stepIndex, currentWord = 1) {
    const answer = convo[stepIndex].answer
    if (!answer) return
    const [newJSX, finished] = sliceJSX(answer, currentWord)

    setCurrentConvo(currentConvo => [
      ...currentConvo.slice(0, -1),
      {
        ...currentConvo[stepIndex],
        answer: newJSX,
      },
    ])

    if (!finished) {
      setTimeout(
        () => writeNextWord(stepIndex, currentWord + 1),
        random(WRITING_MS)
      )
    } else {
      setCurrentConvo(currentConvo => [
        ...currentConvo.slice(0, -1),
        {
          ...currentConvo[stepIndex],
          replies: convo[stepIndex].replies || [],
        },
      ])
    }
  }

  function sendQuestion(value) {
    const index = currentConvo.length
    if (!convo[index]) return
    const next = { ...convo[index] }
    next.question = value ? (
      <p>{value}</p>
    ) : (
      convo[index].question
    )
    next.answer = undefined
    next.replies = []
    next.code = undefined

    setCurrentConvo([...currentConvo, next])

    setTimeout(() => {
      setCurrentConvo(currentConvo => [
        ...currentConvo.slice(0, -1),
        { ...currentConvo[index], code: convo[index].code },
      ])
      writeNextWord(index)
    }, random(THINKING_MS))
  }
  return [currentConvo, sendQuestion] as const
}

function sliceJSX(jsx, wordCount) {
  let remainingWords = { value: wordCount }

  const processTextNode = (text, remainingWords) => {
    if (remainingWords.value <= 0) return ""

    const words = text.split(" ")
    const slicedWords = words
      .slice(0, remainingWords.value)
      .join(" ")
    remainingWords.value -= slicedWords.split(" ").length
    return slicedWords
  }

  const newJSX = traverseJSX(
    jsx,
    remainingWords,
    processTextNode
  )
  const finished = remainingWords.value > 0
  return [newJSX, finished]
}

function traverseJSX(element, remainingWords, callback) {
  if (typeof element === "string") {
    return callback(element, remainingWords)
  }

  const updatedChildren = React.Children.map(
    element.props.children,
    child => {
      if (remainingWords.value <= 0) return undefined
      return traverseJSX(child, remainingWords, callback)
    }
  )

  return React.cloneElement(element, {}, ...updatedChildren)
}

function random(n) {
  return randomIntegerBetween(n * 0.2, n * 1.8)
}

function randomIntegerBetween(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a
}
