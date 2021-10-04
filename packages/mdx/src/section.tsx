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
import { mapEditor } from "./code"
import { Code } from "./components"

const SectionContext = React.createContext<{
  props: EditorProps
  setFocus: (x: {
    fileName?: string
    focus: string
  }) => void
}>({ props: null!, setFocus: () => {} })

export function Section({
  children,
  ...props
}: {
  children: React.ReactNode
}) {
  const [state, setState] = React.useState<any>(props)

  const setFocus = ({
    fileName,
    focus,
  }: {
    fileName?: string
    focus: string
  }) => {
    const newFiles = state.files.map((file: any) =>
      !fileName || file.name === fileName
        ? { ...file, focus }
        : file
    )
    setState({
      ...state,
      files: newFiles,
    })
  }

  return (
    <SectionContext.Provider
      value={{ props: state as any, setFocus }}
    >
      <section style={{ outline: "1px solid violet" }}>
        <div>{children}</div>
      </section>
    </SectionContext.Provider>
  )
}

export function SectionCode() {
  const { props } = React.useContext(SectionContext)
  return <Code {...props} />
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
    "mdxJsxFlowElement",
    async (node, index, parent) => {
      if (node.name === "CH.Code") {
        props = await mapEditor(
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
      const focus = url.slice(8)
      toJSX(linkNode, {
        type: "mdxJsxTextElement",
        name: "CH.SectionLink",
        props: { focus },
      })
    }
  })
}
export function SectionLink({
  focus,
  children,
}: {
  focus: string
  children: React.ReactNode
}) {
  const { setFocus } = React.useContext(SectionContext)
  return (
    <span
      style={{
        textDecoration: "underline",
        textDecorationStyle: "dotted",
        cursor: "pointer",
      }}
      title={focus}
      onClick={() => setFocus({ focus })}
    >
      {children}
    </span>
  )
}
