import { describe, it, expect, test } from "vitest"
import { diff, tokenizeSync } from "./differ"
import { preload } from "@code-hike/lighter"

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

  const prevTokens = tokenizeSync(
    prev,
    "javascript",
    "github-dark"
  )
  const nextTokens = tokenizeSync(
    next,
    "javascript",
    "github-dark"
  )

  const result = diff(diff(null, prevTokens), nextTokens)
  return result.filter(x => x.style)
}

// can a new token get the id of a removed one, duplicate ids?
