import React from "react"
import { InnerCode, updateEditorStep } from "./code"
import {
  CodeConfigProps,
  EditorStep,
  ElementProps,
  GlobalConfig,
} from "../core/types"

const SectionContext = React.createContext<{
  codeConfigProps: CodeConfigProps
  editorStep: EditorStep
  setFocus: (x: {
    fileName?: string
    focus: string | null
    id: string
  }) => void
}>({
  codeConfigProps: {},
  editorStep: null!,
  setFocus: () => {},
})

type SectionProps = {
  globalConfig: GlobalConfig
  children: React.ReactNode
  editorStep: EditorStep
} & CodeConfigProps &
  ElementProps

export function Section({
  children,
  className,
  style,
  editorStep,
  ...codeConfigProps
}: SectionProps) {
  const [state, setState] = React.useState<any>(editorStep)

  const resetFocus = () => setState(editorStep)

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
    <section
      className={`ch-section ${className || ""}`}
      style={style}
    >
      <SectionContext.Provider
        value={{
          codeConfigProps,
          editorStep: rest,
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

export function SectionCode({
  globalConfig,
  ...codeConfigProps
}: { globalConfig: GlobalConfig } & CodeConfigProps &
  ElementProps) {
  const section = React.useContext(SectionContext)

  const onTabClick = (filename: string) => {
    section.setFocus({
      fileName: filename,
      focus: null,
      id: "",
    })
  }

  return (
    <InnerCode
      editorStep={section.editorStep}
      globalConfig={globalConfig}
      codeConfigProps={{
        ...section.codeConfigProps,
        ...codeConfigProps,
      }}
      onTabClick={onTabClick}
    />
  )
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
