import React from "react"
import { Page } from "./utils"
import "@code-hike/mini-editor/dist/index.css"
import darkplus from "shiki/themes/dark-plus.json"
import githubdark from "shiki/themes/github-dark.json"
import githublight from "shiki/themes/github-light.json"
import lightplus from "shiki/themes/light-plus.json"
import materialdarker from "shiki/themes/material-darker.json"
import materialdefault from "shiki/themes/material-default.json"
import materiallighter from "shiki/themes/material-lighter.json"
import materialocean from "shiki/themes/material-ocean.json"
import materialpalenight from "shiki/themes/material-palenight.json"
import mindark from "shiki/themes/min-dark.json"
import minlight from "shiki/themes/min-light.json"
import monokai from "shiki/themes/monokai.json"
import nord from "shiki/themes/nord.json"
import poimandres from "shiki/themes/poimandres.json"
import slackdark from "shiki/themes/slack-dark.json"
import slackochin from "shiki/themes/slack-ochin.json"
import solarizeddark from "shiki/themes/solarized-dark.json"
import solarizedlight from "shiki/themes/solarized-light.json"
import { EditorSpring } from "@code-hike/mini-editor"
import { highlight } from "@code-hike/highlighter"

const allThemes = {
  darkplus,
  githubdark,
  githublight,
  lightplus,
  materialdarker,
  materialdefault,
  materiallighter,
  materialocean,
  materialpalenight,
  mindark,
  minlight,
  monokai,
  nord,
  poimandres,
  slackdark,
  slackochin,
  solarizeddark,
  solarizedlight,
}

export default {
  title: "Test/Themes",
}

const code = `console.log(1)
console.log(2)
console.log(3)
console.log(4)
console.log(5)`

export const themes = () => {
  const [themeName, setTheme] = React.useState(
    "materialdarker"
  )

  const theme = allThemes[themeName]

  const [props, setProps] = React.useState(null)

  React.useEffect(() => {
    const files = [
      { name: "foo.js", lang: "js", code },
      { name: "index.js", lang: "js", code },
      { name: "bar.js", lang: "js", code },
      {
        name: "app.js",
        lang: "js",
        code,
        annotations: [{ focus: "2:3" }],
      },
    ]

    Promise.all(
      files.map(file =>
        highlight({
          code: file.code,
          lang: file.lang,
          theme,
        })
      )
    ).then((codes, i) => {
      setProps({
        files: files.map((file, i) => ({
          ...file,
          code: codes[i],
        })),
        northPanel: {
          active: "app.js",
          tabs: ["foo.js", "app.js"],
        },
        southPanel: {
          active: "index.js",
          tabs: ["bar.js", "index.js"],
        },
      })
    })
  }, [theme])

  return (
    <Page>
      <label style={{ textAlign: "center", margin: 18 }}>
        Theme:{" "}
        <select
          value={themeName}
          onChange={e => {
            setTheme(e.currentTarget.value)
            setProps(null)
          }}
        >
          {Object.keys(allThemes).map(themeName => (
            <option key={themeName} value={themeName}>
              {themeName}
            </option>
          ))}
        </select>
      </label>
      {props ? (
        <EditorSpring
          {...props}
          frameProps={{ height: 500 }}
          codeConfig={{
            maxZoom: 1.2,
            minColumns: 10,
            theme,
          }}
        />
      ) : (
        <div>Loading...</div>
      )}
    </Page>
  )
}
