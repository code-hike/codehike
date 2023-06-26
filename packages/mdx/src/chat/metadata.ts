export function setMetadata(
  content: string,
  metadata: Record<string, string>
) {
  const oldData = getMetadata(content)

  const metadataString = Object.entries({
    ...oldData,
    ...metadata,
  })
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n")

  const contentWithoutMetadata = removeMetadata(content)

  return `---\n${metadataString}\n---\n${contentWithoutMetadata}`
}

export function getMetadata(
  content: string
): Record<string, string> {
  if (!content) {
    return undefined
  }
  const metadata = content.match(/^---\n([\s\S]*?)\n---\n/)

  if (!metadata) {
    return {}
  }

  const metadataString = metadata[1]

  const metadataEntries = metadataString
    .split("\n")
    .map(s => s.split(": "))
    .filter(([key, value]) => key && value)

  return Object.fromEntries(metadataEntries)
}

export function removeMetadata(content: string) {
  return content.replace(/^---\n[\s\S]*?\n---\n/, "")
}
