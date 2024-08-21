/*@jsxRuntime automatic @jsxImportSource react*/
/*prettier-ignore*/
function _createMdxContent(props) {
  const {MyCode} = props.components || ({});
  if (!MyCode) _missingMdxReference("MyCode", true);
  return <>{}{"\n"}<MyCode codeblock={{
    "value": "\r\n// !m 343\r\nconst a = 1\r\nconst b = 2",
    "lang": "js",
    "meta": ""
  }} /></>;
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
