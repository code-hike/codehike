/*@jsxRuntime automatic @jsxImportSource react*/
function _createMdxContent(props) {
  const _components = {
      em: "em",
      p: "p",
      ...props.components,
    },
    { InlineCode } = _components
  if (!InlineCode) _missingMdxReference("InlineCode", true)
  return (
    <>
      <_components.p>
        <InlineCode
          codeblock={{
            value: "var x = 1",
            lang: "jsx",
            meta: "",
          }}
        />
      </_components.p>
      {"\n"}
      <_components.p>
        {"hello "}
        <InlineCode
          codeblock={{
            value: '<div class="2">hey</div>',
            lang: "html",
            meta: "",
          }}
        />
        {" world"}
      </_components.p>
      {"\n"}
      <_components.p>
        {"two lines "}
        <InlineCode
          codeblock={{
            value: "var x = 1\r\nvar y = 2",
            lang: "jsx",
            meta: "",
          }}
        />
      </_components.p>
      {"\n"}
      <_components.p>
        {"extra meta "}
        <InlineCode
          codeblock={{
            value: "var x = 1",
            lang: "jsx",
            meta: "foo bar bar",
          }}
        />
      </_components.p>
      {"\n"}
      <_components.p>
        {"lorem "}
        <_components.em>{"just emphasize"}</_components.em>
        {" ipsum"}
      </_components.p>
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
