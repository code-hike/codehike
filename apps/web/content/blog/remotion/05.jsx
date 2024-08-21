import Content from "./content.md"

const Schema = Block.extend({
  steps: z.array(
    Block.extend({
      code: HighlightedCodeBlock,
    }),
  ),
})
const { steps } = parseRoot(
  Content,
  Schema,
)

const STEP_FRAMES = 60
function Video({ steps }) {
  return (
    <AbsoluteFill
      style={{
        background: "#0D1117",
        alignItems: "center",
      }}
    >
      {steps.map((step, i) => (
        <Sequence
          layout="none"
          name={step.title}
          from={STEP_FRAMES * i}
          durationInFrames={STEP_FRAMES}
        >
          <Code code={step.code} />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}

function Code({ code }) {
  return (
    <Pre code={code} handlers={mark} />
  )
}

// !focus(1:21)
const mark = {
  name: "mark",
  Block: ({ children, annotation }) => {
    // !mark
    const delay = +(annotation.query || 0)
    const frame = useCurrentFrame()
    const background = interpolateColors(
      frame,
      [delay, delay + 10],
      ["#0000", "#F2CC6044"],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    )
    return (
      <div style={{ background }}>
        {children}
      </div>
    )
  },
}

export function RemotionRoot() {
  return (
    <Composition
      id="CodeHikeExample"
      component={Video}
      defaultProps={{ steps }}
      durationInFrames={
        STEP_FRAMES * steps.length
      }
      fps={60}
      width={140}
      height={90}
    />
  )
}
