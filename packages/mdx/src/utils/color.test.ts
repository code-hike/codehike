import { describe, it, expect, test } from "vitest"

import { hexToObject, objectToHex } from "./color"

describe("hexToObject", () => {
  it("works with three chars", () => {
    expect(hexToObject("#f8f")).toMatchSnapshot()
  })
  it("works with four chars", () => {
    expect(hexToObject("#f8f8")).toMatchSnapshot()
  })
  it("works with six chars", () => {
    expect(hexToObject("#ff88ff")).toMatchSnapshot()
  })
  it("works with eight chars", () => {
    expect(hexToObject("#ff88ff88")).toMatchSnapshot()
  })
  it("works with undefined", () => {
    expect(hexToObject(undefined)).toMatchSnapshot()
  })
  it("throws with wrong hex", () => {
    expect(() => hexToObject("foo")).toThrow()
    expect(() => hexToObject("#2")).toThrow()
    expect(() => hexToObject("rgb(1,2,3)")).toThrow()
  })
})

describe("objectToHex", () => {
  it("works", () => {
    expect(
      objectToHex({ r: 255, g: 136, b: 255, a: 0.5 })
    ).toBe("#ff88ff80")
  })
  it("works with undefined", () => {
    expect(objectToHex(undefined)).toBe(undefined)
  })
})
