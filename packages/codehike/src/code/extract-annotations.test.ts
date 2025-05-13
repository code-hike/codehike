import { expect, test } from "vitest"
import { splitAnnotationsAndCode } from "./extract-annotations.js"

async function t(comment: string) {
  const code = `// ${comment} \nvar xyz = "https://example.com"`
  const { annotations } = await splitAnnotationsAndCode(code, "javascript", "!")
  return annotations[0]
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
