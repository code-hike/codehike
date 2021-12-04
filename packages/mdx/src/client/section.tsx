import React from "react"
import { EditorProps } from "@code-hike/mini-editor"
import { InnerCode, updateEditorStep } from "./code"

const SectionContext = React.createContext<{
  props: EditorProps
  selectedId?: string
  setFocus: (x: {
    fileName?: string
    focus: string | null
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
    focus: string | null
    id: string
  }) => {
    const newStep = updateEditorStep(state, fileName, focus)

    setState({
      ...state,
      ...newStep,
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
  const { props, setFocus } = React.useContext(
    SectionContext
  )

  const onTabClick = (filename: string) => {
    setFocus({ fileName: filename, focus: null, id: "" })
  }

  return <InnerCode {...props} onTabClick={onTabClick} />
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
