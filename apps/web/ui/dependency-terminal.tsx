import { CopyButton } from "@/components/copy-button"
import { TerminalSquare } from "lucide-react"
import { TabsContent, TabsList, TabsToggle } from "./tabs-toggle"
import { RawCode, Pre, highlight } from "codehike/code"

async function Code({ codeblock }: { codeblock: RawCode }) {
  const info = await highlight(codeblock, "github-dark")
  return <Pre code={info} className="max-h-96 m-0" />
}

export function DependencyTerminal({ codeblock }: { codeblock: RawCode }) {
  const options = ["npm install", "yarn add", "pnpm install"].map(
    (command) => ({
      name: command.split(" ")[0],
      content: (
        <Code
          codeblock={{
            ...codeblock,
            lang: "bash",
            value: `${command} ${codeblock.value}`,
          }}
        />
      ),
    }),
  )

  return (
    <TabsToggle
      className="border border-zinc-300/20 rounded mb-8 bg-zinc-900 overflow-hidden"
      options={options}
    >
      <div className="items-center bg-zinc-800 p-2 pl-4 text-xs flex text-zinc-100">
        <TerminalSquare size={20} className="-m-2 mr-2 text-zinc-100/60" />
        <span>Terminal</span>

        <TabsList />
        <CopyButton text={codeblock.value} />
      </div>

      <TabsContent />
    </TabsToggle>
  )
}
