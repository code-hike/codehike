/*@jsxRuntime automatic @jsxImportSource react*/
function _createMdxContent(props) {
  const _components = {
    h2: "h2",
    ...props.components,
  }
  return (
    <>
      <_components.h2>{"Hello world"}</_components.h2>
      {"\n"}
      <foo
        x={{
          yyy: undefined,
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
