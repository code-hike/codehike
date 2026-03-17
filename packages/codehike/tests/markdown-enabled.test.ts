import { compile, run } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"
import { expect, test } from "vitest"
import { parse } from "../src/index"
import { recmaCodeHike, remarkCodeHike } from "../src/mdx"

async function compileToBlocks(source: string) {
  const result = await compile(
    { value: source, path: "/virtual/markdown-enabled.mdx" },
    {
      jsx: false,
      outputFormat: "function-body",
      remarkPlugins: [[remarkCodeHike, {}]],
      recmaPlugins: [[recmaCodeHike, {}]],
    },
  )
  const { default: Content } = await run(result, runtime)
  return parse(Content, {
    components: {
      Other: () => null,
    },
  }) as any
}

test("uses source markdown for markdownEnabled sections", async () => {
  const blocks = await compileToBlocks(`
<slot markdownEnabled>

# !!posts One

Hello **x**

| a | b |
| - | - |
| 1 | 2 |

<Other a={1 + 2} />

# !!posts Two

After _it_

</slot>
`)

  expect(blocks.props.posts[0].markdown).toContain("Hello **x**")
  expect(blocks.props.posts[0].markdown).toContain("| a | b |")
  expect(blocks.props.posts[0].markdown).not.toContain("<Other")
  expect(blocks.props.posts[1].markdown).toBe("After _it_")
})

test("does not add markdown when markdownEnabled is not set", async () => {
  const blocks = await compileToBlocks(`
<slot>

# !!posts One

Hello **x**

</slot>
`)

  expect(blocks.props.posts[0].markdown).toBeUndefined()
})

test("preserves <br /> spacing semantics around paragraphs", async () => {
  const blocks = await compileToBlocks(`
<slot markdownEnabled>

# !!posts One

<br />

First

<br />
<br />

Second

<br />

</slot>
`)

  expect(blocks.props.posts[0].markdown).toBe("\nFirst\n\n\nSecond\n")
})
