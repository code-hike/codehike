import { expect, test, vi } from "vitest"
import { splitAnnotationsAndCode } from "./extract-annotations.js"

async function t(comment: string) {
  const code = `// ${comment} \nvar xyz = "https://example.com"`
  const { annotations } = await splitAnnotationsAndCode(code, "javascript", "!")
  return annotations[0]
}

function getBlockRange(annotation: { ranges: any[] }, index = 0) {
  const range = annotation.ranges[index]
  if (!("fromLineNumber" in range) || !("toLineNumber" in range)) {
    throw new Error("Expected block range")
  }
  return range
}

test("extracts basic annotation name", async () => {
  const annotation = await t("!foo bar")
  expect(annotation.name).toEqual("foo")
})

test("extracts name with parentheses range", async () => {
  const annotation = await t("!foo(1) bar")
  expect(annotation.name).toEqual("foo")
})

test("extracts name with brackets range", async () => {
  const annotation = await t("!foo[1] bar")
  expect(annotation.name).toEqual("foo")
})

test("extracts name with simple regex", async () => {
  const annotation = await t("!foo[/x/] bar")
  expect(annotation.name).toEqual("foo")
})

test("extracts name with regex flags", async () => {
  const annotation = await t("!foo[/x/gmi] bar")
  expect(annotation.name).toEqual("foo")
})

test("extracts name with regex containing brackets", async () => {
  const annotation = await t(`!foo[/xyz[a-z]*/g] bar`)
  expect(annotation.name).toEqual("foo")
})

test("extracts name with regex containing parentheses", async () => {
  const annotation = await t(`!foo(/(xyz[w]*)/g) bar`)
  expect(annotation.name).toEqual("foo")
})

test("extracts name with regex containing nested parentheses", async () => {
  const annotation = await t(`!foo(/((xyz)[w]*)/g) bar`)
  expect(annotation.name).toEqual("foo")
})

test("extracts name with regex containing escaped slashes", async () => {
  const annotation = await t(`!foo[/https?:\\/\\//g] bar`)
  expect(annotation.name).toEqual("foo")
})

test("extracts name with complex regex pattern", async () => {
  const code = `// !tooltip[/#\\[program\\]/] example \n#[program]`
  const { annotations } = await splitAnnotationsAndCode(code, "rust", "!")
  const annotation = annotations[0]
  expect(annotation.name).toEqual("tooltip")
})

// start/end range marker tests

test("start/end creates block annotation spanning the range", async () => {
  const code = [
    "let a = 1",
    "// !focus(start)",
    "let b = 2",
    "let c = 3",
    "// !focus(end)",
    "let d = 4",
  ].join("\n")
  const { code: resultCode, annotations } = await splitAnnotationsAndCode(
    code,
    "javascript",
    "!",
  )
  expect(resultCode).not.toContain("!focus")
  expect(annotations).toHaveLength(1)
  const a = annotations[0]
  expect(a.name).toEqual("focus")
  expect(a.ranges).toHaveLength(1)
  const range = getBlockRange(a)
  // after removing 2 comment lines, the code is 4 lines
  // "let b = 2" is line 2, "let c = 3" is line 3
  expect(range.fromLineNumber).toEqual(2)
  expect(range.toLineNumber).toEqual(3)
})

test("start/end preserves query string", async () => {
  const code = [
    "// !box(start) myquery",
    "let x = 1",
    "// !box(end)",
  ].join("\n")
  const { annotations } = await splitAnnotationsAndCode(
    code,
    "javascript",
    "!",
  )
  expect(annotations).toHaveLength(1)
  expect(annotations[0].name).toEqual("box")
  expect(annotations[0].query).toEqual("myquery")
})

test("start/end works with other annotations", async () => {
  const code = [
    "// !mark",
    "let a = 1",
    "// !focus(start)",
    "let b = 2",
    "let c = 3",
    "// !focus(end)",
    "let d = 4",
  ].join("\n")
  const { annotations } = await splitAnnotationsAndCode(
    code,
    "javascript",
    "!",
  )
  expect(annotations).toHaveLength(2)
  const mark = annotations.find((a) => a.name === "mark")
  const focus = annotations.find((a) => a.name === "focus")
  expect(mark).toBeDefined()
  expect(focus).toBeDefined()
  const range = getBlockRange(focus!)
  expect(range.fromLineNumber).toBeDefined()
  expect(range.toLineNumber).toBeDefined()
})

