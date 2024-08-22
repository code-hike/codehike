"use client"

import { useRef } from "react"
import { InnerPre } from "./inner.js"
import { CustomPre } from "./types.js"

export const AddRefIfNedded: CustomPre = (props: any) => {
  const innerRef = useRef(null)
  const ref = props._ref || innerRef
  // @ts-ignore
  return <InnerPre merge={props} _ref={ref} />
}
