import visit from "unist-util-visit"
import { Node, Parent } from "unist"
import { highlight } from "@code-hike/highlighter"
import { extractLinks } from "./links"
import { visitAsync, toJSX } from "./unist-utils"
import React from "react"
import {
  EditorSpring,
  EditorProps,
} from "@code-hike/mini-editor"
import {
  Code,
  mapEditor,
  isEditorNode,
  mapAnyCodeNode,
} from "./code"

const SectionContext = React.createContext<{
  props: EditorProps
  selectedId?: string
  setFocus: (x: {
    fileName?: string
    focus: string
    id: string
  }) => void
  resetFocus: () => void
}>({
  props: null!,
  setFocus: () => {},
  resetFocus: () => {},
})

export function Section({
  children,
  ...props
}: {
  children: React.ReactNode
}) {
  const [state, setState] = React.useState<any>(props)

  const resetFocus = () => setState(props)

  const setFocus = ({
    fileName,
    focus,
    id,
  }: {
    fileName?: string
    focus: string
    id: string
  }) => {
    const name = fileName || state.northPanel.active

    const newFiles = state.files.map((file: any) =>
      file.name === name ? { ...file, focus } : file
    )

    let northPanel = { ...state.northPanel }
    let southPanel = state.southPanel && {
      ...state.northPanel,
    }
    if (state.northPanel.tabs.includes(name)) {
      northPanel.active = name
    } else if (southPanel) {
      southPanel.active = name
    }

    setState({
      ...state,
      files: newFiles,
      northPanel,
      southPanel,
      selectedId: id,
    })
  }

  const { selectedId, ...rest } = state

  return (
    <SectionContext.Provider
      value={{
        props: rest,
        setFocus,
        resetFocus,
        selectedId,
      }}
    >
      <section>{children}</section>
    </SectionContext.Provider>
  )
}

export function SectionCode() {
  const { props } = React.useContext(SectionContext)
  return <Code {...props} />
}

export function SectionLink({
  focus,
  file,
  children,
  id,
}: {
  focus: string
  id: string
  file?: string
  children: React.ReactNode
}) {
  const {
    setFocus,
    resetFocus,
    selectedId,
  } = React.useContext(SectionContext)

  const isSelected = selectedId === id
  const handleClick = isSelected
    ? resetFocus
    : () => setFocus({ fileName: file, focus, id })

  return (
    <span
      style={{
        textDecoration: "underline",
        textDecorationStyle: "dotted",
        cursor: "pointer",
        backgroundColor: isSelected ? "yellow" : undefined,
      }}
      onClick={handleClick}
      children={children}
    />
  )
}

export async function transformSections(
  tree: Node,
  config: { theme: any }
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async sectionNode => {
      if (sectionNode.name === "CH.Section") {
        await transformSection(sectionNode, config)
      }
    }
  )
}

async function transformSection(
  node: Node,
  config: { theme: any }
) {
  let props
  await visitAsync(
    node,
    ["mdxJsxFlowElement", "code"],
    async (node, index, parent) => {
      if (isEditorNode(node)) {
        props = await mapAnyCodeNode(
          { node, index, parent: parent! },
          config
        )
        toJSX(node, { name: "CH.SectionCode", props: {} })
      }
    }
  )

  transformLinks(node)

  if (props) {
    toJSX(node, { name: "CH.Section", props: props as any })
  } else {
    toJSX(node, { name: "div", props: {} })
  }
}

function transformLinks(tree: Node) {
  visit(tree, "link", (linkNode: any) => {
    const url = decodeURI(linkNode["url"])
    if (url.startsWith("focus://")) {
      const [firstPart, secondPart] = decodeURI(url)
        .substr("focus://".length)
        .split("#")
      const hasFile = Boolean(secondPart)
      const props = hasFile
        ? { file: firstPart, focus: secondPart, id: url }
        : { focus: firstPart, id: url }
      toJSX(linkNode, {
        type: "mdxJsxTextElement",
        name: "CH.SectionLink",
        props,
      })
    }
  })
}
