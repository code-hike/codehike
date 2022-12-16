import { Code } from "../utils"
import { highlight as light } from "@code-hike/lighter"

const newlineRe = /\r\n|\r|\n/

export async function highlight({
  code,
  lang,
  theme,
}: {
  code: string
  lang: string
  theme: any // TODO type this
}): Promise<Code> {
  if (lang === "text") {
    const lines = code ? code.split(newlineRe) : [""]
    return {
      lines: lines.map(line => ({
        tokens: [{ content: line, props: {} }],
      })),
      lang,
    }
  }

  const r = await light(code, lang, theme)

  const lines = r.lines.map(line => ({
    tokens: line.map(token => ({
      content: token.content,
      props: { style: token.style },
    })),
  }))

  return { lines, lang }
}
