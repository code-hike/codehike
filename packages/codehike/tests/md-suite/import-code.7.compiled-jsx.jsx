/*@jsxRuntime automatic @jsxImportSource react*/
function _createMdxContent(props) {
  const _components = {
      p: "p",
      slot: "slot",
      ...props.components,
    },
    { MyCode } = _components
  if (!MyCode) _missingMdxReference("MyCode", true)
  const _blocks = {
    children: (
      <>
        <_components.p>{"hello"}</_components.p>
        <MyCode
          codeblock={{
            value: "# !mark inside\r\nimport random\r\nmy_list = []",
            lang: "py",
            meta: "",
          }}
        />
        <MyCode
          codeblock={{
            value:
              '# !mark(2) bar\r\n# !mark inside\r\nimport random\r\nmy_list = []\n\r\ndef hello():\r\n    print("hello")\r\n\r\n# !mark inside\r\nimport random\r\nmy_list = []',
            lang: "py",
            meta: "",
          }}
        />
      </>
    ),
    title: "",
    _data: {
      header: "",
    },
    code: {
      value: "# !mark inside\r\nimport random\r\nmy_list = []",
      lang: "py",
      meta: "",
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
