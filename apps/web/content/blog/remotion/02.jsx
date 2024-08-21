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
          {/* !focus */}
          {/* !mark */}
          <Code code={step.code} />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}

// !focus(1:3)
// !mark(1:3)
function Code({ code }) {
  return <Pre code={code} />
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
