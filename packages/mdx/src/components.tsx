import React from "react"
import { CodeSpring } from "@code-hike/smooth-code"
import { EditorSpring } from "@code-hike/mini-editor"
import { Code } from "@code-hike/utils"

export function Code({
  northFiles,
  southFiles,
  theme,
}: {
  northFiles: string
  southFiles?: string
  theme: string
}) {
  const north = parseFiles(northFiles)
  const south = parseFiles(southFiles || "[]")
  console.log({ north, south })

  const allFiles = [...north, ...south]

  if (allFiles.length <= 1 && !allFiles[0]?.name) {
    return (
      <CodeSpring
        config={{ theme: JSON.parse(theme) }}
        step={allFiles[0]}
      />
    )
  } else {
    const northActive =
      north.find(f => f.active) || north[0]
    const southActive = south.length
      ? south.find(f => f.active) || south[0]
      : null

    const northLines = northActive.code.lines.length || 1
    const southLines = southActive?.code.lines.length || 0

    const northRatio = southActive
      ? (northLines + 3.33) /
        (southLines + northLines + 6.66)
      : 1
    const southRatio = 1 - northRatio

    return (
      <EditorSpring
        northPanel={{
          tabs: north.map(x => x.name) as any,
          active: northActive.name as any,
          heightRatio: northRatio,
        }}
        southPanel={
          south.length
            ? {
                tabs: south.map(x => x.name) as any,
                active: southActive!.name as any,
                heightRatio: southRatio,
              }
            : undefined
        }
        files={allFiles as any}
        codeConfig={{ theme: JSON.parse(theme) }}
      />
    )
  }
}

function parseFiles(files: string) {
  const filesData = JSON.parse(files) as {
    meta: string
    code: Code
    annotations: {
      type: string
      data: any
      focus?: string
    }
  }[]

  return filesData.map(data => {
    const { name, focus, active } = parseMetastring(
      data.meta
    )
    return {
      active,
      name,
      code: data.code,
      focus,
      annotations: parseAnnotations(data.annotations),
    }
  })
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
