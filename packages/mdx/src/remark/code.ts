import { highlight } from "../highlighter"
import { extractLinks } from "./links"
import { NodeInfo, splitChildren } from "./unist-utils"
import { CodeStep } from "../smooth-code"
import { EditorProps } from "../mini-editor"
import {
  getAnnotationsFromMetastring,
  extractAnnotationsFromCode,
  extractJSXAnnotations,
} from "./annotations"
import { mergeFocus } from "../utils"
import { CodeNode, SuperNode } from "./nodes"
import { CodeHikeConfig } from "./config"

export function isEditorNode(
  node: SuperNode,
  config: CodeHikeConfig
) {
  if (node.type === "code") {
    const lang = (node.lang as string) || ""
    const shouldSkip = config.skipLanguages.includes(lang)
    return !shouldSkip
  }
  return (
    node.type === "mdxJsxFlowElement" &&
    node.name === "CH.Code"
  )
}

export async function mapAnyCodeNode(
  nodeInfo: NodeInfo,
  config: CodeHikeConfig
) {
  const { node } = nodeInfo
  if (node.type === "code") {
    return mapCode(nodeInfo as NodeInfo<CodeNode>, config)
  } else {
    return mapEditor(nodeInfo, config)
  }
}

type Props = Omit<EditorProps, "codeConfig">

async function mapCode(
  nodeInfo: NodeInfo<CodeNode>,
  config: CodeHikeConfig
): Promise<Props> {
  const file = await mapFile(nodeInfo, config)
  const props: Props = {
    northPanel: {
      tabs: [file.name],
      active: file.name,
      heightRatio: 1,
    },
    files: [file],
  }
  return props
}

export async function mapEditor(
  { node }: NodeInfo,
  config: CodeHikeConfig
): Promise<Props> {
  const [northNodes, southNodes = []] = splitChildren(
    node,
    "thematicBreak"
  )

  const northFiles = await Promise.all(
    northNodes
      .filter(({ node }) => node.type === "code")
      .map((nodeInfo: NodeInfo<CodeNode>) =>
        mapFile(nodeInfo, config)
      )
  )
  const southFiles = await Promise.all(
    southNodes
      .filter(({ node }) => node.type === "code")
      .map((nodeInfo: NodeInfo<CodeNode>) =>
        mapFile(nodeInfo, config)
      )
  )
  const allFiles = [...northFiles, ...southFiles]
  const northActive =
    northFiles.find(f => f.active) || northFiles[0]
  const southActive = southFiles.length
    ? southFiles.find(f => f.active) || southFiles[0]
    : null
  const northLines = northActive.code.lines.length || 1
  const southLines = southActive?.code.lines.length || 0
  const northRatio = southActive
    ? (northLines + 2) / (southLines + northLines + 4)
    : 1
  const southRatio = 1 - northRatio

  const props = {
    northPanel: {
      tabs: northFiles.map(x => x.name) as any,
      active: northActive.name as any,
      heightRatio: northRatio,
    },
    southPanel: southFiles.length
      ? {
          tabs: southFiles.map(x => x.name) as any,
          active: southActive!.name as any,
          heightRatio: southRatio,
        }
      : undefined,
    files: allFiles as any,
  }
  return props
}

async function mapFile(
  { node, index, parent }: NodeInfo<CodeNode>,
  config: CodeHikeConfig
): Promise<CodeStep & FileOptions & { name: string }> {
  const { theme } = config

  const lang = (node.lang as string) || "text"

  const code = await highlight({
    code: node.value as string,
    lang,
    theme,
  })

  const [commentAnnotations, commentFocus] =
    extractAnnotationsFromCode(code)

  const options = parseMetastring(
    typeof node.meta === "string" ? node.meta : ""
  )

  const metaAnnotations = getAnnotationsFromMetastring(
    options as any
  )

  const linkAnnotations = extractLinks(
    node,
    index,
    parent,
    node.value as string
  )

  const jsxAnnotations = extractJSXAnnotations(
    node,
    index,
    parent
  )

  const file = {
    ...options,
    focus: mergeFocus(options.focus, commentFocus),
    code,
    name: options.name || "",
    annotations: [
      ...metaAnnotations,
      ...commentAnnotations,
      ...jsxAnnotations,
    ],
  }

  return file
}

type FileOptions = {
  focus?: string
  active?: string
  hidden?: boolean
}

function parseMetastring(
  metastring: string
): FileOptions & { name: string } {
  const params = metastring.split(" ")
  const options = {} as FileOptions
  let name: string | null = null
  params.forEach(param => {
    const [key, value] = param.split("=")
    if (value != null) {
      ;(options as any)[key] = value
    } else if (name === null) {
      name = key
    } else {
      ;(options as any)[key] = true
    }
  })
  return { name: name || "", ...options }
}
