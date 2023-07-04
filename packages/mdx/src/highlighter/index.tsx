import { Code } from "../utils"
import { highlight as light } from "@code-hike/lighter"

const newlineRe = /\r\n|\r|\n/

const warnings = new Set()

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

  try {
    const r = await light(code, lang as any, theme)

    const lines = r.lines.map(line => ({
      tokens: line.map(token => ({
        content: token.content,
        props: { style: token.style },
      })),
    }))

    return { lines, lang }
  } catch (e) {
    // TODO check error is "missing grammar"
    if (!warnings.has(lang)) {
      console.warn(
        "[Code Hike warning]",
        `${lang} is not a valid language, no syntax highlighting will be applied.`
      )
      warnings.add(lang)
    }
    // potential endless loop
    return highlight({ code, lang: "text", theme })
  }
}
