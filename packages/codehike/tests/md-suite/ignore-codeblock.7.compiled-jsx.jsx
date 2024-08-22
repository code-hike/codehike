/*@jsxRuntime automatic @jsxImportSource react*/
function _createMdxContent(props) {
  const _components = {
      code: "code",
      p: "p",
      pre: "pre",
      ...props.components,
    },
    { MyCode } = _components
  if (!MyCode) _missingMdxReference("MyCode", true)
  return (
    <>
      <_components.p>{"hey"}</_components.p>
      {"\n"}
      <_components.pre>
        <_components.code className="language-mermaid">
          {
            "graph TD;\r\n    A-->B;\r\n    A-->C;\r\n    B-->D;\r\n    C-->D;\n"
          }
        </_components.code>
      </_components.pre>
      {"\n"}
      <MyCode
        codeblock={{
          value: "console.log(2)",
          lang: "js",
          meta: "index.js",
        }}
      />
    </>
  )
}
export default function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {}
  return MDXLayout ? (
    <MDXLayout {...props}>
      <_createMdxContent {...props} />
    </MDXLayout>
  ) : (
    _createMdxContent(props)
  )
}
function _missingMdxReference(id, component) {
  throw new Error(
    "Expected " +
      (component ? "component" : "object") +
      " `" +
      id +
      "` to be defined: you likely forgot to import, pass, or provide it.",
  )
}
