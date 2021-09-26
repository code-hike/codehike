import React from "react"
import { CodeSpring } from "@code-hike/smooth-code"
import { EditorSpring } from "@code-hike/mini-editor"
import { Code } from "@code-hike/utils"

// export function Code({
//   code,
//   meta,
//   theme,
//   annotations,
// }: {
//   code: string
//   meta: string
//   theme: string
//   annotations: string
// }) {
//   const { name, focus } = parseMetastring(meta)
//   return name ? (
//     <EditorSpring
//       northPanel={{
//         tabs: [name],
//         active: name,
//         heightRatio: 1,
//       }}
//       files={[
//         {
//           name,
//           code: JSON.parse(code),
//           focus,
//           annotations: parseAnnotations(annotations),
//         },
//       ]}
//       codeConfig={{ theme: JSON.parse(theme) }}
//     />
//   ) : (
//     <CodeSpring
//       config={{ theme: JSON.parse(theme) }}
//       step={{
//         code: JSON.parse(code),
//         focus,
//         annotations: parseAnnotations(annotations),
//       }}
//     />
//   )
// }

export function Code({
  files,
  theme,
}: {
  files: string
  theme: string
}) {
  const filesData = JSON.parse(files) as {
    meta: string
    code: Code
    annotations: {
      type: string
      data: any
      focus?: string
    }
  }[]

  const parsedFiles = filesData.map(data => {
    const { name, focus } = parseMetastring(data.meta)
    return {
      name,
      code: data.code,
      focus,
      annotations: parseAnnotations(data.annotations),
    }
  })

  if (parsedFiles.length <= 1 && !parsedFiles[0]?.name) {
    return (
      <CodeSpring
        config={{ theme: JSON.parse(theme) }}
        step={parsedFiles[0]}
      />
    )
  } else {
    return (
      <EditorSpring
        northPanel={{
          tabs: parsedFiles.map(x => x.name) as any,
          active: parsedFiles[0].name as any,
          heightRatio: 1,
        }}
        files={parsedFiles as any}
        codeConfig={{ theme: JSON.parse(theme) }}
      />
    )
  }
}

function parseAnnotations(annotations: any) {
  return annotations.map(
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
