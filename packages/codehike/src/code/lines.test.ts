import { expect, test } from "vitest"
import { toLineGroups, toLines } from "./lines.js"
import { BlockAnnotation, Tokens } from "./types.js"

function linesFromSource(source: string) {
  const tokens: Tokens = []
  const rawLines = source.split("\n")
  rawLines.forEach((line, i) => {
    if (line.length) {
      tokens.push([line])
    }
    if (i < rawLines.length - 1) {
      tokens.push("\n")
    }
  })
  return toLines(tokens)
}

test("throws a readable error when a block annotation is out of range", () => {
  const lines = linesFromSource(
    [
      "const lorem = ipsum(dolor, sit)",
      "const [amet, consectetur] = [0, 0]",
      "lorem.adipiscing((sed, elit) => {",
      "  if (sed) {",
      "    amet += elit",
      "  }",
      "})",
    ].join("\n"),
  )
  const annotation: BlockAnnotation = {
    name: "mark",
    query: "",
    fromLineNumber: 100,
    toLineNumber: 100,
  }

  expect(() => toLineGroups(lines, [annotation])).toThrowError(
    'Cannot generate a valid range for the given code. Annotation "mark" targets lines 100-100, but the code only has 7 lines.',
  )
})
