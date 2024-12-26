import {
  AnnotationHandler,
  InnerLine,
  Pre,
  RawCode,
  highlight,
} from "codehike/code"
import Content from "./content.mdx"
import "./styles.css"

import React from "react"

export default function Page() {
  return <Content components={{ HoverContainer, a: Link, Code }} />
}

function HoverContainer(props: { children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900/80 px-2 rounded hover-container text-white">
      {props.children}
    </div>
  )
}

function Link(props: { href?: string; children?: React.ReactNode }) {
  if (props.href?.startsWith("hover:")) {
    const hover = props.href.slice("hover:".length)
    return (
      <span
        className="underline decoration-dotted underline-offset-4"
        data-hover={hover}
      >
        {props.children}
      </span>
    )
  } else {
    return <a {...props} />
  }
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")
  return <Pre code={highlighted} handlers={[hover]} />
}

const hover: AnnotationHandler = {
  name: "hover",
  onlyIfAnnotated: true,
  Line: ({ annotation, ...props }) => (
    <InnerLine
      merge={props}
      className="transition-opacity"
      data-line={annotation?.query || ""}
    />
  ),
}
