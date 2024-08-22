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
          {/* !focus(1:4) */}
          {/* !mark(1:4) */}
          <Code
            oldCode={steps[i - 1]?.code}
            newCode={step.code}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}

// !focus(1:15)
// !mark(1:15)
function Code({ oldCode, newCode }) {
  const { code, ref } =
    useTokenTransitions(
      oldCode,
      newCode,
      STEP_FRAMES,
    )
  return (
    <Pre
      ref={ref}
      code={code}
      handlers={[mark, tokenTransitions]}
    />
  )
}

const mark = {
  name: "mark",
  Block: ({ children, annotation }) => {
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
