import React from "react"
import { EditorProps } from "@code-hike/mini-editor"
import { Code } from "./code"

const SectionContext = React.createContext<{
  props: EditorProps
  selectedId?: string
  setFocus: (x: {
    fileName?: string
    focus: string
    id: string
  }) => void
  resetFocus: () => void
}>({
  props: null!,
  setFocus: () => {},
  resetFocus: () => {},
})

export function Section({
  children,
  ...props
}: {
  children: React.ReactNode
}) {
  const [state, setState] = React.useState<any>(props)

  const resetFocus = () => setState(props)

  const setFocus = ({
    fileName,
    focus,
    id,
  }: {
    fileName?: string
    focus: string
    id: string
  }) => {
    const name = fileName || state.northPanel.active

    const newFiles = state.files.map((file: any) =>
      file.name === name ? { ...file, focus } : file
    )

    let northPanel = { ...state.northPanel }
    let southPanel = state.southPanel && {
      ...state.northPanel,
    }
    if (state.northPanel.tabs.includes(name)) {
      northPanel.active = name
    } else if (southPanel) {
      southPanel.active = name
    }

    setState({
      ...state,
      files: newFiles,
      northPanel,
      southPanel,
      selectedId: id,
    })
  }

  const { selectedId, ...rest } = state

  return (
    <SectionContext.Provider
      value={{
        props: rest,
        setFocus,
        resetFocus,
        selectedId,
      }}
    >
      <section>{children}</section>
    </SectionContext.Provider>
  )
}

export function SectionCode() {
  const { props } = React.useContext(SectionContext)
  return <Code {...props} />
}

export function SectionLink({
  focus,
  file,
  children,
  id,
}: {
  focus: string
  id: string
  file?: string
  children: React.ReactNode
}) {
  const {
    setFocus,
    resetFocus,
    selectedId,
  } = React.useContext(SectionContext)

  const isSelected = selectedId === id
  const handleClick = isSelected
    ? resetFocus
    : () => setFocus({ fileName: file, focus, id })

  return (
    <span
      style={{
        textDecoration: "underline",
        textDecorationStyle: "dotted",
        cursor: "pointer",
        backgroundColor: isSelected ? "yellow" : undefined,
      }}
      onClick={handleClick}
      children={children}
    />
  )
}
