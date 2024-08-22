import Demo from "@/demos/scrollycoding/page"
import Content from "./content.mdx"
import {
  AnnotationHandler,
  Pre,
  RawCode,
  InnerPre,
  highlight,
  InnerLine,
  InnerToken,
  BlockAnnotation,
  InlineAnnotation,
} from "codehike/code"
import { SmoothPre } from "./client"
import { collapse } from "@/components/annotations/collapse"
import theme from "../../theme.mjs"
import { cn } from "../../lib/utils"
import { lineNumbers } from "../../components/annotations/line-numbers"
// import { mark } from "../../components/annotations/mark"
import { wordWrap } from "../../components/annotations/word-wrap"
import { callout } from "../../components/annotations/callout"

export default function Page() {
  return (
    <main className="mx-8">
      <Content components={{ Code }} />{" "}
    </main>
  )
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, theme)

  const { meta } = codeblock

  return (
    <Pre
      code={highlighted}
      className="rounded-md shadow-sm m-4 py-2 bg-editor-background  selection:bg-editor-selectionBackground border border-zinc-500/40 max-w-full overflow-auto"
      handlers={
        [
          //
          mark,
          lineNumbers,
          diff,
          ...collapse,
          meta.includes("w") ? wordWrap : null,
          callout,
        ].filter(Boolean) as AnnotationHandler[]
      }
    />
  )
}

const diff: AnnotationHandler = {
  name: "diff",
  onlyIfAnnotated: true,
  transform: (annotation: BlockAnnotation) => {
    const color = annotation.query == "-" ? "#f85149" : "#3fb950"
    return [
      annotation,
      {
        ...annotation,
        name: "mark",
        query: color,
      },
    ]
  },
  Line: ({ annotation, ...props }) => {
    return (
      <>
        <div className="min-w-[1ch] box-content opacity-70 pl-2 select-none">
          {annotation?.query}
        </div>
        <InnerLine merge={props} />
      </>
    )
  },
}

const mark: AnnotationHandler = {
  name: "mark",
  Line: ({ annotation, ...props }) => {
    const color = annotation?.query || "rgb(14 165 233)"
    return (
      <div
        style={{
          borderLeft: "solid 2px transparent",
          borderLeftColor: annotation && color,
          backgroundColor: annotation && `rgb(from ${color} r g b / 0.2)`,
        }}
        className="flex"
      >
        <InnerLine merge={props} className="px-2 flex-1" />
      </div>
    )
  },
}

// const wordWrap: AnnotationHandler = {
//   name: "word-wrap",
//   Pre: (props) => <InnerPre merge={props} className="whitespace-pre-wrap" />,
//   Line: (props) => {
//     return (
//       <InnerLine merge={props}>
//         <div
//           style={{
//             textIndent: `${-props.indentation}ch`,
//             marginLeft: `${props.indentation}ch`,
//           }}
//         >
//           {props.children}
//         </div>
//       </InnerLine>
//     )
//   },
// }

// const callout: AnnotationHandler = {
//   name: "callout",
//   transform: (annotation: InlineAnnotation) => {
//     // transform inline annotation to block annotation
//     const { name, query, lineNumber, fromColumn, toColumn } = annotation
//     return {
//       name,
//       query,
//       fromLineNumber: lineNumber,
//       toLineNumber: lineNumber,
//       data: {
//         ...annotation.data,
//         column: (fromColumn + toColumn) / 2,
//       },
//     }
//   },
//   AnnotatedLine: ({ annotation, ...props }) => {
//     const { column } = annotation.data
//     const { indentation, children } = props
//     return (
//       <InnerLine merge={props}>
//         {children}
//         <div
//           style={{
//             minWidth: `${column + 4}ch`,
//             marginLeft: `${indentation}ch`,
//           }}
//           className="w-fit border bg-editorGroupHeader-tabsBackground border-editorGroup-border rounded px-0 relative my-1 whitespace-break-spaces prose-p:my-1 prose-p:mx-2 select-none"
//         >
//           <div
//             style={{ left: `${column - indentation - 1}ch` }}
//             className="absolute border-l border-t  border-editorGroup-border w-2 h-2 rotate-45 -translate-y-1/2 -top-[1px]  bg-editorGroupHeader-tabsBackground"
//           />
//           {annotation.data.children || (
//             <div className="px-2">{annotation.query}</div>
//           )}
//         </div>
//       </InnerLine>
//     )
//   },
// }
