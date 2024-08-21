import { map } from "@/.map"
import { createMDXSource, defaultSchemas } from "next-docs-mdx"
import { loader } from "next-docs-zeta/source"
import { z } from "zod"

export const docs = loader({
  baseUrl: "/docs",
  rootDir: "docs",
  source: createMDXSource(map, {
    schema: {
      frontmatter: defaultSchemas.frontmatter.extend({
        layout: z.string().default("Docs"),
      }),
    },
  }),
})

export const blog = loader({
  baseUrl: "/blog",
  rootDir: "blog",
  source: createMDXSource(map, {
    schema: {
      frontmatter: defaultSchemas.frontmatter.extend({
        authors: z.array(z.string()).default([]),
        date: z.date().default(new Date()),
        draft: z.boolean().default(false),
        className: z.string().default(""),
      }),
    },
  }),
})
