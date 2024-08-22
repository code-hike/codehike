import { MDXProps } from "mdx/types.js"
import { ZodTypeDef, z } from "zod"
import { HighlightedCode } from "./code/types.js"
import { parse } from "./index.js"

type MDXContent = (props: MDXProps) => JSX.Element

export function parseRoot<Output, Def extends ZodTypeDef, Input>(
  Content: MDXContent,
  Schema?: undefined,
  props?: MDXProps,
): unknown
export function parseRoot<Output, Def extends ZodTypeDef, Input>(
  Content: MDXContent,
  Schema: z.ZodType<Output, Def, Input>,
  props?: MDXProps,
): Output
export function parseRoot<Output, Def extends ZodTypeDef, Input>(
  Content: MDXContent,
  Schema: z.ZodType<Output, Def, Input> | undefined,
  props: MDXProps = {},
) {
  const data = parse(Content, props || {})
  if (Schema) {
    return parseProps(data, Schema)
  }
  return data
}

export const Block = z.object({
  title: z.string().optional(),
  children: z.custom<React.ReactNode>(),
})

export const CodeBlock = z.object({
  meta: z.string(),
  value: z.string(),
  lang: z.string(),
})

export const HighlightedCodeBlock = CodeBlock.extend({
  code: z.string(),
  tokens: z.custom<HighlightedCode["tokens"]>(),
  annotations: z.custom<HighlightedCode["annotations"]>(),
  themeName: z.string(),
  style: z.custom<HighlightedCode["style"]>(),
})

export const ImageBlock = z.object({
  url: z.string(),
  alt: z.string(),
  title: z.string(),
})

export function parseProps<Output, Def extends ZodTypeDef, Input>(
  content: unknown,
  Schema: z.ZodType<Output, Def, Input>,
): Output {
  if ((content as any)?.__hike) {
    throw new Error(
      "Code Hike Error: can't parse component content. Looks like you are missing CodeHike's recma plugin or the framework you are using doesn't support it.",
    )
  }

  const result = Schema.safeParse(content)
  if (result.success) {
    return result.data
  }

  const error = result.error.errors[0]

  let p = error.path.slice()
  let block = content as any
  let location = ""
  while (p.length) {
    const key = p.shift()!
    block = block[key]
    if (block?._data?.header) {
      location += `\n${block._data.header}`
    }
  }

  const { path, code, message, ...rest } = error
  const name = path[path.length - 1]

  throw new Error(`at ${location || "root"}
Error for \`${name}\`: ${message}
${JSON.stringify(rest, null, 2)}
  `)
}
