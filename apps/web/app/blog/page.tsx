import Link from "next/link"
import { blog } from "../source"

export default function BlogIndex() {
  const month = getMonths()

  return (
    <main className="max-w-md mx-auto my-12 min-h-screen">
      {month.map((m) => (
        <MonthGroup key={m.month + m.year} month={m} />
      ))}
    </main>
  )
}

function MonthGroup({ month }: { month: Month }) {
  const date = new Date(month.year, month.month, 1)
  return (
    <div className="mb-12">
      <h2 className="text-sm text-primary/60 mb-4 px-4 uppercase">
        {date.toLocaleString("default", { month: "long" })} {month.year}
      </h2>
      {month.pages.map((page) => (
        <Link
          href={page.url}
          key={page.url}
          className="block hover:bg-primary/10 p-4 rounded-md"
        >
          <h2 className="text-xl font-bold text-pretty">{page.data.title}</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-pretty">
            {page.data.description}
          </p>
        </Link>
      ))}
    </div>
  )
}

export function generateMetadata() {
  return {
    title: "Blog | Code Hike",
    description: "Code Hike's blog",
  }
}

type Month = {
  month: number
  year: number
  pages: ReturnType<typeof blog.getPages>
}

function getMonths(): Month[] {
  const pages = blog.getPages().filter((page) => page.data.draft !== true)
  const months: ReturnType<typeof getMonths> = []

  pages.forEach((page) => {
    const date = page.data.date
    const month = date.getMonth()
    const year = date.getFullYear()

    const existingMonth = months.find(
      (m) => m.month === month && m.year === year,
    )
    if (existingMonth) {
      existingMonth.pages.push(page)
    } else {
      months.push({
        month,
        year,
        pages: [page],
      })
    }
  })

  // Sort months
  months.sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year
    }
    return b.month - a.month
  })

  // Sort pages in each month
  months.forEach((month) => {
    month.pages.sort((a, b) => {
      return b.data.date.getTime() - a.data.date.getTime()
    })
  })

  return months
}
