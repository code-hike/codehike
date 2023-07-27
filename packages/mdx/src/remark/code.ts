import { highlight } from "./lighter"
import { NodeInfo, splitChildren } from "./unist-utils"
import { CodeStep } from "../smooth-code"
import { getAnnotationsFromMetastring } from "./annotations.metastring"
import { CodeNode, SuperNode } from "./nodes"
import { CodeHikeConfig } from "./config"
import { splitCodeAndAnnotations } from "./annotations.comments"
import { EditorStep } from "../core/types"

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

async function mapCode(
  nodeInfo: NodeInfo<CodeNode>,
  config: CodeHikeConfig
): Promise<EditorStep> {
  const file = await mapFile(nodeInfo, config)
  const props: EditorStep = {
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
): Promise<EditorStep> {
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

  const {
    code,
    annotations: commentAnnotations,
    focus: commentFocus,
  } = await splitCodeAndAnnotations(
    node.value as string,
    lang,
    config
  )

  let highlightedCode = await highlight({
    code,
    lang,
    theme,
  })

  const options = parseMetastring(
    typeof node.meta === "string" ? node.meta : ""
  )
  const metaAnnotations = getAnnotationsFromMetastring(
    options as any
  )

  return {
    ...options,
    code: highlightedCode,
    focus: mergeFocus(options.focus, commentFocus),
    name: options.name || "",
    annotations: [
      ...metaAnnotations,
      ...commentAnnotations,
    ],
  }
}

function mergeFocus(fs1: string, fs2: string) {
  if (!fs1) return fs2 || ""
  if (!fs2) return fs1 || ""
  return `${fs1},${fs2}`
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
