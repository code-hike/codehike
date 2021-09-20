import React from "react"
import visit from "unist-util-visit"
import { Node } from "unist"

export function Code({ code }: { code: string }) {
  return (
    <pre style={{ outline: "2px solid red" }}>{code}</pre>
  )
}

export function remarkCodeHike(options = {}) {
  return async function transformer(tree: Node) {
    console.log(tree)
    visit(tree, "mdxjsEsm", node => {
      if (
        node.value ===
        `import { Code } from "@code-hike/mdx"`
      ) {
        console.log(node)
      }
    })
  }
}
