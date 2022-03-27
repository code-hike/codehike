import React from "react"
import { EditorProps } from "../mini-editor"
import { InnerCode, updateEditorStep } from "./code"

const SectionContext = React.createContext<{
  props: EditorProps
  setFocus: (x: {
    fileName?: string
    focus: string | null
    id: string
  }) => void
}>({
  props: null!,
  setFocus: () => {},
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
    <section>
      <SectionContext.Provider
        value={{
          props: rest,
          setFocus,
        }}
      >
        <LinkableSection
          onActivation={setFocus}
          onReset={resetFocus}
        >
          {children}
        </LinkableSection>
      </SectionContext.Provider>
    </section>
  )
}

export function SectionCode() {
  const { props, setFocus } =
    React.useContext(SectionContext)

  const onTabClick = (filename: string) => {
    setFocus({ fileName: filename, focus: null, id: "" })
  }

  return <InnerCode {...props} onTabClick={onTabClick} />
}

// ---

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
  const { activate, reset, activatedId } =
    React.useContext(LinkableContext)

  const isSelected = activatedId === id
  // const handleClick = isSelected
  //   ? resetFocus
  //   : () => setFocus({ fileName: file, focus, id })

  return (
    <span
      className="ch-section-link"
      data-active={isSelected}
      // onClick={handleClick}
      children={children}
      onMouseOver={() =>
        activate({ fileName: file, focus, id })
      }
      onMouseOut={reset}
    />
  )
}

const LinkableContext = React.createContext<{
  activate: (x: {
    fileName?: string
    focus: string | null
    id: string
  }) => void
  reset: () => void
  activatedId: string | undefined
}>({
  activatedId: undefined,
  activate: () => {},
  reset: () => {},
})

export function LinkableSection({
  onActivation,
  onReset,
  children,
}: {
  onActivation: (x: {
    fileName?: string
    focus: string | null
    id: string
  }) => void
  onReset: () => void
  children: React.ReactNode
}) {
  const [activatedId, setActivatedId] =
    React.useState<any>(undefined)

  const activate = React.useCallback(
    x => {
      setActivatedId(x.id)
      onActivation(x)
    },
    [onActivation]
  )
  const reset = React.useCallback(() => {
    setActivatedId(undefined)
    onReset()
  }, [onReset])

  return (
    <LinkableContext.Provider
      value={{
        activate,
        reset,
        activatedId,
      }}
    >
      {children}
    </LinkableContext.Provider>
  )
}
