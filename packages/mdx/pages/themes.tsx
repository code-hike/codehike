import { BUNDLED_THEMES } from "shiki"
import { getCode, getFiles } from "../dev/files"
import * as runtime from "react/jsx-runtime.js"
import { runSync } from "@mdx-js/mdx"
import { CH } from "../src/components"
import { Layout } from "../dev/layout"

const mdx = `

<CH.Code>

~~~json package.json
{
  "name": "package.json"
}
~~~

~~~js pages/index.js
function IndexPage() {
  return 1
}
~~~

~~~js pages/post/[slug].js
function PostPage() {
  return 1
}
~~~

---

~~~js pages/alpha.ts
function AlphaPage() {
  return 1
}
~~~

~~~css src/styles.css
.alpha {
  color: red;
}
~~~

~~~js src/comp.js
function AlphaPage() {
  return <div className="alpha">1</div>
}
~~~

</CH.Code>

~~~py
def foo(x = 1):
  return "bar"
~~~
`

export async function getStaticProps() {
  const files = await getFiles()
  const promises = BUNDLED_THEMES.filter(
    x => x !== "css-variables"
  ).map(async themeName => {
    const theme = (
      await import(`shiki/themes/${themeName}.json`)
    ).default
    const { code } = await getCode(mdx, {
      theme,
      lineNumbers: true,
      showCopyButton: true,
    })
    return { themeName, code }
  })

  const codes = await Promise.all(promises)

  return {
    props: {
      tests: files,
      codes,
    },
  }
}

export default function Page({ codes, tests }) {
  const components = codes.map(({ code }) => {
    return runSync(code, runtime).default
  })
  return (
    <Layout
      current={"themes"}
      contentFileNames={tests}
      style={{ width: "100%", maxWidth: undefined }}
    >
      <div
        style={{
          background: "white",
          margin: 8,
          display: "grid",
          columnGap: 8,
          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {components.map((Content, i) => (
          <div key={i}>
            <h3>{codes[i].themeName}</h3>
            <Content components={{ CH }} />
          </div>
        ))}
      </div>
    </Layout>
  )
}
