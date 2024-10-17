/*@jsxRuntime automatic @jsxImportSource react*/
function _createMdxContent(props) {
  const _components = {
      em: "em",
      p: "p",
      ...props.components,
    },
    { InlineCode } = _components
  if (!InlineCode) _missingMdxReference("InlineCode", true)
  return (
    <>
      <_components.p>
        <InlineCode
          codeblock={{
            value: "var x = 1",
            lang: "jsx",
            meta: "",
            code: "var x = 1",
            tokens: [
              ["var", "#FF7B72"],
              " ",
              ["x", "#C9D1D9"],
              " ",
              ["=", "#FF7B72"],
              " ",
              ["1", "#79C0FF"],
            ],
            annotations: [],
            themeName: "github-dark",
            style: {
              color: "#c9d1d9",
              background: "#0d1117",
              colorScheme: "dark",
            },
          }}
        />
      </_components.p>
      {"\n"}
      <_components.p>
        {"hello "}
        <InlineCode
          codeblock={{
            value: '<div class="2">hey</div>',
            lang: "html",
            meta: "",
            code: '<div class="2">hey</div>',
            tokens: [
              ["<", "#C9D1D9"],
              ["div", "#7EE787"],
              " ",
              ["class", "#79C0FF"],
              ["=", "#C9D1D9"],
              ['"2"', "#A5D6FF"],
              [">hey</", "#C9D1D9"],
              ["div", "#7EE787"],
              [">", "#C9D1D9"],
            ],
            annotations: [],
            themeName: "github-dark",
            style: {
              color: "#c9d1d9",
              background: "#0d1117",
              colorScheme: "dark",
            },
          }}
        />
        {" world"}
      </_components.p>
      {"\n"}
      <_components.p>
        {"two lines "}
        <InlineCode
          codeblock={{
            value: "var x = 1\r\nvar y = 2",
            lang: "jsx",
            meta: "",
            code: "var x = 1\nvar y = 2",
            tokens: [
              ["var", "#FF7B72"],
              " ",
              ["x", "#C9D1D9"],
              " ",
              ["=", "#FF7B72"],
              " ",
              ["1", "#79C0FF"],
              "\n",
              ["var", "#FF7B72"],
              " ",
              ["y", "#C9D1D9"],
              " ",
              ["=", "#FF7B72"],
              " ",
              ["2", "#79C0FF"],
            ],
            annotations: [],
            themeName: "github-dark",
            style: {
              color: "#c9d1d9",
              background: "#0d1117",
              colorScheme: "dark",
            },
          }}
        />
      </_components.p>
      {"\n"}
      <_components.p>
        {"extra meta "}
        <InlineCode
          codeblock={{
            value: "var x = 1",
            lang: "jsx",
            meta: "foo bar bar",
            code: "var x = 1",
            tokens: [
              ["var", "#FF7B72"],
              " ",
              ["x", "#C9D1D9"],
              " ",
              ["=", "#FF7B72"],
              " ",
              ["1", "#79C0FF"],
            ],
            annotations: [],
            themeName: "github-dark",
            style: {
              color: "#c9d1d9",
              background: "#0d1117",
              colorScheme: "dark",
            },
          }}
        />
      </_components.p>
      {"\n"}
      <_components.p>
        {"lorem "}
        <_components.em>{"just emphasize"}</_components.em>
        {" ipsum"}
      </_components.p>
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
function _missingMdxReference(id, component) {
  throw new Error(
    "Expected " +
      (component ? "component" : "object") +
      " `" +
      id +
      "` to be defined: you likely forgot to import, pass, or provide it.",
  )
}
