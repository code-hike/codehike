import fetch from "node-fetch"

export async function getPresetConfig(
  attributes?: {
    name: string
    value: "string"
  }[]
) {
  // todo add cache
  const presetAttribute = attributes?.find(
    (attr: any) => attr.name === "preset"
  )
  if (!presetAttribute) return undefined
  const url = presetAttribute.value
  const prefix = "https://codesandbox.io/s/"
  const csbid = url.slice(prefix.length)
  const configUrl = `https://codesandbox.io/api/v1/sandboxes/${csbid}/sandpack`
  const res = await fetch(configUrl)
  return await res.json()
}
