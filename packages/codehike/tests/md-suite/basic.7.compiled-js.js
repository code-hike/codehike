import { jsx as _jsx } from "react/jsx-runtime"
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    slot: "slot",
    ...props.components,
  }
  const _blocks = {
    children: _jsx(_components.h1, {
      children: "Lorem",
    }),
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
  return MDXLayout
    ? _jsx(MDXLayout, {
        ...props,
        children: _jsx(_createMdxContent, {
          ...props,
        }),
      })
    : _createMdxContent(props)
}
