import { MdxJsxAttributeValueExpression } from "mdast-util-mdx-jsx"

export function getLiteralAttribute(value: string): any {
  return {
    type: "mdxJsxAttributeValueExpression",
    value: "",
    data: program([
      {
        type: "ExpressionStatement",
        expression: {
          type: "Literal",
          value: value,
          raw: JSON.stringify(value),
        },
      },
    ]),
  }
}

export function getArrayAttribute(value: any[]): any {
  return {
    type: "mdxJsxAttributeValueExpression",
    value: "",
    data: program([
      {
        type: "ExpressionStatement",
        expression: {
          type: "ArrayExpression",
          elements: value.map(serialize),
        },
      },
    ]),
  }
}

export function getObjectAttribute(value: any): any {
  return {
    type: "mdxJsxAttributeValueExpression",
    value: "",
    data: program([
      {
        type: "ExpressionStatement",
        expression: serialize(value),
      },
    ]),
  }
}

function program(body: any[]): any {
  return {
    estree: {
      type: "Program",
      body: body,
      sourceType: "module",
      comments: [],
    },
  }
}

function serialize(value: any): any {
  // is null
  if (value === null) {
    return {
      type: "Literal",
      value: null,
      raw: "null",
    }
  }

  // is array
  if (Array.isArray(value)) {
    return {
      type: "ArrayExpression",
      elements: value.map(serialize),
    }
  }
  // is object
  if (typeof value === "object") {
    return {
      type: "ObjectExpression",
      properties: Object.entries(value).map(([key, value]) => ({
        type: "Property",
        method: false,
        shorthand: false,
        computed: false,
        key: {
          type: "Literal",
          value: key,
        },
        kind: "init",
        value: serialize(value),
      })),
    }
  }

  // is literal
  return {
    type: "Literal",
    value: value,
    raw: JSON.stringify(value),
  }
}
