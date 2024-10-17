/*@jsxRuntime automatic @jsxImportSource react*/
function _createMdxContent(props) {
  const _components = {
      slot: "slot",
      ...props.components,
    },
    { MyCode } = _components
  if (!MyCode) _missingMdxReference("MyCode", true)
  const _blocks = {
    children: (
      <MyCode
        codeblock={{
          value: "// !mark[6:10] hey\r\nconst a = 1",
          lang: "javascript",
          meta: "lorem.js",
          code: "const a = 1",
          tokens: [
            ["const", "#FF7B72"],
            " ",
            ["a", "#79C0FF"],
            " ",
            ["=", "#FF7B72"],
            " ",
            ["1", "#79C0FF"],
          ],
          annotations: [
            {
              name: "mark",
              query: "hey",
              lineNumber: 1,
              fromColumn: 6,
              toColumn: 10,
            },
          ],
          themeName: "github-dark",
          style: {
            color: "#c9d1d9",
            background: "#0d1117",
            colorScheme: "dark",
          },
        }}
      />
    ),
    title: "",
    _data: {
      header: "",
    },
    foo: {
      value: "// !mark 1\r\nconst b = 2",
      lang: "javascript",
      meta: "bar.js",
      code: "const b = 2",
      tokens: [
        ["const", "#FF7B72"],
        " ",
        ["b", "#79C0FF"],
        " ",
        ["=", "#FF7B72"],
        " ",
        ["2", "#79C0FF"],
      ],
      annotations: [
        {
          name: "mark",
          query: "1",
          fromLineNumber: 1,
          toLineNumber: 1,
        },
      ],
      themeName: "github-dark",
      style: {
        color: "#c9d1d9",
        background: "#0d1117",
        colorScheme: "dark",
      },
    },
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
function _missingMdxReference(id, component) {
  throw new Error(
    "Expected " +
      (component ? "component" : "object") +
      " `" +
      id +
      "` to be defined: you likely forgot to import, pass, or provide it.",
  )
}
