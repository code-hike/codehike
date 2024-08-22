import { Plugin } from "unified"
// this adds the jsx node types to Root
import "mdast-util-mdx-jsx"
import { Root } from "mdast"

import { transformImportedCode } from "./mdx/0.import-code-from-path.js"
import { transformAllHikes } from "./mdx/1.0.transform-hikes.js"
import { transformAllCode } from "./mdx/2.transform-code.js"
import { transformHikeProps } from "./mdx/3.transform-hike-props.js"
import { CodeHikeConfig } from "./mdx/config.js"

export type { CodeHikeConfig }

export const remarkCodeHike: Plugin<[CodeHikeConfig?], Root, Root> = (
  config,
) => {
  const safeConfig = config || {}
  return async (root, file) => {
    let tree = await transformImportedCode(root, file)
    tree = await transformAllHikes(tree, safeConfig)
    tree = await transformAllCode(tree, safeConfig)
    return tree
  }
}

export const recmaCodeHike: Plugin<[CodeHikeConfig?], Root, Root> = (
  config,
) => {
  return async (root) => {
    let tree = transformHikeProps(root) as any
    return tree as any
  }
}
