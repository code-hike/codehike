import React from "react"
import {
  PlayerHandle,
  Step,
  Video,
  VideoProps,
} from "./video"

const VideoWrapper = React.forwardRef(WrapperWithRef)

export { VideoWrapper }

function WrapperWithRef(
  {
    steps,
    onTimeChange = () => {},
    onStepChange = () => {},
    ...props
  }: VideoProps,
  parentRef: React.Ref<PlayerHandle>
) {
  const stepGroups = useStepGroups(
    steps,
    onTimeChange,
    onStepChange
  )
  return (
    <Video
      {...props}
      ref={parentRef}
      steps={stepGroups.steps}
      onTimeChange={stepGroups.onTimeChange}
      onStepChange={stepGroups.onStepChange}
    />
  )
}

function useStepGroups(
  steps: Step[],
  onTimeChange: VideoProps["onTimeChange"],
  onStepChange: VideoProps["onStepChange"]
) {
  const groupedSteps = React.useMemo(
    () => getGroupedSteps(steps),
    [steps]
  )

  const [
    currentGroupedStepIndex,
    setCurrentGroupedStepIndex,
  ] = React.useState(0)
  const currentSteps =
    groupedSteps[currentGroupedStepIndex].steps

  const handleTimeChange = React.useCallback(
    (time: number, prevTime: number) => {
      onStepChange &&
        currentSteps.forEach(({ stepIndex, start }) => {
          if (prevTime < start && start <= time) {
            onStepChange(stepIndex)
          }
        })
      onTimeChange && onTimeChange(time, prevTime)
    },
    [onTimeChange, onStepChange, currentSteps]
  )

  const handleStepChange = React.useCallback(
    (newGroupedStepIndex: number) => {
      const newGroupedStep =
        groupedSteps[newGroupedStepIndex]
      setCurrentGroupedStepIndex(newGroupedStepIndex)
      const newStepIndex = newGroupedStep.steps[0].stepIndex
      onStepChange && onStepChange(newStepIndex)
    },
    [groupedSteps, setCurrentGroupedStepIndex, onStepChange]
  )

  return {
    steps: groupedSteps,
    onTimeChange: handleTimeChange,
    onStepChange: handleStepChange,
  }
}

type GroupedStep = Step & {
  steps: { stepIndex: number; start: number }[]
}

function getGroupedSteps(steps: Step[]): GroupedStep[] {
  const groupedSteps: GroupedStep[] = []
  steps.forEach((step, i) => {
    const lastStep = groupedSteps[groupedSteps.length - 1]
    if (
      lastStep &&
      lastStep.src === step.src &&
      lastStep.end === step.start
    ) {
      lastStep.end = step.end
      lastStep.steps.push({
        stepIndex: i,
        start: step.start,
      })
    } else {
      groupedSteps.push({
        ...step,
        steps: [{ stepIndex: i, start: step.start }],
      })
    }
  })

  return groupedSteps
}
