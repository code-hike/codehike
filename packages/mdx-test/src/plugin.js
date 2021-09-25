export function remarkShowTree() {
  return function transformer(tree) {
    const value = JSON.stringify(tree, replacer, 2)
    tree.children = [
      {
        type: "mdxJsxFlowElement",
        name: "JSONView",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "src",
            value: value,
          },
        ],
        position: {
          start: {
            line: 1,
            column: 1,
            offset: 0,
          },
          end: {
            line: 1,
            column: 1,
            offset: 0,
          },
        },
      },
    ]
  }
}

function replacer(key, value) {
  if (["position", "estree"].includes(key)) {
    return
  }
  return value
}
