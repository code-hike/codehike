require("dotenv").config({ path: ".env.local" })

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
if (!GITHUB_TOKEN) {
  console.log("Missing process.env.GITHUB_TOKEN")
  process.exit(1)
}

async function fetchSponsors() {
  let pageInfo = { hasNextPage: true, endCursor: null }
  let sponsors = []

  while (pageInfo.hasNextPage) {
    const page = await fetchPage(pageInfo.endCursor)
    sponsors = sponsors.concat(page.nodes)
    pageInfo = page.pageInfo
  }

  return sponsors.map(({ sponsor, amountInCents }) => ({
    name: sponsor.login,
    amount: Math.round(amountInCents / 100),
  }))
}

async function fetchPage(cursor) {
  const query = `{
    organization(login: "code-hike") {
      lifetimeReceivedSponsorshipValues(first: 100, after: "${cursor}") {
        nodes {
          amountInCents
          sponsor {
            ... on User { login }
            ... on Organization { login }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }    
    }
  }`
  const r = await fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: { Authorization: "bearer " + GITHUB_TOKEN },
  })
  if (!r.ok) {
    console.error(r)
    return
  }
  const { data, errors } = await r.json()
  if (errors) {
    console.error(JSON.stringify(errors))
    return
  }
  return data.organization.lifetimeReceivedSponsorshipValues
}

module.exports = fetchSponsors
