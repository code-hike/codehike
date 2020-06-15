const api = "https://pomber.github.io/covid19/"
const DATA = api + "timeseries.json"

import fetch from "node-fetch"

export async function getStaticProps() {
  const response = await fetch(DATA)
  const data = await response.json()
  const countries = Object.keys(data)
  const aCountry = data[countries[0]]
  const { date } = aCountry[aCountry.length - 1]
  return {
    props: { date },
  }
}

export default function HomePage({ date }) {
  return <h2>Coronavirus {date}</h2>
}
