import { Block, ImageBlock, parseProps } from "codehike/blocks"
import { z } from "zod"

export function Examples(props: unknown) {
  const { blocks, title, children } = parseProps(
    props,
    Block.extend({
      blocks: z.array(
        Block.extend({
          repo: ImageBlock,
          img: ImageBlock,
        }),
      ),
    }),
  )
  return (
    <section className="">
      <h2 className="">{title}</h2>
      <div className="">{children}</div>
      <div className="flex flex-wrap gap-4">
        {blocks.map((example) => (
          <a
            className="min-w-80 w-80 border border-secondary rounded bg-secondary/50 overflow-hidden cursor-pointer hover:border-primary/50 hover:opacity-100 transition-colors no-underline"
            key={example.title}
            href={example.repo.url}
            target="_blank"
            rel="noopener"
          >
            <img src={example.img.url} alt={example.title} className="m-0" />
            <h3 className="m-3 text-lg">{example.title}</h3>
          </a>
        ))}
      </div>
    </section>
  )
}
