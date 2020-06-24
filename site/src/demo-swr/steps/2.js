import useSWR from 'swr'
import { request } from 'graphql-request'

const gqlFetcher = query =>
  request('http://gql.api/user', query)

function Profile() {
  const { data, error } = useSWR(
    '{ ... }',
    gqlFetcher
  )

  if (error) return <div>Load error</div>
  if (!data) return <div>Loading...</div>
  return <div>Hello {data.name}!</div>
}
