import { Octokit } from "@octokit/action"
import { IDENTIFIER, PACKAGE_NAME } from "./params.mjs"
import github from "@actions/github"

const octokit = new Octokit({})
const prNumber = github.context.payload.pull_request.number

console.log("Querying closing issues")
const query = `query ($owner: String!, $repo: String!, $prNumber: Int!) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $prNumber) {
      title
      state
      closingIssuesReferences(first: 10) {
        nodes {
          number
        }
      }
    }
  }
}`
const result = await octokit.graphql(query, {
  ...github.context.repo,
  prNumber: Number(prNumber),
})

const body = `${IDENTIFIER}
This issue has been fixed but not yet released.

Try it in your project before the release with:

${"```"}
npm i https://pkg.pr.new/${PACKAGE_NAME}@${prNumber}
${"```"}

Or wait for the next [release](https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/pulls?q=is%3Aopen+is%3Apr+label%3Arelease).
`

console.log("Commenting issues")
await Promise.all(
  result.repository.pullRequest.closingIssuesReferences.nodes.map(
    async ({ number }) => {
      console.log("Commenting issue", number)
      await octokit.issues.createComment({
        ...github.context.repo,
        issue_number: number,
        body,
      })
    },
  ),
)
