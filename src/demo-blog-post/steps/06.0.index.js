const api = "https://pomber.github.io/covid19/"
const DATA = api + "timeseries.json"

import fetch from "node-fetch"

export async function getStaticProps() {
  const response = await fetch(DATA)
  const data = await response.json()
  return {
    props: { data },
  }
}

export default function HomePage({ data }) {
  const countries = Object.keys(data)
  const aCountry = data[countries[0]]
  const { date } = aCountry[aCountry.length - 1]
  return <h2>Coronavirus {date}</h2>
}
