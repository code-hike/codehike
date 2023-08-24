import {
  defineDocumentType,
  makeSource,
} from "contentlayer/source-files"
import { myPlugin } from "./src/remark/remark.mjs"

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: post => `/posts/${post._raw.flattenedPath}`,
    },
  },
}))

export default makeSource({
  contentDirPath: "posts",
  mdx: {
    remarkPlugins: [myPlugin],
  },
  documentTypes: [Post],
})
