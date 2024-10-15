const first = [
  { rich: 10, cost: 50, name: "readme" },
  { rich: 20, cost: 50, name: "static blog" },
  { rich: 40, cost: 50, name: "static docs" },
  { rich: 60, cost: 50, name: "interactive blog" },
  { rich: 75, cost: 50, name: "interactive tutorial" },
  { rich: 90, cost: 50, name: "landing page" },
]

const second = [
  { rich: 10, cost: 10, name: "readme" },
  { rich: 20, cost: 18, name: "static blog" },
  { rich: 40, cost: 43, name: "static docs" },
  { rich: 60, cost: 56, name: "interactive blog" },
  { rich: 75, cost: 80, name: "interactive tutorial" },
  { rich: 90, cost: 95, name: "landing page" },
]

const w = 300
const h = 200

export function Chart({ name }: { name: string }) {
  const points = name === "first" ? first : second
  // Scatter plot
  return (
    <div className="">
      <div
        style={{ width: w, height: h }}
        className="relative border-l-2 border-b-2"
      >
        {points.map(({ rich, cost }, i) => (
          <div
            key={i}
            style={{ left: `${rich}%`, bottom: `${cost}%` }}
            className="absolute w-2 h-2 bg-blue-500 rounded-full"
          />
        ))}
      </div>
    </div>
  )
}
