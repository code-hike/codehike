/*@jsxRuntime automatic @jsxImportSource react*/
import { x } from "@/components/code/code-with-notes"
function _createMdxContent(props) {
  const _components = {
    p: "p",
    slot: "slot",
    ...props.components,
  }
  const _blocks = {
    children: undefined,
    title: "",
    _data: {
      header: "",
    },
    demo: {
      children: (
        <_components.p>{"Add callouts inside your code blocks."}</_components.p>
      ),
      title: "",
      _data: {
        header: "## !demo",
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
