export { fetchSponsors }

async function fetchSponsors() {
  const githubUrl = "https://api.github.com/graphql"
  const token = process.env.GITHUB_TOKEN
  const oauth = { Authorization: "bearer " + token }

  if (!token) {
    console.log("Missing process.env.GITHUB_TOKEN")
    return []
  }

  return await fetch(githubUrl, {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: oauth,
  })
    .then(function (response) {
      return response.json()
    })
    .then(({ data, errors }) => {
      if (errors) {
        console.error(JSON.stringify(errors))
        return
      }
      return data.organization.sponsorshipsAsMaintainer.nodes.map(
        node => node.sponsorEntity
      )
    })
    .catch(error => {
      console.error("Error fetching sponsors", error)
    })
}

const query = `
{
  organization(login: "code-hike") {
    sponsorshipsAsMaintainer(last: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes {
        sponsorEntity {
          ... on User {
            name
            login
            avatarUrl(size: 128)
            location
            url
          }
          ... on Organization {
            avatarUrl(size: 128)
            login
            name
            location
            url
          }
        }
      }
    }
  }
}

`
