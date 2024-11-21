const lean = {
  richAxis: "opacity-90",
  costAxis: "opacity-0",
  richScreenshot: "",
  leanScreenshot: "opacity-100",
  extra: "opacity-0",
  points: [
    { rich: 10, cost: 50, pop: [], className: "bg-teal-600" },
    { rich: 20, cost: 50, pop: [], className: "bg-zinc-400 dark:bg-zinc-800" },
    { rich: 30, cost: 50, pop: [], className: "bg-zinc-400 dark:bg-zinc-800" },
    { rich: 40, cost: 50, pop: [], className: "bg-zinc-400 dark:bg-zinc-800" },
    { rich: 50, cost: 50, pop: [], className: "bg-zinc-400 dark:bg-zinc-800" },
    { rich: 60, cost: 50, pop: [], className: "bg-zinc-400 dark:bg-zinc-800" },
    { rich: 70, cost: 50, pop: [], className: "bg-zinc-400 dark:bg-zinc-800" },
    { rich: 80, cost: 50, pop: [], className: "bg-zinc-400 dark:bg-zinc-800" },
    { rich: 90, cost: 50, pop: [], className: "bg-zinc-400 dark:bg-zinc-800" },
    {
      rich: 65,
      cost: 33.6,
      pop: circle(65, 40.1, 60, 2.5),
      className: "bg-purple-500 !opacity-0",
    },
    {
      rich: 75,
      cost: 47.6,
      pop: circle(75, 56.3, 60, 2.5),
      className: "bg-purple-500 !opacity-0",
    },
  ],
}

const rich = {
  leanScreenshot: "opacity-100",
  richScreenshot: "opacity-100",
  points: [{ rich: 90, className: "bg-pink-600" }],
}

const spectrum = {
  points: [
    { rich: 10, className: "bg-teal-500" },
    { rich: 20, className: "bg-cyan-500" },
    { rich: 30, className: "bg-sky-500" },
    { rich: 40, className: "bg-blue-500" },
    { rich: 50, className: "bg-indigo-500" },
    { rich: 60, className: "bg-violet-500" },
    { rich: 70, className: "bg-purple-500" },
    { rich: 80, className: "bg-fuchsia-500" },
    { rich: 90, className: "bg-pink-500" },
  ],
}

const richness = {
  leanScreenshot: "opacity-0",
  richScreenshot: "opacity-0",
}

const effort = {
  leanScreenshot: "opacity-0",
  richScreenshot: "opacity-0",
  richAxis: "opacity-30",
  costAxis: "opacity-90",
  points: [
    { rich: 10, cost: 10 },
    { rich: 20, cost: 20 },
    { rich: 30, cost: 30 },
    { rich: 40, cost: 40 },
    { rich: 50, cost: 50 },
    { rich: 60, cost: 60 },
    { rich: 70, cost: 70 },
    { rich: 80, cost: 80 },
    { rich: 90, cost: 90 },
  ],
}

const markdown = {
  points: [
    { rich: 10, cost: 10, pop: line(10, 9.9, 10.3, 24) },
    { rich: 20, cost: 10.8, pop: line(20, 10.3, 11.6, 24) },
    { rich: 30, cost: 12.9, pop: line(30, 11.6, 14.6, 24) },
    { rich: 40, cost: 16.9, pop: line(40, 14.6, 19.9, 24) },
    { rich: 50, cost: 23.6, pop: line(50, 19.9, 28.2, 24) },
    { rich: 60, pop: line(60, 55, 65, 2) },
    { rich: 70, pop: line(70, 65, 75, 3) },
    { rich: 80, pop: line(80, 75, 85, 4) },
    { rich: 90, pop: line(90, 85, 95, 12) },
  ],
}

const wall = {
  costAxis: "opacity-30",
  wall: "opacity-50 top-0 bottom-0 bg-pink-500/10 border-x-2 border-pink-500/80",
}

const distribution = {
  extra: "opacity-100",
  points: [
    { rich: 10, pop: line(10, 9.9, 10.3, 16) },
    { rich: 20, pop: line(20, 10.3, 11.6, 24) },
    { rich: 30, pop: line(30, 11.6, 14.6, 24) },
    { rich: 40, pop: line(40, 14.6, 19.9, 24) },
    { rich: 50, pop: line(50, 19.9, 28.2, 24) },
    { rich: 60, pop: line(60, 55, 65, 2) },
    { rich: 70, pop: line(70, 65, 75, 3) },
    { rich: 80, pop: line(80, 75, 85, 4) },
    { rich: 90, pop: line(90, 85, 95, 12) },
  ],
}

