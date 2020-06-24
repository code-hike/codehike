import useSWR, { SWRConfig } from 'swr'
import { request } from 'graphql-request'
import { Suspense } from 'react'

const gqlFetcher = query =>
  request('http://gql.api/user', query)

function App() {
  return (
    <SWRConfig
      value={{
        fetcher: gqlFetcher,
        suspense: true,
      }}
    >
      <Suspense
        fallback={<div>Loading...</div>}
      >
        <Profile />
      </Suspense>
    </SWRConfig>
  )
}

function Profile() {
  const { data } = useSWR('{ ... }')
  return <div>Hello {data.name}!</div>
}
