import { test } from "vitest"
import { diff } from "./differ"
import { preload } from "@code-hike/lighter"
import { tokenize } from "./tokens/code-to-tokens"

test.only("differ withIds", async () => {
  const tokens = await tokenize(
    " a b    c ",
    "javascript",
    "github-dark"
  )
  const result = diff(null, tokens)

  console.log(result)
})

test("differ", async () => {
  const result = await getTokens("a b c d", "a c f d g")
  console.log(result)
})

test("differ deleted id", async () => {
  const result = await getTokens("a b c", "a d c")
  console.log(result)
})

async function getTokens(prev, next) {
  await preload(["javascript"], "github-dark")

  const prevTokens = await tokenize(
    prev,
    "javascript",
    "github-dark"
  )
  const nextTokens = await tokenize(
    next,
    "javascript",
    "github-dark"
  )

  const result = diff(diff(null, prevTokens), nextTokens)
  return result
}

// can a new token get the id of a removed one, duplicate ids?
