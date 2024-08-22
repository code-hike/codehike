import Link from "next/link"
import { cn } from "@/lib/utils"

export function Boxes({ className }: { className?: string }) {
  return (
    <div
      className={cn("grid grid-cols-1 md:grid-cols-2 gap-3 px-2", className)}
    >
      <Box
        className="col-span-1 md:col-span-2 flex flex-col justify-evenly items-center"
        href="/blog/fine-grained-markdown"
      >
        <h2 className="text-2xl font-bold px-4 text-center">
          Fine-grained Markdown
        </h2>
        <p className="px-4 md:px-12">
          Add structure to your content, making it more flexible, more reusable,
          and easier to <strong>adapt to different layouts</strong>.
          <br />
          <br />
          Define the structure of your markdown with content schemas for better
          typescript tooling support and <strong>type-safe markdown</strong>.
        </p>
      </Box>

      <Box
        className="flex flex-col justify-evenly items-center"
        href="/docs/concepts/annotations"
      >
        <h2
          className="text-2xl font-bold px-4 text-center"
          style={{ textWrap: "pretty" }}
        >
          Headless Codeblocks
        </h2>
        <p className="px-4 md:px-12">
          Add style and behavior to codeblocks with comments handled by your own
          React components.
        </p>
      </Box>
      <Box
        className="flex flex-col justify-evenly items-center "
        href="/docs/code"
      >
        <h2 className="text-2xl font-bold px-4 text-center">
          Copy, Paste, <br />
          Make it yours
        </h2>
        <p className="px-4 md:px-12">
          Code Hike ships without UI components. But you'll find many examples
          in the docs that you can adapt to your needs.
        </p>
      </Box>
    </div>
  )
}

function Box({
  children,
  className,
  href,
}: {
  children: React.ReactNode
  className?: string
  href: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-700/50 h-64 w-full  rounded-xl hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors",
        className,
      )}
    >
      {children}
    </Link>
  )
}
