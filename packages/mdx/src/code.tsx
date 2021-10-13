import visit from "unist-util-visit"
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
  EditorStep,
  CodeFile,
} from "@code-hike/mini-editor"

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
        config={props.codeConfig}
        step={props.files[0]}
      />
    )
  } else {
    return <EditorSpring {...props} />
  }
}

// remark:

async function transformCode(
  nodeInfo: NodeInfo,
  config: { theme: any }
) {
  const file = await mapFile(nodeInfo, config)
  const props = {
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
  toJSX(nodeInfo.node, {
    name: "CH.Code",
    props,
  })
}
export async function transformEditor(
  nodeInfo: NodeInfo,
  config: { theme: any }
) {
  const props = await mapEditor(nodeInfo, config)

  toJSX(nodeInfo.node, {
    name: "CH.Code",
    props,
  })
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
    ? (northLines + 3.33) / (southLines + northLines + 6.66)
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
): Promise<CodeStep & FileOptions> {
  const { theme } = config

  const annotations = extractLinks(
    node,
    index,
    parent,
    node.value as string
  )

  const code = await highlight({
    code: node.value as string,
    lang: node.lang as string,
    theme,
  })

  const options = parseMetastring(
    typeof node.meta === "string" ? node.meta : ""
  )

  const file = {
    ...options,
    focus: options.focus || "",
    code,
    annotations,
  }

  return file
}

type FileOptions = {
  name: string | null
  focus?: string
  active?: string
  hidden?: boolean
}

function parseMetastring(metastring: string): FileOptions {
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
