import { bundleMDX } from "mdx-bundler"
import { getMDXComponent } from "mdx-bundler/client"
import React from "react"
import fs from "fs/promises"
import { remarkShowTree } from "../../src/plugin"
import dynamic from "next/dynamic"
import { remarkCodeHike } from "@code-hike/mdx"
import { useRouter } from "next/router"
import Head from "next/head"

async function getDemoList() {
  const files = await fs.readdir("./content/")

  return files
    .filter(filename => filename.endsWith(".mdx"))
    .map(filename => filename.slice(0, -4))
}

export async function getStaticPaths() {
  const demos = await getDemoList()
  const { BUNDLED_THEMES } = await import("shiki")
  return {
    paths: demos.flatMap(demo =>
      BUNDLED_THEMES.map(theme => ({
        params: { demo, theme },
      }))
    ),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { demo, theme } = context.params
  const loadedTheme = await import(
    `shiki/themes/${theme}.json`
  )

  const mdxSource = await fs.readFile(
    `./content/${demo}.mdx`,
    "utf8"
  )
  const preCodeHike = await bundle(mdxSource, [
    remarkShowTree,
  ])

  const postCodeHike = await bundle(mdxSource, [
    [remarkCodeHike, { theme: loadedTheme }],
    remarkShowTree,
  ])

  const result = await bundle(mdxSource, [
    [remarkCodeHike, { theme: loadedTheme }],
  ])

  const shiki = await import("shiki")
  const highlighter = await shiki.getHighlighter({
    theme: "light-plus",
  })

  const demos = await getDemoList()

  return {
    props: {
      source: highlighter.codeToHtml(mdxSource, "markdown"),
      preCodeHike,
      postCodeHike,
      result,
      demos,
      themes: shiki.BUNDLED_THEMES,
      currentTheme: theme,
      currentDemo: demo,
    },
  }
}
async function bundle(source, plugins) {
  const { code } = await bundleMDX(source, {
    esbuildOptions(options) {
      options.platform = "node"
      return options
    },
    xdmOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        ...plugins,
      ]
      return options
    },
    globals: {
      react: "react",
    },
  })
  return code
}

export default function Page({
  source,
  preCodeHike,
  postCodeHike,
  result,
  demos,
  themes,
  currentTheme,
  currentDemo,
}) {
  const state = React.useState({
    MDX: true,
    "Pre Code Hike": false,
    "Post Code Hike": false,
    Result: true,
  })
  const router = useRouter()

  return (
    <div>
      <Head>
        <title>Code Hike Playground</title>
      </Head>
      <main>
        <div className="columns">
          <Column show={state[0]["MDX"]} title="MDX">
            <div
              dangerouslySetInnerHTML={{ __html: source }}
            />
          </Column>
          <Column
            show={state[0]["Pre Code Hike"]}
            title="MDAST before CH"
          >
            <MDXComponent code={preCodeHike} />
          </Column>
          <Column
            show={state[0]["Post Code Hike"]}
            title="MDAST after CH"
          >
            <MDXComponent code={postCodeHike} />
          </Column>
          <Column
            show={state[0]["Result"]}
            className="result"
            title="Result"
          >
            <ErrorBoundary>
              <MDXComponent code={result} />
            </ErrorBoundary>
          </Column>
        </div>
      </main>
      <nav>
        <label>
          Demo
          <select
            value={currentDemo}
            onChange={e => {
              router.push(
                `/${e.target.value}/${currentTheme}`
              )
            }}
          >
            {demos.map(demo => (
              <option key={demo}>{demo}</option>
            ))}
          </select>
        </label>
        <label>
          Theme
          <select
            value={currentTheme}
            onChange={e => {
              router.push(
                `/${currentDemo}/${e.target.value}`
              )
            }}
          >
            {themes.map(theme => (
              <option key={theme}>{theme}</option>
            ))}
          </select>
        </label>
        <label>
          Columns
          <div className="radio">
            <Toggle state={state} value="MDX" />
            <Toggle state={state} value="Pre Code Hike" />
            <Toggle state={state} value="Post Code Hike" />
            <Toggle state={state} value="Result" />
          </div>
        </label>
      </nav>
    </div>
  )
}

function Column({ children, show, className, title }) {
  return (
    <div
      className={"column " + (className || "")}
      style={{ display: show ? "block" : "none" }}
    >
      <h2>{title}</h2>
      <div className="content">{children}</div>
    </div>
  )
}

function Toggle({ state: [show, setShow], value }) {
  return (
    <button
      onClick={() =>
        setShow({ ...show, [value]: !show[value] })
      }
      className={show[value] ? "selected" : ""}
      style={{
        padding: "4px 8px",
      }}
    >
      {value}
    </button>
  )
}

function MDXComponent({ code }) {
  const Component = React.useMemo(
    () => getMDXComponent(code, { react: React }),
    [code]
  )
  return <Component components={{ JSONView }} />
}

const BrowserReactJsonView = dynamic(
  () => import("react-json-view"),
  {
    ssr: false,
  }
)
function JSONView({ src }) {
  return (
    <BrowserReactJsonView
      src={JSON.parse(src)}
      enableClipboard={false}
      displayDataTypes={false}
      displayObjectSize={false}
      collapsed={4}
      collapseStringsAfterLength={12}
    />
  )
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { show: false, hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    // console.log("getDerivedStateFromError", error)
    return {
      hasError: true,
      error: JSON.stringify(error, null, 2),
    }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo)
  }

  componentDidMount() {
    this.setState({ show: true })
  }

  render() {
    // ErrorBoundary doesn't work with SSR
    if (!this.state.show) {
      return ""
    }

    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error}</pre>
        </div>
      )
    }

    return this.props.children
  }
}
