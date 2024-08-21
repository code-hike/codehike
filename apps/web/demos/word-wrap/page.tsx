import {
  RawCode,
  Pre,
  highlight,
  AnnotationHandler,
  InnerLine,
  InnerPre,
  InnerToken,
} from "codehike/code"
import Content from "./content.md"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function Page() {
  return <Content components={{ Code }} />
}

type CodeComponent = (props: { codeblock: RawCode }) => Promise<JSX.Element>

const Code: CodeComponent = async ({ codeblock }) => {
  const highlighted = await highlight(codeblock, "github-dark")

  return (
    <ResizablePanelGroup direction="horizontal" className="max-w-2xl">
      <ResizablePanel defaultSize={95} className="min-w-64 max-w-[48ch]">
        <Pre
          className="m-0 px-0 bg-zinc-950/80 w-full"
          code={highlighted}
          handlers={[wordWrap, lineNumbers]}
        />
      </ResizablePanel>
      <ResizableHandle
        withHandle
        className="bg-transparent dark:bg-transparent"
      />
      <ResizablePanel defaultSize={5} />
    </ResizablePanelGroup>
  )
}

export const wordWrap: AnnotationHandler = {
  name: "word-wrap",
  Pre: (props) => <InnerPre merge={props} className="whitespace-pre-wrap" />,
  Line: (props) => (
    <InnerLine merge={props}>
      <div
        style={{
          textIndent: `${-props.indentation}ch`,
          marginLeft: `${props.indentation}ch`,
        }}
      >
        {props.children}
      </div>
    </InnerLine>
  ),
  Token: (props) => <InnerToken merge={props} style={{ textIndent: 0 }} />,
}

const lineNumbers: AnnotationHandler = {
  name: "line-numbers",
  Line: (props) => {
    const width = props.totalLines.toString().length + 1
    return (
      <div className="flex">
        <span
          className="text-right opacity-50 select-none"
          style={{ minWidth: `${width}ch` }}
        >
          {props.lineNumber}
        </span>
        <InnerLine merge={props} className="flex-1 pl-3" />
      </div>
    )
  },
}
