import {
  SelectionProvider,
  Selectable,
  Selection,
} from "codehike/utils/selection"

import { THEME_NAMES, LANG_NAMES } from "@code-hike/lighter"
import { Pre, highlight } from "codehike/code"
import React from "react"

const themes = THEME_NAMES.filter((name) => !name.includes("from-css"))

export async function ThemePicker() {
  return (
    <SelectionProvider className="">
      <div className="flex flex-wrap text-sm">
        {themes.map((name, index) => (
          <Selectable
            key={index}
            index={index}
            selectOn={["click"]}
            className="cursor-pointer text-accent-foreground/70 hover:bg-secondary p-2 rounded-md data-[selected=true]:text-primary"
          >
            {name}
          </Selectable>
        ))}
      </div>
      <Selection
        from={themes.map((name) => (
          <div>
            <Code theme={name} />
          </div>
        ))}
      />
    </SelectionProvider>
  )
}

async function Code({ theme }: { theme: string }) {
  const code = `import { Pre, RawCode, highlight } from "codehike/code"
  
async function Code({codeblock}: {codeblock: RawCode}) {
  const highlighted = await highlight(codeblock, "${theme}")
  return <Pre code={highlighted} style={highlighted.style} />
}`
  const rawCode = {
    value: code,
    lang: "tsx",
    meta: "",
  }
  const highlighted = await highlight(rawCode, theme as any)
  return <Pre code={highlighted} style={highlighted.style} />
}

export function LangList() {
  return (
    <div className="">
      Code Hike handles syntax highlighting for{" "}
      <strong>{LANG_NAMES.length} languages</strong>:{" "}
      {LANG_NAMES.map((name, index) => (
        <React.Fragment key={index}>
          <span className="font-mono bg-accent-foreground/10 rounded px-1 py-0.5">
            {name}
          </span>
          {index < LANG_NAMES.length - 2
            ? ", "
            : index === LANG_NAMES.length - 2
              ? ", and "
              : "."}
        </React.Fragment>
      ))}
    </div>
  )
}
