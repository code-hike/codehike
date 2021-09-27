import { bundleMDX } from "mdx-bundler"
import { getMDXComponent } from "mdx-bundler/client"
import React from "react"
import fs from "fs/promises"
import { remarkShowTree } from "../src/plugin"
import dynamic from "next/dynamic"
import { remarkCodeHike } from "@code-hike/mdx"
import theme from "shiki/themes/github-light.json"

export async function getStaticPaths() {
  const files = await fs.readdir("./content/")
  return {
    paths: files
      .filter(filename => filename.endsWith(".mdx"))
      .map(filename => ({
        params: { file: filename.slice(0, -4) },
      })),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { file } = context.params
  const mdxSource = await fs.readFile(
    `./content/${file}.mdx`,
    "utf8"
  )
  const preCodeHike = await bundle(mdxSource, [
    remarkShowTree,
  ])

  const postCodeHike = await bundle(mdxSource, [
    [remarkCodeHike, { theme }],
    remarkShowTree,
  ])

  const result = await bundle(mdxSource, [
    [remarkCodeHike, { theme }],
  ])

  const shiki = await import("shiki")
  const highlighter = await shiki.getHighlighter({
    theme: "github-light",
  })

  return {
    props: {
      source: highlighter.codeToHtml(mdxSource, "mdx"),
      preCodeHike,
      postCodeHike,
      result,
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
}) {
  const state = React.useState({
    MDX: false,
    "Pre Code Hike": true,
    "Post Code Hike": true,
    Result: true,
  })

  return (
    <main>
      <div
        style={{ textAlign: "center", marginBottom: 20 }}
      >
        <Toggle state={state} value="MDX" />
        <Toggle state={state} value="Pre Code Hike" />
        <Toggle state={state} value="Post Code Hike" />
        <Toggle state={state} value="Result" />
      </div>

      <div style={{ display: "flex" }}>
        <pre
          style={{
            display: state[0]["MDX"] ? "block" : "none",
            flex: 1,
          }}
          dangerouslySetInnerHTML={{ __html: source }}
        ></pre>
        <MDXComponent
          code={preCodeHike}
          hide={!state[0]["Pre Code Hike"]}
        />
        <MDXComponent
          code={postCodeHike}
          hide={!state[0]["Post Code Hike"]}
        />
        <div
          style={{
            outline: "2px solid violet",
            padding: "0 10px",
            display: state[0]["Result"] ? "block" : "none",
            minWidth: "50vw",
            maxWidth: "50vw",
            width: "50vw",
            boxSizing: "border-box",
            flex: 0,
          }}
        >
          <ErrorBoundary>
            <MDXComponent code={result} />
          </ErrorBoundary>
        </div>
      </div>
    </main>
  )
}

function Toggle({ state: [show, setShow], value }) {
  return (
    <button
      onClick={() =>
        setShow({ ...show, [value]: !show[value] })
      }
      style={{
        background: show[value] ? "#ebf3ff" : "#ededed",
        border: "none",
        padding: "4px 8px",
      }}
    >
      {value}
    </button>
  )
}

function MDXComponent({ code, hide }) {
  const Component = React.useMemo(
    () => getMDXComponent(code, { react: React }),
    [code]
  )
  return (
    <div
      style={{
        display: hide ? "none" : "block",
        flex: 1,
        minWidth: "25vw",
      }}
    >
      <Component components={{ JSONView }} />
    </div>
  )
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
