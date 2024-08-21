import { docs } from "@/app/source"
import { Block, parseRoot } from "codehike/blocks"
import { Demo } from "@/components/demo"
import { CodeWithNotes } from "@/components/code/code-with-notes"
import Link from "next/link"

export function AllCodeDemos() {
  const p = docs.getPages()
  const codePages = p.filter((page) => page.slugs[0] === "code")
  const demoPages = codePages.filter(
    (page) => page.data.layout === "PreviewAndImplementation",
  )

  return demoPages.map((page) => {
    const { title, exports } = page.data
    const { default: MDX } = exports
    const { demo } = parseRoot(MDX, Block.extend({ demo: Block }), {
      components: { Demo, CodeWithNotes },
    })
    const href = `/docs/${page.slugs.join("/")}`

    return (
      <div key={title}>
        <h2>{title}</h2>
        {demo.children}
        <p>
          See <Link href={href}>{title} implementation</Link>.
        </p>
      </div>
    )
  })
}