test("multiple start/end pairs of same name", async () => {
  const code = [
    "let a = 1",
    "// !focus(start)",
    "let b = 2",
    "// !focus(end)",
    "let c = 3",
    "// !focus(start)",
    "let d = 4",
    "// !focus(end)",
    "let e = 5",
  ].join("\n")
  const { annotations } = await splitAnnotationsAndCode(
    code,
    "javascript",
    "!",
  )
  expect(annotations).toHaveLength(2)
  expect(annotations[0].name).toEqual("focus")
  expect(annotations[1].name).toEqual("focus")
  // The two ranges should not overlap
  const r0 = getBlockRange(annotations[0])
  const r1 = getBlockRange(annotations[1])
  expect(r0.toLineNumber).toBeLessThan(r1.fromLineNumber)
})

test("same-name nested start/end pairs preserve nesting", async () => {
  const code = [
    "// !focus(start)",
    "const outer = 1",
    "// !focus(start)",
    "const inner = 2",
    "// !focus(end)",
    "const outerTail = 3",
    "// !focus(end)",
    "const after = 4",
  ].join("\n")
  const { annotations } = await splitAnnotationsAndCode(
    code,
    "javascript",
    "!",
  )

  expect(annotations).toHaveLength(2)
  expect(annotations[0].name).toEqual("focus")
  expect(annotations[0].ranges[0]).toEqual({
    fromLineNumber: 1,
    toLineNumber: 3,
  })
  expect(annotations[1].name).toEqual("focus")
  expect(annotations[1].ranges[0]).toEqual({
    fromLineNumber: 2,
    toLineNumber: 2,
  })
})

test("different annotation names with start/end", async () => {
  const code = [
    "// !focus(start)",
    "let a = 1",
    "// !mark(start)",
    "let b = 2",
    "// !mark(end)",
    "let c = 3",
    "// !focus(end)",
  ].join("\n")
  const { annotations } = await splitAnnotationsAndCode(
    code,
    "javascript",
    "!",
  )
  expect(annotations).toHaveLength(2)
  const focus = annotations.find((a) => a.name === "focus")
  const mark = annotations.find((a) => a.name === "mark")
  expect(focus).toBeDefined()
  expect(mark).toBeDefined()
})

test("start/end removes comment lines from code", async () => {
  const code = [
    "let a = 1",
    "// !focus(start)",
    "let b = 2",
    "// !focus(end)",
    "let c = 3",
  ].join("\n")
  const { code: resultCode } = await splitAnnotationsAndCode(
    code,
    "javascript",
    "!",
  )
  const lines = resultCode.split("\n")
  expect(lines).toHaveLength(3)
  expect(lines[0]).toContain("let a = 1")
  expect(lines[1]).toContain("let b = 2")
  expect(lines[2]).toContain("let c = 3")
})

test("adjacent start/end markers are ignored instead of creating empty ranges", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
  try {
    const code = [
      "// !focus(start)",
      "// !focus(end)",
      "const x = 1",
    ].join("\n")

    const { code: resultCode, annotations } = await splitAnnotationsAndCode(
      code,
      "javascript",
      "!",
    )

    expect(resultCode).toEqual("const x = 1")
    expect(annotations).toHaveLength(0)
    expect(warn).toHaveBeenCalledWith(
      "Code Hike warning: Empty !focus start/end annotation range",
    )
  } finally {
    warn.mockRestore()
  }
})

test("start/end works with Python comments", async () => {
  const code = [
    "x = 1",
    "# !focus(start)",
    "y = 2",
    "z = 3",
    "# !focus(end)",
    "w = 4",
  ].join("\n")
  const { annotations } = await splitAnnotationsAndCode(code, "python", "!")
  expect(annotations).toHaveLength(1)
  expect(annotations[0].name).toEqual("focus")
  const range = getBlockRange(annotations[0])
  expect(range.fromLineNumber).toEqual(2)
  expect(range.toLineNumber).toEqual(3)
})

test("start/end works with block comments", async () => {
  const code = [
    "int a = 1;",
    "/* !mark(start) */",
    "int b = 2;",
    "int c = 3;",
    "/* !mark(end) */",
    "int d = 4;",
  ].join("\n")
  const { annotations } = await splitAnnotationsAndCode(code, "c", "!")
  expect(annotations).toHaveLength(1)
  expect(annotations[0].name).toEqual("mark")
})
