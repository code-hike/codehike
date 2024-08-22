import fs from "fs"
import path from "path"
import { Tab, Tabs } from "next-docs-ui/components/tabs"
import { Code } from "./code"

export async function LayoutDemo({
  name,
  children,
  content = "content.md",
}: {
  name: string
  content?: string
  children: React.ReactNode
}) {
  const value = await fs.promises.readFile(
    path.join(process.cwd(), "demos", name, content),
    "utf-8",
  )

  const { default: Page } = await import(`@/demos/${name}/page`)

  return (
    <Tabs items={["Preview", "MDX", "Implementation"]}>
      <Tab
        value="Preview"
        className=" mt-0 p-6 bg-blue-900/80 bg-[url(/dark-grid.svg)] prose-invert"
      >
        <div className={`border border-primary/50 bg-zinc-950 rounded`}>
          <Page />
        </div>
      </Tab>
      <Tab value="MDX">
        <Code
          codeblock={{
            value,
            lang: "mdx",
            meta: "content.md -pcw",
          }}
        />
      </Tab>
      <Tab value="Implementation">{children}</Tab>
    </Tabs>
  )
}
