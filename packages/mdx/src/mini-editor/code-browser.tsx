import { CodeFile } from "./editor-shift"
import { codeToText } from "utils"
import React from "react"
import { CopyButton } from "smooth-code/copy-button"

export function CodeBrowser({
  files,
  startingFileName,
}: {
  files: CodeFile[]
  startingFileName: string
}) {
  const [activeFile, setActiveFile] = React.useState(() =>
    files.find(f => f.name === startingFileName)
  )

  return (
    <div className="ch-code-browser">
      <Sidebar
        files={files}
        activeFile={activeFile}
        setActiveFile={setActiveFile}
      />
      <Content file={activeFile} />
    </div>
  )
}

function Sidebar({
  files,
  activeFile,
  setActiveFile,
}: {
  files: CodeFile[]
  activeFile: CodeFile
  setActiveFile: (file: CodeFile) => void
}) {
  const noFiles = files.length === 0 || !files[0].name
  const tree = React.useMemo(
    () => toFileTree(files),
    [files]
  )
  return noFiles ? null : (
    <div className="ch-code-browser-sidebar">
      <SidebarNodes
        tree={tree}
        activeFile={activeFile}
        setActiveFile={setActiveFile}
      />
    </div>
  )
}

function SidebarNodes({
  tree,
  activeFile,
  setActiveFile,
  level = 0,
}: {
  tree: Node[]
  activeFile: CodeFile
  setActiveFile: (file: CodeFile) => void
  level?: number
}) {
  return (
    <>
      {tree.map(node => (
        <SidebarNode
          key={node.name}
          node={node}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          level={level}
        />
      ))}
    </>
  )
}
function SidebarNode({
  node,
  activeFile,
  setActiveFile,
  level,
}: {
  node: Node
  activeFile: CodeFile
  setActiveFile: (file: CodeFile) => void
  level?: number
}) {
  const isFolder = node.children && node.children.length > 0
  const isSelected = node.codeFile === activeFile
  if (isFolder) {
    return (
      <div>
        <div className="ch-code-browser-sidebar-folder">
          <div style={{ paddingLeft: level * 1.5 + "ch" }}>
            {node.name}
          </div>
        </div>
        <SidebarNodes
          tree={node.children}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          level={level + 1}
        />
      </div>
    )
  } else {
    return (
      <div>
        <div
          className="ch-code-browser-sidebar-file"
          data-selected={isSelected}
          onClick={() => setActiveFile(node.codeFile)}
        >
          <div style={{ paddingLeft: level * 1.5 + "ch" }}>
            {node.name}
          </div>
        </div>
      </div>
    )
  }
}

function Content({ file }: { file: CodeFile }) {
  return (
    <div className="ch-code-browser-content">
      <CopyButton
        className="ch-code-browser-button"
        content={codeToText(file.code)}
      />
      {file.code.lines.map((line, i) => (
        <div key={i}>
          {line.tokens.map((token, i) => (
            <span key={i} {...token.props}>
              {token.content}
            </span>
          ))}
          <br />
        </div>
      ))}
    </div>
  )
}

type Node = {
  name: string
  codeFile: CodeFile
  children: Node[]
}
function toFileTree(files: CodeFile[]): Node[] {
  let tree = []
  for (const file of files) {
    const parts = file.name.split("/")
    let current = tree
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isLastPart = i === parts.length - 1
      const index = current.findIndex(f => f.name === part)
      if (index === -1) {
        const sub = {
          name: part,
          children: [],
          codeFile: undefined,
        }
        if (isLastPart) {
          sub.codeFile = file
        }
        current.push(sub)
        current = sub.children
      } else {
        current = current[index].children
      }
    }
  }

  tree = sortTree(tree)
  return tree
}

function sortTree(tree: Node[]): Node[] {
  for (const child of tree) {
    child.children = sortTree(child.children)
  }
  return tree.sort((a, b) => {
    const aIsFolder = a.children && a.children.length > 0
    const bIsFolder = b.children && b.children.length > 0
    if (
      (aIsFolder && bIsFolder) ||
      (!aIsFolder && !bIsFolder)
    ) {
      return a.name.localeCompare(b.name)
    }
    if (aIsFolder) {
      return -1
    }
    return 1
  })
}
