import { codeDiff } from "./index"

const prevCode = `
log(a)
x = "x"
`.trim()
const nextCode = `
log(a)
x = "x"
y = "y"
`.trim()

test("basic", () => {
  expect(
    codeDiff({
      prevCode,
      nextCode,
      lang: "js",
    })
  ).toMatchSnapshot()
})

const p = [1, 2, 3, 4]
const n = [1, 2, 3, 3.5, 4]
const m = { 1: "A" }
