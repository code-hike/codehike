import { InlineAnnotation, InternalToken } from "./types.js"

export type TokenGroup = {
  annotation: InlineAnnotation
  content: LineContent
  range: [number, number]
}

export type LineContent = (InternalToken | TokenGroup)[]

export function toLineContent(
  tokens: InternalToken[],
  annotations: InlineAnnotation[],
): LineContent {
  let content = tokens as LineContent
  for (let i = annotations.length - 1; i >= 0; i--) {
    const annotation = annotations[i]
    content = applyInlineAnnotation(content, annotation)
  }
  return content
}

function applyInlineAnnotation(
  lineContent: LineContent,
  annotation: InlineAnnotation,
): LineContent {
  const { fromColumn, toColumn } = annotation
  const range = [fromColumn, toColumn]
  let content = splitContent(lineContent, range[0])
  content = splitContent(content, range[1] + 1)

  let before = [] as LineContent
  let inside = [] as LineContent
  let after = [] as LineContent

  content.forEach((item) => {
    if (item.range[1] < range[0]) {
      before.push(item)
    } else if (item.range[0] > range[1]) {
      after.push(item)
    } else {
      inside.push(item)
    }
  })

  return [
    ...before,
    {
      annotation,
      content: inside,
      range: [inside[0].range[0], inside[inside.length - 1].range[1]],
    },
    ...after,
  ]
}

// split any group or content that spans across the given column number
function splitContent(lineContent: LineContent, n: number): LineContent {
  const index = lineContent.findIndex(
    (token) => token.range[0] < n && n <= token.range[1],
  )
  if (index === -1) {
    return lineContent
  }

  const item = lineContent[index]
  if (isGroup(item)) {
    const content = splitContent(item.content, n)
    let before = [] as LineContent
    let after = [] as LineContent
    for (const token of content) {
      if (token.range[1] < n) {
        before.push(token)
      } else {
        after.push(token)
      }
    }
    return [
      ...lineContent.slice(0, index),
      {
        ...item,
        content: before,
        range: [item.range[0], n - 1],
      },
      {
        ...item,
        content: after,
        range: [n, item.range[1]],
      },
      ...lineContent.slice(index + 1),
    ]
  }

  // split token
  return [
    ...lineContent.slice(0, index),
    {
      ...item,
      value: item.value.slice(0, n - item.range[0]),
      range: [item.range[0], n - 1],
    },
    {
      ...item,
      value: item.value.slice(n - item.range[0]),
      range: [n, item.range[1]],
    },
    ...lineContent.slice(index + 1),
  ]
}

export function isGroup(
  token: InternalToken | TokenGroup,
): token is TokenGroup {
  return (token as TokenGroup).content !== undefined
}
