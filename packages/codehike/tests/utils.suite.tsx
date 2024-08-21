import fs from "node:fs/promises"
import { expect } from "vitest"

expect.addSnapshotSerializer({
  serialize(val, config, indentation, depth, refs, printer) {
    const r = printer(
      val.block,
      { ...config, escapeString: true },
      indentation,
      depth,
      refs,
    )
    if (depth > 0) return r

    return `var block = ${r}`
  },
  test(val) {
    return val && Object.prototype.hasOwnProperty.call(val, "block")
  },
})
expect.addSnapshotSerializer({
  test(val) {
    return typeof val === "string"
  },
  serialize(val) {
    return JSON.stringify(val)
  },
})

export async function getTestNames(dataPath: string) {
  const allNames = await fs.readdir(dataPath)
  const mdNames = allNames.filter((f) => f.endsWith(".0.mdx"))
  return mdNames.map((f) => f.replace(".0.mdx", ""))
}

interface SerializableError extends Error {
  [key: string]: any
}

export function errorToMd(error: SerializableError): string {
  let markdown = `# Error: ${error.name}\n\n`
  markdown += `${error.message}\n\n`

  if (error.stack) {
    markdown += `\`\`\`\n${error.stack}\n\`\`\`\n\n`
  }

  // Include additional properties
  const additionalProperties = Object.getOwnPropertyNames(error).filter(
    (prop) => !["name", "message", "stack"].includes(prop),
  )
  if (additionalProperties.length > 0) {
    markdown += `## Additional Properties\n`
    additionalProperties.forEach((prop) => {
      markdown += `- **${prop}:** ${error[prop]}\n`
    })
  }

  return markdown
}
