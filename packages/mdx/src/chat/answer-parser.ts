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
    const markdownWithoutLineInProgress =
      markdownWithoutClosedCodeBlocs
        .split("\n")
        .slice(0, -1)
        .join("\n")
    const openCodeBlock =
      markdownWithoutLineInProgress.match(/```[\s\S]*?$/g)

    if (openCodeBlock) {
      markdownWithoutCode = markdownWithoutLineInProgress
        .replace(/```[\s\S]*?$/g, "")
        .trim()

      const streamingCodeBlock = openCodeBlock[0]
      fileInfoList.push({
        ...codeblockToFileInfo(
          streamingCodeBlock + "\n```"
        ),
        open: isStreaming,
      })
    }
  }

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
    name: match?.[2] || "",
    text: match?.[3] || "",
  }
}
