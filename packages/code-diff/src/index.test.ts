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
