import React from "react"
import { EditorTween } from "@code-hike/mini-editor"
import { WithProgress } from "./utils"
import "@code-hike/mini-editor/dist/index.css"
import theme from "shiki/themes/github-light.json"
import { highlight } from "@code-hike/highlighter"

export default {
  title: "Test/Editor Tween Two",
}

export const smartHeight = () => {
  const prev = {
    files: [
      {
        name: "app.js",
        code: `
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null && 0
  dolor = sit - amet(dolor)
  return sit ? consectetur(ipsum) : []
}

function adipiscing(...elit) {
  console.log(elit)
  return elit.map(ipsum => ipsum.sit)
}`.trim(),
        lang: "js",
        focus: "6:10",
        annotations: [],
      },
    ],
    northPanel: {
      tabs: ["app.js"],
      active: "app.js",
      heightRatio: 1,
    },
    southPanel: undefined,
  }
  const next = {
    files: [
      {
        name: "app.js",
        code: `
function adipiscing(...elit) {
  console.log(elit)
  return elit.map(ipsum => ipsum.sit)
}`.trim(),
        lang: "js",
        focus: "1:4",
        annotations: [],
      },
      {
        name: "styles.css",
        code: `
.lorem {
  color: #fff;
  padding: 10px;
  background: #000;
}`.trim(),
        lang: "css",
        focus: "",
        annotations: [],
      },
    ],
    northPanel: {
      tabs: ["app.js"],
      active: "app.js",
      heightRatio: 1,
    },
    southPanel: {
      tabs: ["styles.css"],
      active: "styles.css",
      heightRatio: 1,
    },
  }
  return <TestTransition prev={prev} next={next} />
}

function TestTransition({ prev, next }) {
  const [data, setData] = React.useState(null)
  React.useEffect(() => {
    const prevFilePromises = prev.files.map(
      ({ code, lang, ...rest }) =>
        highlight({ code, lang, theme }).then(code => ({
          code,
          ...rest,
        }))
    )
    const nextFilePromises = next.files.map(
      ({ code, lang, ...rest }) =>
        highlight({ code, lang, theme }).then(code => ({
          code,
          ...rest,
        }))
    )

    Promise.all([
      Promise.all(prevFilePromises),
      Promise.all(nextFilePromises),
    ]).then(([prevFiles, nextFiles]) =>
      setData({
        prev: { ...prev, files: prevFiles },
        next: { ...next, files: nextFiles },
      })
    )
  }, [])

  if (!data) {
    return "Loading..."
  }

  return (
    <WithProgress length={2}>
      {(progress, backward) => (
        <>
          <EditorTween
            frameProps={{ style: { height: 300 } }}
            prev={data.prev}
            next={data.next}
            t={progress}
            backward={backward}
            codeConfig={{ theme }}
          />
        </>
      )}
    </WithProgress>
  )
}
