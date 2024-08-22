import { Theme } from "@code-hike/lighter"
import { RawCode } from "../code/types.js"

/**
 * Code Hike configuration object
 * @see [configuration documentation](https://codehike.org/docs)
 */
export type CodeHikeConfig = {
  components?: {
    code?: string
    inlineCode?: string
  }
  ignoreCode?: (codeblock: RawCode) => boolean
  syntaxHighlighting?: {
    theme?: Theme
  }
}
