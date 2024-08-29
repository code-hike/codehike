import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime"
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    slot: "slot",
    ...props.components,
  }
  const _blocks = {
    children: _jsxDEV(
      _components.h1,
      {
        children: "Lorem",
      },
      undefined,
      false,
      {
        fileName:
          "C:\\p\\dev\\codehike\\packages\\codehike\\tests\\md-suite\\basic.0.mdx",
        lineNumber: 1,
        columnNumber: 1,
      },
      this,
    ),
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
    ? _jsxDEV(
        MDXLayout,
        {
          ...props,
          children: _jsxDEV(
            _createMdxContent,
            {
              ...props,
            },
            undefined,
            false,
            {
              fileName:
                "C:\\p\\dev\\codehike\\packages\\codehike\\tests\\md-suite\\basic.0.mdx",
            },
            this,
          ),
        },
        undefined,
        false,
        {
          fileName:
            "C:\\p\\dev\\codehike\\packages\\codehike\\tests\\md-suite\\basic.0.mdx",
        },
        this,
      )
    : _createMdxContent(props)
}
