import { preload } from "@code-hike/lighter"
import { visit } from "unist-util-visit"
import { toValueExpression } from "./to-estree.mjs"
import { tokenizeSync } from "./highlight.mjs"

const theme = "github-dark"

async function preloadLanguages(tree) {
  const langs = new Set()

  visit(tree, "code", node => {
    const { lang } = node
    if (lang) {
      langs.add(lang)
    }
  })

  await preload([...langs], theme)
}

export const myPlugin = config => {
  return async (tree, file) => {
    await preloadLanguages(tree)

    visit(tree, "code", node => {
      const { lang, meta, value } = node
      const tokens = tokenizeSync(value, lang, theme)

      node.type = "mdxJsxFlowElement"
      node.name = "Code"
      node.attributes = [
        {
          type: "mdxJsxAttribute",
          name: "blaze",
          value: "code",
        },
        {
          type: "mdxJsxAttribute",
          name: "lang",
          value: lang,
        },
        {
          type: "mdxJsxAttribute",
          name: "meta",
          value: meta,
        },
        {
          type: "mdxJsxAttribute",
          name: "tokens",
          value: toValueExpression(tokens),
        },
      ]
    })

    visit(tree, "mdxJsxFlowElement", node => {
      if (node.name === "Hike") {
        processSteps(node)
      }
    })
    return tree
  }
}

function processSteps(node) {
  const steps = [{}]

  node.children.forEach(child => {
    if (child?.type === "thematicBreak") {
      steps.push({})
      return
    }

    const step = steps[steps.length - 1]
    console.log(child)
    const blazeAttribute = child?.attributes?.find(
      attribute => attribute.name === "blaze"
    )

    const slot = blazeAttribute?.value ?? "children"

    step[slot] = step[slot] ?? []
    step[slot].push(child)

    // TODO push a placeholder to slot["children"] for the static version
  })

  node.children = steps.map(step => {
    const slots = Object.keys(step)

    return {
      type: "mdxJsxFlowElement",
      name: "step",
      attributes: {},
      children: slots.map(slotName => ({
        type: "mdxJsxFlowElement",
        name: "slot",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "className",
            value: slotName,
          },
        ],
        children: step[slotName],
      })),
    }
  })
}
