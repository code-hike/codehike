import React from "react"
import { CodeSpring } from "@code-hike/smooth-code"
import { EditorSpring } from "@code-hike/mini-editor"

export function Code({
  code,
  meta,
  theme,
  annotations,
}: {
  code: string
  meta: string
  theme: string
  annotations: string
}) {
  const { name, focus } = parseMetastring(meta)
  return name ? (
    <EditorSpring
      northPanel={{
        tabs: [name],
        active: name,
        heightRatio: 1,
      }}
      files={[
        {
          name,
          code: JSON.parse(code),
          focus,
          annotations: parseAnnotations(annotations),
        },
      ]}
      codeConfig={{ theme: JSON.parse(theme) }}
    />
  ) : (
    <CodeSpring
      config={{ theme: JSON.parse(theme) }}
      step={{
        code: JSON.parse(code),
        focus,
        annotations: parseAnnotations(annotations),
      }}
    />
  )
}

function parseAnnotations(annotations: string) {
  const list = JSON.parse(annotations) || []
  console.log({ list })
  return list.map(
    ({ type, ...rest }: { type: string }) => ({
      Component: CodeLink,
      ...rest,
    })
  )
}

function CodeLink({
  children,
  data,
}: {
  data: {
    url: string
    title: string | undefined
  }
  children: React.ReactNode
}) {
  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      title={data.title}
      style={{
        textDecoration: "underline",
        textDecorationStyle: "dotted",
      }}
    >
      {children}
    </a>
  )
}

type FileOptions = {
  focus?: string
  active?: string
  hidden?: boolean
}
function parseMetastring(
  metastring: string
): { name: string | null } & FileOptions {
  const params = metastring.split(" ")
  const options = {} as FileOptions
  let name: string | null = null
  params.forEach(param => {
    const [key, value] = param.split("=")
    if (value != null) {
      ;(options as any)[key] = value
    } else if (name === null) {
      name = key
    } else {
      ;(options as any)[key] = true
    }
  })
  return { name, ...options }
}
