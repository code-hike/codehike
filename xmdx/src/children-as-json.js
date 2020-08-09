export function ShowChildrenJSON({ children }) {
  const parse = c => {
    if (!c.props) {
      return c.length > 12 ? c.substring(0, 9) + "..." : c
    }
    return {
      props: {
        mdxType: c.props.mdxType,
        children:
          c.props.children &&
          !Array.isArray(c.props.children)
            ? parse(c.props.children)
            : React.Children.map(c.props.children, parse),
      },
    }
  }
  const o = React.Children.map(children, parse)

  return (
    <pre>
      {JSON.stringify(
        o,
        ["props", "mdxType", "children"],
        2
      )}
    </pre>
  )
}
