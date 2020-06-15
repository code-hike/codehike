const api = "https://pomber.github.io/covid19/"
const DATA = api + "timeseries.json"

function useData() {
  const [data, setData] = React.useState()
  React.useEffect(() => {
    fetch(DATA)
      .then(response => response.json())
      .then(data => setData(data))
  }, [])
  return data
}

export default function HomePage() {
  const data = useData()
  if (!data) {
    return <h1>Loading...</h1>
  }
  return <h1>Hello</h1>
}
