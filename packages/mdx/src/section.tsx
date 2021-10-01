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

const SectionContext = React.createContext<{
  props: EditorProps
  setFocus: (x: { file: string; focus: string }) => void
}>(null!)

export function Section({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section style={{ outline: "1px solid violet" }}>
      <div>{children}</div>
    </section>
  )
}

// function RealSection({}) {
//   return (
//     <SectionContext.Provider value={{ setFocus }}>
//       {children}
//     </SectionContext.Provider>
//   )
// }

function CodePlaceholder() {
  const { props } = React.useContext(SectionContext)
  return <EditorSpring {...props} />
}

export function transformSections(
  tree: Node,
  config: { theme: any }
) {
  visit(tree, "mdxJsxFlowElement", sectionNode => {
    if (sectionNode.name === "CH.Section")
      transformLinks(sectionNode)
  })
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
  return (
    <span
      style={{
        textDecoration: "underline",
        textDecorationStyle: "dotted",
      }}
      title={focus}
    >
      {children}
    </span>
  )
}
