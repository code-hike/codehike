import { describe, it, expect, test } from "vitest"

import {
  getFocusIndexes,
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

describe("get focus indexes", () => {
  it("return correct focus indexes", () => {
    expect(getFocusIndexes("3:4", fixtureCode)).toEqual([2, 3])
    expect(getFocusIndexes("1:8", fixtureCode)).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
  })
  it("return all lines when focus string is empty", () => {
    expect(getFocusIndexes(null, fixtureCode)).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
    expect(getFocusIndexes("", fixtureCode)).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
  })
  it("throws error if one or many indexes are larger than lines count", () => {
    expect(() => getFocusIndexes("13:14", fixtureCode)).toThrowError("Out of bound focus line number(s)")
    expect(() => getFocusIndexes("7:9", fixtureCode)).toThrowError("Out of bound focus line number(s)")
    expect(() => getFocusIndexes("1:3,7:9", fixtureCode)).toThrowError("Out of bound focus line number(s)")
  })
})

const fixtureCode = [
  "function doStuffToFoo(foo: any) {",
  "",
  " const bar = doStuff(foo)",
  " if(!bar)",
  "   return null",
  "",
  " return bar",
  "}",
]

