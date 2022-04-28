import { splitTokens } from "./splitter"
import { parseExtremes } from "../utils"
import { describe, it, expect, test } from "vitest"

describe("split tokens", () => {
  it("with no extremes", () => {
    const tokens = splitTokens(asTokens("foo", "bar"), [])
    expect(tokens).toMatchSnapshot()
  })
  it("with extremes", () => {
    const tokens = splitTokens(
      asTokens("foo", "bar"),
      asExtremes("1:2", "6")
    )
    expect(tokens).toMatchSnapshot()
  })
})

function asTokens(...strings: string[]) {
  return strings.map(content => ({ content, props: {} }))
}

function asExtremes(...strings: string[]) {
  return strings.map(s => parseExtremes(s))
}
