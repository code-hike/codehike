import { Fragment as _Fragment, jsxDEV as _jsxDEV } from "react/jsx-dev-runtime"
function _createMdxContent(props) {
  const _components = {
    p: "p",
    slot: "slot",
    ...props.components,
  }
  return _jsxDEV(
    _Fragment,
    {
      children: [
        _jsxDEV(
          "div",
          {
            children: _jsxDEV(
              _Fragment,
              {
                children: [
                  _jsxDEV(
                    _components.p,
                    {
                      children: "hey",
                    },
                    undefined,
                    false,
                    {
                      fileName:
                        "C:\\p\\dev\\codehike\\packages\\codehike\\tests\\md-suite\\static-children.0.mdx",
                      lineNumber: 3,
                      columnNumber: 1,
                    },
                    this,
                  ),
                  _jsxDEV(
                    _components.p,
                    {
                      children: "ho",
                    },
                    undefined,
                    false,
                    {
                      fileName:
                        "C:\\p\\dev\\codehike\\packages\\codehike\\tests\\md-suite\\static-children.0.mdx",
                      lineNumber: 5,
                      columnNumber: 1,
                    },
                    this,
                  ),
                ],
              },
              undefined,
              true,
              {
                fileName:
                  "C:\\p\\dev\\codehike\\packages\\codehike\\tests\\md-suite\\static-children.0.mdx",
              },
              this,
            ),
            title: "",
            _data: {
              header: "",
            },
            foo: {
              children: _jsxDEV(
                _components.p,
                {
                  children: "bar",
                },
                undefined,
                false,
                {
                  fileName:
                    "C:\\p\\dev\\codehike\\packages\\codehike\\tests\\md-suite\\static-children.0.mdx",
                  lineNumber: 9,
                  columnNumber: 1,
                },
                this,
              ),
              title: "",
              _data: {
                header: "## !foo",
              },
            },
          },
          undefined,
          false,
          {
            fileName:
              "C:\\p\\dev\\codehike\\packages\\codehike\\tests\\md-suite\\static-children.0.mdx",
            lineNumber: 1,
            columnNumber: 1,
          },
          this,
        ),
        "\n",
        _jsxDEV(
          "section",
          {
            children: [
              _jsxDEV(
                _components.p,
                {
                  children: "asdf",
                },
                undefined,
                false,
                {
                  fileName:
                    "C:\\p\\dev\\codehike\\packages\\codehike\\tests\\md-suite\\static-children.0.mdx",
                  lineNumber: 15,
                  columnNumber: 1,
                },
                this,
              ),
              _jsxDEV(
                _components.p,
                {
                  children: "aa",
                },
                undefined,
                false,
                {
                  fileName:
                    "C:\\p\\dev\\codehike\\packages\\codehike\\tests\\md-suite\\static-children.0.mdx",
                  lineNumber: 17,
                  columnNumber: 1,
                },
                this,
              ),
            ],
          },
          undefined,
          true,
          {
            fileName:
              "C:\\p\\dev\\codehike\\packages\\codehike\\tests\\md-suite\\static-children.0.mdx",
            lineNumber: 13,
            columnNumber: 1,
          },
          this,
        ),
      ],
    },
    undefined,
    true,
    {
      fileName:
        "C:\\p\\dev\\codehike\\packages\\codehike\\tests\\md-suite\\static-children.0.mdx",
      lineNumber: 1,
      columnNumber: 1,
    },
    this,
  )
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
                "C:\\p\\dev\\codehike\\packages\\codehike\\tests\\md-suite\\static-children.0.mdx",
            },
            this,
          ),
        },
        undefined,
        false,
        {
          fileName:
            "C:\\p\\dev\\codehike\\packages\\codehike\\tests\\md-suite\\static-children.0.mdx",
        },
        this,
      )
    : _createMdxContent(props)
}
