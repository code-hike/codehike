import { describe, it, expect, test } from "vitest"

import {
  mapFocusToLineNumbers,
  relativeToAbsolute,
} from "./focus"

test("map focus to line numbers", () => {
  const focus = "1:2,3[1:5,7]"
  const result = mapFocusToLineNumbers(focus, [1, 2, 3, 4])
  expect(result).toMatchSnapshot()
})

describe("relative to absolute", () => {
  it("empty string", () => {
    expect(relativeToAbsolute(undefined, 3)).toBe("3")
    expect(relativeToAbsolute("", 3)).toBe("3")
  })
  it("columns", () => {
    expect(relativeToAbsolute("[1]", 3)).toBe("3[1]")
    expect(relativeToAbsolute("[2,5:7]", 3)).toBe(
      "3[2,5:7]"
    )
  })
  it("lines", () => {
    expect(relativeToAbsolute("(1)", 3)).toBe("3")
    expect(relativeToAbsolute("(2)", 3)).toBe("4")
    expect(relativeToAbsolute("(1,3)", 3)).toBe("3,5")
    expect(relativeToAbsolute("(1:3)", 3)).toBe("3:5")
    expect(relativeToAbsolute("(1:3,4)", 3)).toBe("3:5,6")
    expect(relativeToAbsolute("(1:2,4[1:3,5])", 3)).toBe(
      "3:4,6[1:3,5]"
    )
  })
})
