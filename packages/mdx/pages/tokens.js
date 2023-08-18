import { FlipCode } from "../src/flip-tokens"
import { tokenize, tokenizeSync } from "../src/differ"
import {
  THEME_NAMES,
  LANG_NAMES,
  getThemeColorsSync,
  preload,
} from "@code-hike/lighter"
import React from "react"

export default function Page() {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    preload(["scala", "python"], "github-dark").then(() => {
      setReady(true)
    })
  }, [])

  if (!ready) {
    return (
      <main
        style={{
          height: "100vh",
          background: "rgb(13, 17, 23)",
          padding: "1rem",
          boxSizing: "border-box",
          transition: "background 0.5s",
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
  const [fromLang, setFromLang] = React.useState("scala")
  const [fromLangLoaded, setFromLangLoaded] =
    React.useState("scala")
  const [toLang, setToLang] = React.useState("python")
  const [toLangLoaded, setToLangLoaded] =
    React.useState("python")
  const [right, setRight] = React.useState(false)

  const themeColors = getThemeColorsSync(theme)
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
        minHeight: "100vh",
        background: themeColors.background,
        color: themeColors.foreground,
        padding: "1rem",
        boxSizing: "border-box",
        transition: "background 0.5s",
      }}
    >
      <style>
        {`
        pre::selection, pre ::selection {
          background: ${themeColors.editor.selectionBackground};
        }
        `}
      </style>
      <select
        style={{
          width: 200,
          margin: "1rem auto",
          display: "block",
        }}
        value={theme}
        onChange={e => {
          const name = e.target.value
          preload([], name).then(() => {
            setTheme(name)
          })
        }}
      >
        {THEME_NAMES.filter(n => !n.endsWith("css")).map(
          name => (
            <option key={name} value={name}>
              {name}
            </option>
          )
        )}
      </select>
      <div
        style={{
          display: "flex",
          width: 900,
          margin: "1rem auto",
          gap: "1rem",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <input
            value={fromLang}
            onChange={e => {
              const name = e.target.value
              setFromLang(name)
              if (LANG_NAMES.includes(name)) {
                preload([name]).then(() => {
                  setFromLangLoaded(name)
                })
              }
            }}
            style={{
              color: LANG_NAMES.includes(fromLang)
                ? "black"
                : "red",
            }}
          />
          <textarea
            rows={10}
            value={fromText}
            onChange={e => setFromText(e.target.value)}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <input
            value={toLang}
            onChange={e => {
              const name = e.target.value
              setToLang(name)
              if (LANG_NAMES.includes(name)) {
                preload([name]).then(() => {
                  setToLangLoaded(name)
                })
              }
            }}
            style={{
              color: LANG_NAMES.includes(toLang)
                ? "black"
                : "red",
            }}
          />
          <textarea
            rows={10}
            value={toText}
            onChange={e => setToText(e.target.value)}
          />
        </div>
      </div>

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
      <FlipCode tokens={tokens} />
    </main>
  )
}

// prettier-ignore
const code = [`
object Main {
  def factorial(n: Int): Int = {
    if (n == 0) {
      return 1
    } else {
      return n * factorial(n - 1)
    }
  }
}
`.trim(),`
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)
`.trim()
]