const wasteland = {
  wall: "opacity-50 top-0 bottom-0 right-[15%] bg-pink-500/10 border-x-2 border-pink-500/80",
  points: [
    { rich: 10, className: "bg-zinc-400 dark:bg-zinc-500" },
    { rich: 20, className: "bg-zinc-400 dark:bg-zinc-500" },
    { rich: 30, className: "bg-zinc-400 dark:bg-zinc-500" },
    { rich: 40, className: "bg-zinc-400 dark:bg-zinc-500" },
    { rich: 50, className: "bg-zinc-400 dark:bg-zinc-500" },
    // { rich: 60, className: "bg-zinc-400 dark:bg-zinc-500" },
    // { rich: 70, className: "bg-zinc-400 dark:bg-zinc-500" },
    // { rich: 80, className: "bg-zinc-400 dark:bg-zinc-500" },
    { rich: 90, className: "bg-zinc-400 dark:bg-zinc-500" },
  ],
}
const repopulating = {
  points: [
    {
      rich: 65,
      cost: 33.6,
      className:
        "bg-purple-500 data-[main=true]:opacity-0 data-[extra]:animate-appear",
    },
    {
      rich: 75,
      cost: 47.6,
      className:
        "bg-purple-500 data-[main=true]:opacity-0 data-[extra]:animate-appear",
    },
    { rich: 60, className: "bg-zinc-400 dark:bg-zinc-500" },
    { rich: 70, className: "bg-zinc-400 dark:bg-zinc-500" },
    { rich: 80, className: "bg-zinc-400 dark:bg-zinc-500" },
  ],
}
const repopulating2 = {
  extra: "",
  points: [
    {
      rich: 60,
      cost: 33.6,
      className: "bg-violet-500 data-[extra]:animate-appear",
      pop: line(60, 28.2, 40.1, 24),
    },
    {
      rich: 70,
      cost: 47.6,
      className: "bg-purple-500 data-[extra]:animate-appear",
      pop: line(70, 40.1, 56.3, 24),
    },
    {
      rich: 80,
      cost: 66.2,
      className: "bg-fuchsia-500 data-[extra]:animate-appear",
      pop: line(80, 56.3, 77.4, 24),
    },
    { rich: 90, pop: line(92.5, 77.4, 115, 24, 7.5) },
    { rich: 65, className: "!opacity-0" },
    { rich: 75, className: "!opacity-0" },
  ],
}
const why = {
  wall: "opacity-0 top-[50%] bottom-[50%]",
  points: [
    { rich: 10, className: "bg-teal-500" },
    { rich: 20, className: "bg-cyan-500" },
    { rich: 30, className: "bg-sky-500" },
    { rich: 40, className: "bg-blue-500" },
    { rich: 50, className: "bg-indigo-500" },
    { rich: 60 },
    { rich: 70 },
    { rich: 80 },
    { rich: 90, className: "bg-pink-500" },
  ],
}

export const data = merge([
  lean,
  rich,
  spectrum,
  richness,
  effort,
  markdown,
  wall,
  distribution,
  wasteland,
  repopulating,
  repopulating2,
  why,
])

function merge(rawSteps: any) {
  let prev = rawSteps[0]
  return rawSteps.map((step: any) => {
    const points = [...prev.points]
    const currentPoints = step.points || []
    currentPoints.forEach((point: any) => {
      let i = points.findIndex((p) => p.rich === point.rich)
      const prevPoint = points[i]
      const newPoint = { ...prevPoint, ...point }
      points[i] = newPoint
    })
    prev = { ...prev, ...step, points }
    return prev
  })
}

function line(richc: number, costl: number, costr: number, n: number, rd = 5) {
  return Array.from({ length: n * 2 }, (_, i) => {
    const costc = (costr + costl) / 2
    const costd = costr - costc

    let rich = 101
    let cost = 101
    while (rich > 100 || rich < 0 || cost < 0 || cost > 100) {
      const r = Math.random() * 2 - 1
      const noise = Math.random() * 2 - 1
      rich = richc + r * rd
      cost = costc + r * costd + noise * (5 + costd)
    }

    return { rich, cost }
  })
}

function circle(rich: number, cost: number, n: number, radius: number) {
  return Array.from({ length: n }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const r = radius * Math.random()
    const dx = Math.cos(angle) * r
    const dy = Math.sin(angle) * r
    return { rich: rich + dx, cost: cost + dy }
  })
}
