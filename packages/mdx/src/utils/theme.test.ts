import { describe, it, expect, test } from "vitest"

import { transparent } from "./color"

describe("transparent", () => {
  it("works without alpha", () => {
    expect(transparent("#ffffff", 0.5)).toBe("#ffffff80")
  })
})
