import { highlight } from "../highlighter"
import { extractLinks } from "./links"
import {
  visitAsync,
  toJSX,
  NodeInfo,
  splitChildren,
  CH_CODE_CONFIG_PLACEHOLDER,
} from "./unist-utils"
import { CodeStep } from "../smooth-code"
import { EditorProps } from "../mini-editor"
import {
  getAnnotationsFromMetastring,
  extractAnnotationsFromCode,
  extractJSXAnnotations,
} from "./annotations"
import { mergeFocus } from "../utils"
import { CodeNode, SuperNode } from "./nodes"

export async function transformCodeNodes(
  tree: SuperNode,
  { theme }: { theme: any }
) {
  await visitAsync(
    tree,
    "code",
    async (node: CodeNode, index, parent) => {
      await transformCode(
        { node, index, parent: parent! },
        { theme }
      )
    }
  )
}

export function isEditorNode(node: SuperNode) {
  return (
    node.type === "code" ||
    (node.type === "mdxJsxFlowElement" &&
      node.name === "CH.Code")
  )
}

async function transformCode(
  nodeInfo: NodeInfo<CodeNode>,
  config: { theme: any }
) {
  toJSX(nodeInfo.node, {
    name: "CH.Code",
    props: await mapCode(nodeInfo, config),
  })
}
export async function transformEditor(
  nodeInfo: NodeInfo,
  config: { theme: any }
) {
  toJSX(nodeInfo.node, {
    name: "CH.Code",
    props: await mapEditor(nodeInfo, config),
  })
}

export async function mapAnyCodeNode(
  nodeInfo: NodeInfo,
  config: { theme: any }
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
  config: { theme: any }
): Promise<EditorProps> {
  const file = await mapFile(nodeInfo, config)
  const props: EditorProps = {
    northPanel: {
      tabs: [file.name],
      active: file.name,
      heightRatio: 1,
    },
    files: [file],
    codeConfig: CH_CODE_CONFIG_PLACEHOLDER,
  }
  return props
}

export async function mapEditor(
  { node }: NodeInfo,
  config: { theme: any }
): Promise<EditorProps> {
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
    codeConfig: CH_CODE_CONFIG_PLACEHOLDER,
  }
  return props
}

async function mapFile(
  { node, index, parent }: NodeInfo<CodeNode>,
  config: { theme: any }
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
