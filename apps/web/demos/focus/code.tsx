"use client"

import {
  HighlightedCode,
  Pre,
  AnnotationHandler,
  InnerPre,
  getPreRef,
  InnerLine,
} from "codehike/code"
import React, { useLayoutEffect, useRef, useState } from "react"

const ranges = {
  lorem: { fromLineNumber: 1, toLineNumber: 5 },
  ipsum: { fromLineNumber: 7, toLineNumber: 11 },
  dolor: { fromLineNumber: 11, toLineNumber: 15 },
}

export function CodeContainer({ code }: { code: HighlightedCode }) {
  const [focused, setFocused] = useState<"lorem" | "ipsum" | "dolor">("dolor")

  return (
    <>
      <Pre
        className="m-0 px-0 max-h-72 scroll-smooth overflow-auto bg-zinc-950/90"
        code={{
          ...code,
          annotations: [
            {
              name: "focus",
              query: "",
              ...ranges[focused],
            },
          ],
        }}
        handlers={[focus]}
      />
      <div className="p-2 mt-auto font-light text-center">
        You can also change the focus annotations on a rendered codeblock:
      </div>
      <div className="flex justify-center gap-2 pb-4">
        <button
          onClick={() => setFocused("lorem")}
          disabled={focused === "lorem"}
          className="border border-current rounded px-2 disabled:opacity-60"
        >
          focus `lorem`
        </button>{" "}
        <button
          onClick={() => setFocused("dolor")}
          disabled={focused === "dolor"}
          className="border border-current rounded px-2 disabled:opacity-60"
        >
          focus `dolor`
        </button>
      </div>
    </>
  )
}

const focus: AnnotationHandler = {
  name: "focus",
  PreWithRef: (props) => {
    const ref = getPreRef(props)
    useScrollToFocus(ref)
    return <InnerPre merge={props} />
  },
  Line: (props) => (
    <InnerLine
      merge={props}
      className="opacity-50 data-[focus]:opacity-100 px-2"
    />
  ),
  AnnotatedLine: ({ annotation, ...props }) => (
    <InnerLine merge={props} data-focus={true} className="bg-zinc-700/30" />
  ),
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
