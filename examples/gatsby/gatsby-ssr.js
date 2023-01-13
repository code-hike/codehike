import "@code-hike/mdx/styles.css"
import React from "react"
import { Layout } from "./src/components/layout"

export const wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>
}
