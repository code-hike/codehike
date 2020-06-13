const api = "https://pomber.github.io/covid19/"
const DATA = api + "timeseries.json"

import fetch from "node-fetch"

export async function getStaticProps() {
  const response = await fetch(DATA)
  const data = await response.json()
  const countries = Object.keys(data)
  const aCountry = data[countries[0]]
  const { date } = aCountry[aCountry.length - 1]
  const rows = countries
    .map(country => {
      const { deaths } = data[country].find(
        r => r.date === date
      )
      return { country, deaths }
    })
    .filter(r => r.deaths > 8)
  return {
    props: { date, rows },
  }
}

export default function HomePage({ date }) {
  return <h2>Coronavirus {date}</h2>
}
