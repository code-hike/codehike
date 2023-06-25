// turns streaming markdown into codeblocks, content and replies
// doesnt care about previous answers
export function parseAnswer(
  markdown: string,
  isStreaming: boolean
) {
  const { markdownWithoutCode, fileInfoList } =
    extractCodeBlocks(markdown, isStreaming)
  const [answerText, repliesText] =
    markdownWithoutCode.split(/\n+---\n+/)
  const replies = repliesText
    ? repliesText
        .split(/\n/)
        .map((r: string) => r.replace(/^-\s*/, "").trim())
        .filter((r: any) => r !== "")
    : []
  return {
    fileInfoList: fileInfoList,
    content: answerText,
    replies,
  }
}

function extractCodeBlocks(
  markdown: string,
  isStreaming: boolean
) {
  const closedCodeBlocks =
    markdown.match(/```[\s\S]*?```/g) || []
  const markdownWithoutClosedCodeBlocs = markdown.replace(
    /```[\s\S]*?```/g,
    ""
  )

  const fileInfoList = closedCodeBlocks.map(s => ({
    ...codeblockToFileInfo(s),
    open: false,
  }))

  let markdownWithoutCode = markdownWithoutClosedCodeBlocs

  if (isStreaming) {
    const openCodeBlock =
      markdownWithoutClosedCodeBlocs.match(/```[\s\S]*?$/g)

    if (openCodeBlock) {
      markdownWithoutCode =
        markdownWithoutClosedCodeBlocs.replace(
          /```[\s\S]*?$/g,
          ""
        )

      let streamingCodeBlock = openCodeBlock[0]
        .split("\n")
        .slice(0, -1)
        .join("\n")

      if (streamingCodeBlock) {
        fileInfoList.push({
          ...codeblockToFileInfo(
            streamingCodeBlock + "\n```"
          ),
          open: isStreaming,
        })
      }
    }
  }

  // if ends with ` or ``, let's wait until more chars
  const backticks = markdownWithoutCode.match(/(`$|``$)/g)
  if (backticks) {
    markdownWithoutCode = markdownWithoutCode.replace(
      /(`$|``$)/g,
      ""
    )
  }

  markdownWithoutCode = markdownWithoutCode.trim()
  // console.log({ markdownWithoutCode })

  return { markdownWithoutCode, fileInfoList }
}

function codeblockToFileInfo(codeblock: string): {
  lang: string
  name: string
  text: string
} {
  const codeBlockPattern =
    /```([^ \n]+)? ?([^\n]+)?\n([\s\S]*?)\n?```/g

  const match = codeBlockPattern.exec(codeblock)

  return {
    lang: match?.[1] || "",
    name: match?.[2] || "answer",
    text: match?.[3] || "",
  }
}
