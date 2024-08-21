/*@jsxRuntime automatic @jsxImportSource react*/
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    slot: "slot",
    ...props.components,
  }
  const _blocks = {
    children: <_components.h1>{"Lorem"}</_components.h1>,
    title: "",
    _data: {
      header: "",
    },
    hello: "world",
  }
  if (props._returnBlocks) {
    return _blocks
  }
  return _blocks.children
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
