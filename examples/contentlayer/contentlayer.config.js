import { defineDocumentType, makeSource } from "contentlayer/source-files"
import { remarkCodeHike } from "@code-hike/mdx"

const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/posts/${doc._raw.flattenedPath}`,
    },
  },
}))

export default makeSource({
  contentDirPath: "posts",
  documentTypes: [Post],

  mdx: { remarkPlugins: [[remarkCodeHike, { theme: "material-palenight" }]] },
})
