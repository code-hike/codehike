import { expect, test } from "vitest"
import { setMetadata } from "./metadata"

test("set", () => {
  expect(
    setMetadata("hello", { foo: "bar" })
  ).toMatchSnapshot()
})

test("add", () => {
  const content = setMetadata("hello", { foo: "bar" })
  expect(setMetadata(content, { x: "y" })).toMatchSnapshot()
})

test("change", () => {
  const content = setMetadata("hello", { foo: "bar" })
  expect(
    setMetadata(content, { foo: "y" })
  ).toMatchSnapshot()
})
