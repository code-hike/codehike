import fs from "fs"
import { getExecOutput } from "@actions/exec"
import { pushTags } from "./git-utils.mjs"
import { PACKAGE_DIR, PUBLISH_COMMAND } from "./params.mjs"
import github from "@actions/github"
import { getChangelogEntry } from "./md-utils.mjs"
import { Octokit } from "@octokit/action"

const cwd = process.cwd()
const octokit = new Octokit({})

console.log("Writing .npmrc")
await fs.promises.writeFile(
  `${process.env.HOME}/.npmrc`,
  `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}\n`,
)

console.log("Running publish command")
const [publishCommand, ...publishArgs] = PUBLISH_COMMAND.split(/\s+/)
const output = await getExecOutput(publishCommand, publishArgs, { cwd })
if (output.exitCode !== 0) {
  console.error(output.stderr)
  process.exit(1)
}
const published = !output.stdout.includes("No unpublished projects to publish")
console.log(`Published: ${published}`)

console.log("Pushing tags")
await pushTags()

console.log("Creating GitHub release")
const pkg = JSON.parse(
  await fs.promises.readFile(`${PACKAGE_DIR}/package.json`, "utf8"),
)
const changelog = await fs.promises.readFile(
  `${PACKAGE_DIR}/CHANGELOG.md`,
  "utf8",
)
const entry = getChangelogEntry(changelog, pkg.version)
const tag = `${pkg.name}@${pkg.version}`
await octokit.rest.repos.createRelease({
  ...github.context.repo,
  name: tag,
  tag_name: tag,
  body: entry.content,
})

console.log("Getting all released issues")
const query = `query ($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    pullRequests(first: 100, labels: ["changeset"], states: MERGED) {
      edges {
        node {
          number
          closingIssuesReferences(first: 10) {
            nodes {
              number
            }
          }
        }
      }
    }
  }
}`
const { repository } = await octokit.graphql(query, github.context.repo)
const prNumbers = repository.pullRequests.edges.map(({ node }) => node.number)
const issueNumbers = repository.pullRequests.edges.flatMap(({ node }) =>
  node.closingIssuesReferences.nodes.map(({ number }) => number),
)

console.log("Commenting issues", issueNumbers)
await Promise.all(
  issueNumbers.map(async (number) => {
    const commentBody = `🚀 Released in ${"`" + tag + "`"} 🚀

If this was helpful, consider **[sponsoring Code Hike](https://github.com/sponsors/code-hike?metadata_source=Issue)**. Your contribution helps sustain open-source work.

Thanks for using Code Hike!`

    await octokit.issues.createComment({
      ...github.context.repo,
      issue_number: number,
      body: commentBody,
    })
  }),
)

console.log("Updating PRs", prNumbers)
await Promise.all(
  prNumbers.map(async (number) => {
    await octokit.issues.removeLabel({
      ...github.context.repo,
      issue_number: number,
      name: "changeset",
    })
  }),
)
