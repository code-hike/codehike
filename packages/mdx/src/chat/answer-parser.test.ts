import { expect, test } from "vitest"
import { parseAnswer } from "./answer-parser"

const fixtures = [
  ``,
  `Hello`,
  `
~~~js foo.js
console.log(1)
~~~

# hello

world

---

- yes
- no

`,
  `
~~~js foo.js
console.log(1)

~~~

~~~ts bar.ts
console.log(2)
~~~

# hello

world`,
  `
~~~js foo.js
console.log(1)

`,
  `~~~js foo.js
console.log(1)
~~~

Hello

-`,
  `~~~js foo.js
console.log(1)
~~~

Hello

---`,
  ,
  `~~~js foo.js
console.log(1)
~~~

Hello

---
`,
].map(x => x.replace(/~/g, "`"))

test.each(fixtures)("%s", async markdown => {
  expect(parseAnswer(markdown, true)).toMatchSnapshot()
})
