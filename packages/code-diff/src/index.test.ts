import { codeDiff } from "./index"

const prevCode = `
A
B
C
E
`.trim()
const nextCode = `
A
B
C
D
E
`.trim()

test("basic", () => {
  expect(
    codeDiff({
      prevCode,
      nextCode,
      lang: "js",
      lineKeys: [0, 1, 2, 3],
    })
  ).toMatchSnapshot()
})
