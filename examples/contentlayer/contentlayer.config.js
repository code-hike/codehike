import { defineDocumentType, makeSource } from "contentlayer/source-files"
import { remarkCodeHike } from "@code-hike/mdx"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const theme = require("shiki/themes/nord.json")

export const Post = defineDocumentType(() => ({
  name: "Post",
  contentType: "mdx",
  filePathPattern: "**/*.mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
  },
}))

export default makeSource({
  contentDirPath: "posts",
  documentTypes: [Post],
  mdx: { remarkPlugins: [[remarkCodeHike, { theme }]] },
})
