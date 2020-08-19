import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../demo/cake.mdx"
import { CakeLayout } from "../src/cake-layout"
import Head from "next/head"

export default function Page() {
  return (
    <MDXProvider components={components}>
      <Head>
        <title>The X in MDX</title>
      </Head>
      <Content />
    </MDXProvider>
  )
}

function Wrapper({ children }) {
  const {
    videoSteps,
    browserSteps,
    editorSteps,
    captionSteps,
  } = getStepsFromMDX(children)
  return (
    <CakeLayout
      videoSteps={videoSteps}
      browserSteps={browserSteps}
      editorSteps={editorSteps}
      captionSteps={captionSteps}
    />
  )
}
const components = {
  wrapper: Wrapper,
}

function getStepsFromMDX(children) {
  const splits = [[]]
  React.Children.forEach(children, child => {
    if (child.props.mdxType === "hr") {
      splits.push([])
    } else {
      const lastSplit = splits[splits.length - 1]
      lastSplit.push(child)
    }
  })
  const videoSteps = splits.map(split => {
    const videoElement = split.find(
      child => child.props.mdxType === "Video"
    )
    const props = videoElement.props
    return props
  })

  const browserSteps = splits.map(split => {
    const browserElement = split.find(
      child => child.props.mdxType === "Browser"
    )
    const { children, ...rest } = browserElement.props
    const actions = React.Children.map(
      children,
      child => child.props
    )
    return {
      actions,
      ...rest,
    }
  })

  const editorSteps = splits.map(split => {
    const editorElement = split.find(
      child => child.props.mdxType === "Editor"
    )
    const { code, tab, ...rest } = editorElement.props
    return {
      code: require(`!!raw-loader!../demo/${code}`).default,
      file: tab,
      ...rest,
    }
  })

  const captionSteps = splits.map(split => {
    const pre = split.find(
      child =>
        child.props.mdxType === "pre" &&
        child.props.children.props.className ===
          "language-srt"
    )
    if (!pre) return []

    return parseSrt(pre.props.children.props.children)
  })

  return {
    videoSteps,
    browserSteps,
    editorSteps,
    captionSteps,
  }
}

function parseSrt(srt) {
  const regex = /^[\d\.\:]+\s+[–\-]>\s+[\d\.\:]+$/gm
  const times = srt.match(regex)
  if (!times) return []
  const [, ...texts] = srt.split(regex)
  return times.map((time, i) => {
    const [start, end] = time.match(/[\d\.]+/g).map(t => +t)
    return { start, end, text: texts[i].trim() }
  })
}
