import React from "react"

type Step = {
  code: string
  file: string | undefined
  lang: string
  focus: string | null
}

type StepTransition = {
  prevCode: string | null
  prevFocus: string | null
  nextCode: string | null
  nextFocus: string | null
  file: string | undefined
  lang: string
}

export { useForwardTransitions, useBackwardTransitions }

function useForwardTransitions(steps: Step[]) {
  return React.useMemo(() => {
    const transitions: StepTransition[] = steps.map(
      (step, i) => {
        let prevStepForFile: Step | null = null
        for (let j = i - 1; j >= 0; j--) {
          if (steps[j].file === step.file) {
            prevStepForFile = steps[j]
            break
          }
        }
        return {
          prevCode: prevStepForFile && prevStepForFile.code,
          prevFocus:
            prevStepForFile && prevStepForFile.focus,
          nextCode: step.code,
          nextFocus: step.focus,
          file: step.file,
          lang: step.lang,
        }
      }
    )
    const lastStep = steps[steps.length - 1]
    transitions.push({
      file: lastStep.file,
      prevCode: lastStep.code,
      prevFocus: lastStep.focus,
      nextCode: null,
      nextFocus: null,
      lang: lastStep.lang,
    })
    return transitions
  }, [steps])
}

function useBackwardTransitions(steps: Step[]) {
  return React.useMemo(() => {
    const transitions: StepTransition[] = []
    transitions.push({
      prevCode: null,
      prevFocus: null,
      nextCode: steps[0].code,
      nextFocus: steps[0].focus,
      lang: steps[0].lang,
      file: steps[0].file,
    })

    steps.forEach((step, i) => {
      let nextStepForFile: Step | null = null
      for (let j = i + 1; j < steps.length; j++) {
        if (steps[j].file === step.file) {
          nextStepForFile = steps[j]
          break
        }
      }

      transitions.push({
        prevCode: step.code,
        prevFocus: step.focus,
        nextCode: nextStepForFile && nextStepForFile.code,
        nextFocus: nextStepForFile && nextStepForFile.focus,
        lang: step.lang,
        file: step.file,
      })
    })

    return transitions
  }, [steps])
}
