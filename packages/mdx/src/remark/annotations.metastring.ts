import { CodeAnnotation } from "../smooth-code"
import { annotationsMap } from "../mdx-client/annotations"

export function getAnnotationsFromMetastring(
  options: Record<string, string>
) {
  const annotations = [] as CodeAnnotation[]
  Object.keys(options).forEach(key => {
    const Component = annotationsMap[key]
    if (Component) {
      annotations?.push({ focus: options[key], Component })
    }
  })
  return annotations
}
