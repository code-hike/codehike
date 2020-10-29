type Step = {
  code: string
  file: string | undefined
  lang: string
}

type StepTransition = {
  prevCode: string | null
  nextCode: string | null
  file: string | undefined
  lang: string
}

export { getForwardSteps, getBackwardSteps }

function getForwardSteps(steps: Step[]) {
  const transitions: StepTransition[] = steps.map(
    (step, i) => {
      let prevCode = null
      for (let j = i - 1; j >= 0; j--) {
        if (steps[j].file === step.file) {
          prevCode = steps[j].code
          break
        }
      }
      return {
        prevCode,
        nextCode: step.code,
        file: step.file,
        lang: step.lang,
      }
    }
  )
  const lastStep = steps[steps.length - 1]
  transitions.push({
    file: lastStep.file,
    prevCode: lastStep.code,
    nextCode: null,
    lang: lastStep.lang,
  })
  return transitions
}

function getBackwardSteps(steps: Step[]) {
  const transitions: StepTransition[] = []
  transitions.push({
    prevCode: null,
    nextCode: steps[0].code,
    lang: steps[0].lang,
    file: steps[0].file,
  })

  steps.forEach((step, i) => {
    let nextCode = null
    for (let j = i + 1; j < steps.length; j++) {
      if (steps[j].file === step.file) {
        nextCode = steps[j].code
        break
      }
    }

    transitions.push({
      prevCode: step.code,
      nextCode,
      lang: step.lang,
      file: step.file,
    })
  })

  return transitions
}
