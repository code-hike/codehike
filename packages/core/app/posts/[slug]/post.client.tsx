"use client"
import { useMDXComponent } from "next-contentlayer/hooks"

export function PostClient({ code }) {
  const MDXContent = useMDXComponent(code)
  return <MDXContent />
}
