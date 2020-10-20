import { diffLines } from "diff"

export { codeDiff }

type DiffOptions = {
  prevCode: string
  nextCode: string
  lineKeys?: number[]
  lang: string
}

function codeDiff({
  prevCode,
  nextCode,
  lineKeys,
  lang,
}: DiffOptions) {
  const changes = diffLines(
    normalize(prevCode),
    normalize(nextCode)
  )
  return 1
}

function normalize(text: string) {
  return text && text.trimEnd().concat("\n")
}
