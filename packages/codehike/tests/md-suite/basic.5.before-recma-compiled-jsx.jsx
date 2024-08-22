/*@jsxRuntime automatic @jsxImportSource react*/
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    slot: "slot",
    ...props.components,
  }
  return (
    <_components.slot
      __hike={{
        children: "",
        title: "",
        _data: {
          header: "",
        },
        hello: "world",
      }}
    >
      <_components.slot path="">
        <_components.h1>{"Lorem"}</_components.h1>
      </_components.slot>
    </_components.slot>
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
