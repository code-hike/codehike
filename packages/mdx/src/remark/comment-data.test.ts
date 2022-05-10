import { describe, it, expect, test } from "vitest"
import { highlight } from "../highlighter"
import { getCommentData } from "./comment-data"

test.each([
  "// focus",
  "       // focus",
  "foo // bar",
  "const x = 1",
  "  // box[6:9]",
  "  // bg(1:3) #222",
])("js | %s", async code => {
  expect(await getLineData("js", code)).toMatchSnapshot()
})

test.each([
  "# focus",
  "       # focus",
  "foo # bar",
  " x = '#333'",
  " # box[6:9]",
  "  # bg(1:3) #222",
])("python | %s", async code => {
  expect(
    await getLineData("python", code)
  ).toMatchSnapshot()
})

async function getLineData(lang: string, line: string) {
  return getCommentData(await asLine(lang, line), lang)
}

async function asLine(lang: string, line: string) {
  const code = await highlight({
    code: line,
    lang,
    theme: {},
  })
  return code.lines[0]
}
