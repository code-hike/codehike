const api = "https://pomber.github.io/covid19/"
const DATA = api + "timeseries.json"
const FLAGS = api + "countries.json"

import fetch from "node-fetch"

export async function getStaticProps() {
  const [data, flags] = await Promise.all([
    fetch(DATA).then(r => r.json()),
    fetch(FLAGS).then(r => r.json()),
  ])
  const countries = Object.keys(data)
  const aCountry = data[countries[0]]
  const { date } = aCountry[aCountry.length - 1]
  const rows = countries
    .map(country => {
      const { deaths } = data[country].find(
        r => r.date === date
      )
      const flag = flags[country]?.flag || "❓"
      return { country, deaths, flag }
    })
    .filter(r => r.deaths > 8)
  return {
    props: { date, rows },
  }
}

import { TreeMap } from "@nivo/treemap"

export default function HomePage({ date, rows }) {
  return (
    <>
      <h2>Coronavirus {date}</h2>
      <TreeMap
        tile="binary"
        colorBy="flag"
        colors={{ scheme: "pastel2" }}
        labelSkipSize={9}
        label={({ value, flag }) => (
          <tspan
            style={{ fontSize: 10 + value / 200 }}
            dominantBaseline="central"
            children={flag}
          />
        )}
        tooltip={r =>
          `${r.value} deaths in ${r.id}`
        }
        root={{ children: rows }}
        identity="country"
        value="deaths"
        width={402}
        height={190}
        innerPadding={1}
      />
    </>
  )
}
