// turns streaming markdown into codeblocks, content and replies
// doesnt care about previous answers
export function parseAnswer(markdown: string) {
  const { markdownWithoutCode, fileInfoList } =
    extractCodeBlocks(markdown)
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

function extractCodeBlocks(markdown: string) {
  const closedCodeBlocks =
    markdown.match(/```[\s\S]*?```/g) || []
  const markdownWithoutClosedCodeBlocs = markdown.replace(
    /```[\s\S]*?```/g,
    ""
  )

  const openCodeBlock =
    markdownWithoutClosedCodeBlocs.match(/```[\s\S]*?$/g)

  const markdownWithoutCode = markdownWithoutClosedCodeBlocs
    .replace(/```[\s\S]*?$/g, "")
    .trim()

  const fileInfoList = closedCodeBlocks.map(s => ({
    ...codeblockToFileInfo(s),
    open: false,
  }))

  if (openCodeBlock) {
    fileInfoList.push({
      ...codeblockToFileInfo(openCodeBlock[0] + "\n```"),
      open: true,
    })
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
