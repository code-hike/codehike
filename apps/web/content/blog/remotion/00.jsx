// !mark 2
import Content from "./content.md"

// !f

import {
  parseRoot,
  Block,
} from "code-hike/blocks"
import { z } from "zod"

const Schema = Block.extend({
  steps: z.array(Block),
})

// !mark(1:4) 4
const { steps } = parseRoot(
  Content,
  Schema,
)

import {
  AbsoluteFill,
  Sequence,
  Composition,
} from "remotion"

const STEP_FRAMES = 60
function Video({ steps }) {
  return (
    <AbsoluteFill
      style={{ background: "#0D1117" }}
    >
      {/* !mark(1:10) 0 */}
      {steps.map((step, i) => (
        <Sequence
          layout="none"
          name={step.title}
          from={STEP_FRAMES * i}
          durationInFrames={STEP_FRAMES}
        >
          {step.children}
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}

export function RemotionRoot() {
  return (
    <Composition
      id="CodeHikeExample"
      component={Video}
      defaultProps={{ steps }}
      width={300}
      height={200}
      fps={60}
      durationInFrames={
        STEP_FRAMES * steps.length
      }
    />
  )
}
