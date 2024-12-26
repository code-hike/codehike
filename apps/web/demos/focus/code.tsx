"use client"

import { HighlightedCode, Pre } from "codehike/code"
import React, { useState } from "react"
import { focus } from "./focus"

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
      <div className="p-2 mt-auto font-light text-center text-white">
        You can also change the focus annotations on a rendered codeblock:
      </div>
      <div className="flex justify-center gap-2 pb-4 text-white">
        <button
          onClick={() => setFocused("lorem")}
          disabled={focused === "lorem"}
          className="border border-current rounded px-2"
        >
          focus `lorem`
        </button>{" "}
        <button
          onClick={() => setFocused("dolor")}
          disabled={focused === "dolor"}
          className="border border-current rounded px-2"
        >
          focus `dolor`
        </button>
      </div>
    </>
  )
}
