import useSWR, { SWRConfig } from 'swr'
import { request } from 'graphql-request'

const gqlFetcher = query =>
  request('http://gql.api/user', query)

function App() {
  return (
    <SWRConfig
      value={{
        fetcher: gqlFetcher,
        revalidateOnMount: false,
        revalidateOnFocus: false,
        refreshInterval: 3000,
      }}
    >
      <Profile />
    </SWRConfig>
  )
}

function Profile() {
  const { data, error } = useSWR('{...}')

  if (error) return <div>Load error</div>
  if (!data) return <div>Loading...</div>
  return <div>Hello {data.name}!</div>
}
