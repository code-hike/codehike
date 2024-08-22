/*@jsxRuntime automatic @jsxImportSource react*/
"use strict"
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
function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {}
  return MDXLayout ? (
    <MDXLayout {...props}>
      <_createMdxContent {...props} />
    </MDXLayout>
  ) : (
    _createMdxContent(props)
  )
}
return {
  default: MDXContent,
}
