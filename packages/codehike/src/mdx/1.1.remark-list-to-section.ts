import { BlockContent, Code, DefinitionContent, Heading, Image } from "mdast"
import { MdxJsxFlowElement } from "mdast-util-mdx-jsx"
import { CodeHikeConfig } from "./config.js"
import { highlight } from "../code/highlight.js"

export type JSXChild = BlockContent | DefinitionContent

interface HikeNodeMap {
  section: HikeSection
  code: HikeCode
  image: HikeImage
  quote: HikeQuote
  content: HikeContent
}

type HikeNode = HikeNodeMap[keyof HikeNodeMap]

interface HikeNodeBase {
  name: string
  multi: boolean
  index?: number
}

export interface HikeSection extends HikeNodeBase {
  _data: {
    header: string
  }
  type: "section"
  title: string
  depth: number
  parent: HikeSection | null
  children: HikeNode[]
}

interface HikeCode extends HikeNodeBase {
  type: "code"
  value: string
  lang?: string | null | undefined
  meta?: string | null | undefined
}

interface HikeImage extends HikeNodeBase {
  type: "image"
  alt: string
  title: string
  url: string
}

interface HikeQuote extends HikeNodeBase {
  type: "quote"
  value: string
}

export interface HikeContent {
  type: "content"
  value: JSXChild
}

const DEFAULT_BLOCKS_NAME = "blocks"
const DEFAULT_CODE_NAME = "code"
const DEFAULT_IMAGES_NAME = "image"
const DEFAULT_VALUE_NAME = "value"

export async function listToSection(
  hikeElement: MdxJsxFlowElement,
  config: CodeHikeConfig,
): Promise<HikeSection> {
  const { children = [] } = hikeElement

  const root: HikeSection = {
    type: "section",
    _data: {
      header: "",
    },
    name: "",
    depth: 0,
    title: "",
    parent: null,
    children: [],
    multi: false,
  }
  let parent: HikeSection = root

  for (const child of children) {
    if (
      child.type === "heading" &&
      child.children[0]?.type === "text" &&
      child.children[0]?.value?.trim().startsWith("!")
    ) {
      while (parent.depth >= child.depth && parent.parent) {
        parent = parent.parent
      }

      const { name, title, multi } = parseHeading(child)
      const section: HikeSection = {
        type: "section",
        _data: {
          header: "#".repeat(child.depth) + " " + child.children[0].value,
        },
        parent,
        depth: child.depth,
        name,
        title,
        multi,
        index: !multi
          ? undefined
          : parent.children.filter(
              (c) => c.type != "content" && c.name === name,
            ).length,
        children: [],
      }

      parent.children.push(section)
      parent = section
    } else if (
      child.type === "heading" &&
      child.children[0]?.type === "text" &&
      child.children[0]?.value?.trim() === "/"
    ) {
      while (parent.depth >= child.depth && parent.parent) {
        parent = parent.parent
      }
    } else if (isHikeCode(child)) {
      const parsedChild = await parseCode(child, config)

      const {
        name = DEFAULT_CODE_NAME,
        multi,
        title,
      } = parseName(parsedChild.meta || "")
      parent.children.push({
        type: "code",
        name,
        multi,
        index: multi
          ? parent.children.filter(
              (c) => c.type != "content" && c.name === name,
            ).length
          : undefined,
        // will need to use getObjectAttribute
        ...parsedChild,
        meta: title,
      })
    } else if (isImageAndParagraphs(child)) {
      child.children.forEach((c) => {
        if (c.type == "text" && c.value.trim() === "") {
          // ignore
        } else if (c.type == "text" && c.value.trim().startsWith("!")) {
          const values = splitValues(c.value)
          values.forEach((value) => {
            const { name = DEFAULT_VALUE_NAME, multi, title } = parseName(value)
            parent.children.push({
              type: "quote",
              name,
              multi,
              index: multi
                ? parent.children.filter(
                    (c) => c.type != "content" && c.name === name,
                  ).length
                : undefined,
              value: title,
            })
          })
        } else if (c.type == "image" && c.alt?.startsWith("!")) {
          const img = c
          const {
            name = DEFAULT_IMAGES_NAME,
            title,
            multi,
          } = parseName(img.alt || "")

          parent.children.push({
            type: "image",
            name,
            multi,
            index: multi
              ? parent.children.filter(
                  (c) => c.type != "content" && c.name === name,
                ).length
              : undefined,
            alt: title,
            title: img.title || "",
            url: img.url,
          })
        }
      })
    } else {
      parent.children.push({
        type: "content",
        value: child,
      })
    }
  }

  return root
}

function splitValues(str: string) {
  // (?:!!|!)           - Match either '!!' or '!' at the start of a line (non-capturing group)
  // .*                 - Match any characters (except newline) after the '!!' or '!'
  // (?:                - Start of non-capturing group
  //   (?:\r?\n|\r)     - Match any common line ending: \r\n (Windows), \n (Unix), or \r (old Mac)
  //   (?!!|!)          - Negative lookahead: the next line should not start with '!' or '!!'
  //   .*               - Match any characters (except newline) on this continuation line
  // )*                 - End of non-capturing group, repeat 0 or more times
  return str.trim().match(/(?:!!|!).*(?:(?:\r?\n|\r)(?!!|!).*)*/g) || []
}

function isImageAndParagraphs(child: any): child is {
  type: "paragraph"
  children: (Image | { type: "text"; value: string })[]
} {
  if (child.type !== "paragraph" || !child.children) return false

  return child.children.every((c: any) => {
    return (
      (c.type === "image" && c.alt?.startsWith("!")) ||
      (c.type === "text" && c.value.trim().startsWith("!")) ||
      (c.type === "text" && c.value.trim() === "") ||
      c.type === "break"
    )
  })
}

export function isHikeElement(child: any) {
  return (
    isHikeHeading(child) || isHikeCode(child) || isImageAndParagraphs(child)
  )
}

function isHikeCode(child: any): child is Code {
  return child.type === "code" && child.meta?.trim().startsWith("!")
}

function isHikeHeading(child: any) {
  return (
    child.type === "heading" &&
    child.children[0]?.type === "text" &&
    child.children[0]?.value?.trim().startsWith("!")
  )
}

function parseName(value: string) {
  const multi = value.startsWith("!!")
  const content = multi ? value.slice(2) : value.slice(1)
  const name = content?.split(/\s+/)[0]
  const title = content?.slice(name.length).trim()
  return {
    name: name || undefined,
    title,
    multi,
  }
}

function parseHeading(heading: Heading) {
  if (heading.children[0]?.type != "text") {
    throw new Error("Heading must have text")
  }

  const value = heading.children[0].value.trim()
  const multi = value.startsWith("!!")
  const content = multi ? value.slice(2) : value.slice(1)
  const name = content?.split(/\s+/)[0]
  const title = content?.slice(name.length).trim()
  return {
    name: name || DEFAULT_BLOCKS_NAME,
    title,
    multi,
  }
}

export async function parseCode(
  code: {
    value: string
    lang?: string | null
    meta?: string | null
  },
  config: CodeHikeConfig,
) {
  const rawCode = {
    value: code.value,
    lang: code.lang || "",
    meta: code.meta || "",
  }

  if (config.syntaxHighlighting) {
    if (!config.syntaxHighlighting.theme) {
      throw new Error("No theme provided for syntax highlighting")
    }
    return await highlight(rawCode, config.syntaxHighlighting.theme)
  }

  return rawCode
}
