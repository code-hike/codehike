import React from "react"
import {
  CodeLine,
  CodeTokenData,
  CodeToken,
} from "@code-hike/code-diff"
import { Tween, mapWithDefault } from "@code-hike/utils"
import { FocusString } from "./focus-parser"

function splitByFocus(
  line: CodeLine,
  focus: Tween<boolean | number[]>
) {
  const focusObject = mapWithDefault(
    focus,
    false,
    () => null
  )
}

/**
 * Splits the tokens that have different prev focus or next focus.
 */
function splitByFocusObject(
  tokens: CodeToken[],
  focus: Tween<{ start: number; end: number }[]>
) {
  let breakindexes = [] as number[]
  mapWithDefault(focus, [], columns => {
    columns.forEach(({ start, end }) => {
      breakindexes.push(start - 1)
      breakindexes.push(end)
    })
  })

  let i = 0
  let newTokens = [] as {
    content: string
    props: CodeTokenData
    focusPrev: boolean
    focusNext: boolean
  }[]

  tokens.forEach(token => {
    const [content, props] = token
    let newContent = ""
    for (let j = 0; j < content.length; j++) {
      if (i + j > 0 && breakindexes.includes(i + j)) {
        newTokens.push({
          content: newContent,
          props,
          focusPrev:
            !focus.prev || isIn(i + j - 1, focus.prev),
          focusNext:
            !focus.next || isIn(i + j - 1, focus.next),
        })
        newContent = ""
      }
      newContent += content[j]
    }
    i += content.length
    newTokens.push({
      content: newContent,
      props,
      focusPrev: !focus.prev || isIn(i - 1, focus.prev),
      focusNext: !focus.next || isIn(i - 1, focus.next),
    })
  })

  return newTokens
}

function isIn(
  index: number,
  intervals: { start: number; end: number }[]
) {
  return intervals.some(
    ({ start, end }) => start - 1 <= index && index < end
  )
}
