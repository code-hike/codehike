import React from "react"

export function extractPreviewSteps(
  children: React.ReactNode,
  hasPreviewSteps?: boolean
) {
  const allChildren = React.Children.toArray(children)

  const stepsChildren = hasPreviewSteps
    ? allChildren.slice(0, allChildren.length / 2)
    : allChildren

  const previewChildren = hasPreviewSteps
    ? allChildren.slice(allChildren.length / 2)
    : undefined

  return { stepsChildren, previewChildren }
}
