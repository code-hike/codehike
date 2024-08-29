import {
  Fragment as _Fragment,
  jsx as _jsx,
  jsxs as _jsxs,
} from "react/jsx-runtime"
function _createMdxContent(props) {
  const _components = {
    p: "p",
    slot: "slot",
    ...props.components,
  }
  return _jsxs(_Fragment, {
    children: [
      _jsx("div", {
        children: _jsxs(_Fragment, {
          children: [
            _jsx(_components.p, {
              children: "hey",
            }),
            _jsx(_components.p, {
              children: "ho",
            }),
          ],
        }),
        title: "",
        _data: {
          header: "",
        },
        foo: {
          children: _jsx(_components.p, {
            children: "bar",
          }),
          title: "",
          _data: {
            header: "## !foo",
          },
        },
      }),
      "\n",
      _jsxs("section", {
        children: [
          _jsx(_components.p, {
            children: "asdf",
          }),
          _jsx(_components.p, {
            children: "aa",
          }),
        ],
      }),
    ],
  })
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
