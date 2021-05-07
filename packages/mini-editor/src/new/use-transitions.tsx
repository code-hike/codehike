function useEditorTransition(
  prev: EditorStep,
  next: EditorStep,
  backward: boolean
) {
  // The active file in each panel before and after:
  // +----+----+
  // | pn | nn |
  // +----+----+
  // | ps | ns |
  // +----+----+
  //
  const pn = prev.northPanel.active
  const nn = next.northPanel.active
  const ps = prev.southPanel?.active
  const ns = next.southPanel?.active

  const pnFile = prev.files.find(f => f.name === pn)!
  const nnFile = next.files.find(f => f.name === pn)!
  const psFile = ps
    ? prev.files.find(f => f.name === ps)
    : null
  const nsFile = ns
    ? prev.files.find(f => f.name === ns)
    : null

  if (pn === nn && ps === ns) {
    return {
      northChildren: (t: number) => (
        <CodeTransition
          prevFile={pnFile}
          nextFile={nnFile}
          t={t}
        />
      ),
      southChildren: (t: number) =>
        psFile && (
          <CodeTransition
            prevFile={psFile}
            nextFile={nsFile!}
            t={t}
          />
        ),
    }
  }
}

function CodeTransition({
  prevFile,
  nextFile,
  t,
}: {
  prevFile: StepFile
  nextFile: StepFile
  t: number
}) {
  return (
    <Code
      prevCode={prevFile.code}
      nextCode={nextFile.code}
      progress={t}
      language={prevFile.lang}
      prevFocus={prevFile.focus || null}
      nextFocus={nextFile.focus || null}
      minColumns={20}
      minZoom={1}
      maxZoom={1}
      horizontalCenter={false}
      parentHeight={t}
    />
  )
}
