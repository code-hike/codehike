"use client"

import React, { useLayoutEffect, useRef } from "react"
import { AnnotationHandler, InnerPre, getPreRef } from "codehike/code"

export const PreWithFocus: AnnotationHandler["PreWithRef"] = (props) => {
  const ref = getPreRef(props)
  useScrollToFocus(ref)
  return <InnerPre merge={props} />
}

function useScrollToFocus(ref: React.RefObject<HTMLPreElement>) {
  const firstRender = useRef(true)
  useLayoutEffect(() => {
    if (ref.current) {
      // find all descendants whith data-focus="true"
      const focusedElements = ref.current.querySelectorAll(
        "[data-focus=true]",
      ) as NodeListOf<HTMLElement>

      // find top and bottom of the focused elements
      const containerRect = ref.current.getBoundingClientRect()
      let top = Infinity
      let bottom = -Infinity
      focusedElements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        top = Math.min(top, rect.top - containerRect.top)
        bottom = Math.max(bottom, rect.bottom - containerRect.top)
      })

      // scroll to the focused elements if any part of them is not visible
      if (bottom > containerRect.height || top < 0) {
        ref.current.scrollTo({
          top: ref.current.scrollTop + top - 10,
          behavior: firstRender.current ? "instant" : "smooth",
        })
      }
      firstRender.current = false
    }
  })
}
