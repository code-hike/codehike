import { RawCode, Pre, highlight, AnnotationHandler } from "codehike/code"
import Content from "./content.md"

export default function Page() {
  return <Content components={{ Code }} />
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")
  return (
    <Pre code={highlighted} handlers={[link]} className="m-0 bg-zinc-950/80" />
  )
}

const link: AnnotationHandler = {
  name: "link",
  Inline: ({ annotation, children }) => {
    const { query } = annotation
    return <a href={query}>{children}</a>
  },
}
