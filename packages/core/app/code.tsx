"use client"

import React from "react"
import { FlipCode } from "../src/flip-tokens"

export function Code({ children, tokens }) {
  return (
    <div>
      <FlipCode tokens={tokens} />
    </div>
  )
}
