import { Code } from "../src/smooth-tokens"
import { tokenizeSync } from "../src/differ"
import {
  getThemeColorsSync,
  preload,
} from "@code-hike/lighter"
import React from "react"

export default function Page() {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    preload(["jsx"], "github-dark").then(() => {
      setReady(true)
    })
  }, [])

  if (!ready) {
    return (
      <main
        style={{
          height: 300,
          background: "rgb(13, 17, 23)",
          padding: "1rem",
          boxSizing: "border-box",
        }}
      />
    )
  }

  return <Main />
}

function Main() {
  const [theme, setTheme] = React.useState("github-dark")
  const [fromText, setFromText] = React.useState(code[0])
  const [toText, setToText] = React.useState(code[1])
  const [fromLangLoaded, setFromLangLoaded] =
    React.useState("jsx")
  const [toLangLoaded, setToLangLoaded] =
    React.useState("jsx")
  const [right, setRight] = React.useState(false)

  const tokens = React.useMemo(() => {
    return right
      ? tokenizeSync(toText, toLangLoaded, theme)
      : tokenizeSync(fromText, fromLangLoaded, theme)
  }, [
    right,
    toText,
    toLangLoaded,
    fromText,
    fromLangLoaded,
    theme,
  ])

  return (
    <main
      style={{
        height: 300,
        background: "rgb(13, 17, 23)",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <button
        style={{
          width: 200,
          margin: "1rem auto",
          display: "block",
        }}
        onClick={() => setRight(!right)}
      >
        Play
      </button>
      <Code tokens={tokens} />
    </main>
  )
}

// prettier-ignore
const code = [`
foo 
foo 
foo 
foo bar
`.trim(),`
foo 
foo 
foo 
foo 
    bar
`.trim()
]
