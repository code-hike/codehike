import useSWR from 'swr'
import fetch from 'unfetch'

const fetcher = url =>
  fetch(url).then(r => r.json())

function Profile() {
  const { data, error } = useSWR(
    '/api/user',
    fetcher
  )

  if (error) return <div>Load error</div>
  if (!data) return <div>Loading...</div>
  return <div>Hello {data.name}!</div>
}
