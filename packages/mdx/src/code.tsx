import { Node, Parent } from "unist"
import { highlight } from "@code-hike/highlighter"
import { extractLinks } from "./links"
import {
  visitAsync,
  toJSX,
  NodeInfo,
  splitChildren,
} from "./unist-utils"
import React from "react"
import {
  CodeSpring,
  CodeStep,
} from "@code-hike/smooth-code"
import {
  EditorSpring,
  EditorProps,
} from "@code-hike/mini-editor"
import {
  getAnnotationsFromMetastring,
  extractAnnotationsFromCode,
  extractJSXAnnotations,
} from "./annotations"
import { mergeFocus } from "@code-hike/utils"

export async function transformCodeNodes(
  tree: Node,
  { theme }: { theme: any }
) {
  await visitAsync(
    tree,
    "code",
    async (node, index, parent) => {
      await transformCode(
        { node, index, parent: parent! },
        { theme }
      )
    }
  )
}

export function Code(props: EditorProps) {
  if (
    !props.southPanel &&
    props.files.length === 1 &&
    !props.files[0].name
  ) {
    return (
      <CodeSpring
        className="ch-code"
        config={props.codeConfig}
        step={props.files[0]}
      />
    )
  } else {
    return <EditorSpring {...props} />
  }
}

// remark:

export function isEditorNode(node: Node) {
  return (
    node.type === "code" ||
    (node.type === "mdxJsxFlowElement" &&
      node.name === "CH.Code")
  )
}

async function transformCode(
  nodeInfo: NodeInfo,
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
    return mapCode(nodeInfo, config)
  } else {
    return mapEditor(nodeInfo, config)
  }
}

async function mapCode(
  nodeInfo: NodeInfo,
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
    codeConfig: {
      theme: config.theme,
    },
  }
  return props
}

export async function mapEditor(
  { node }: NodeInfo,
  config: { theme: any }
): Promise<EditorProps> {
  const [northNodes, southNodes = []] = splitChildren(
    node as Parent,
    "thematicBreak"
  )

  const northFiles = await Promise.all(
    northNodes
      .filter(({ node }) => node.type === "code")
      .map(nodeInfo => mapFile(nodeInfo, config))
  )
  const southFiles = await Promise.all(
    southNodes
      .filter(({ node }) => node.type === "code")
      .map(nodeInfo => mapFile(nodeInfo, config))
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
    codeConfig: {
      theme: config.theme,
    },
  }
  return props
}

async function mapFile(
  { node, index, parent }: NodeInfo,
  config: { theme: any }
): Promise<CodeStep & FileOptions & { name: string }> {
  const { theme } = config

  const code = await highlight({
    code: node.value as string,
    lang: node.lang as string,
    theme,
  })

  const [
    commentAnnotations,
    commentFocus,
  ] = extractAnnotationsFromCode(code)

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
