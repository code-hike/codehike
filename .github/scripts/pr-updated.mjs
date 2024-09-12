import { Octokit } from "@octokit/action"
import { humanId } from "human-id"
import fs from "fs"
import { IDENTIFIER, PACKAGE_NAME } from "./params.mjs"
import github from "@actions/github"

const octokit = new Octokit({})
const prNumber = github.context.payload.pull_request.number

async function createOrUpdateComment(prevComment, prNumber, body) {
  if (prevComment) {
    console.log("Updating comment")
    await octokit.issues.updateComment({
      ...github.context.repo,
      comment_id: prevComment.id,
      body,
    })
  } else {
    console.log("Creating comment", prNumber)
    await octokit.issues.createComment({
      ...github.context.repo,
      issue_number: prNumber,
      body,
    })
  }
}

console.log("Listing comments", prNumber)
const { data: comments } = await octokit.issues.listComments({
  ...github.context.repo,
  issue_number: prNumber,
})
const prevComment = comments.find((comment) =>
  comment.body.startsWith(IDENTIFIER),
)
console.log("prevComment", !!prevComment)

console.log("Finding changeset")
let changedFiles = await octokit.pulls.listFiles({
  ...github.context.repo,
  pull_number: prNumber,
})
const changeset = changedFiles.data.find(
  (file) =>
    file.status === "added" &&
    /^\.changeset\/.+\.md$/.test(file.filename) &&
    file.filename !== ".changeset/README.md",
)
const hasChangesets = !!changeset
console.log({ hasChangesets })

if (!hasChangesets) {
  console.log("Getting PR")
  const pr = await octokit.pulls.get({
    ...github.context.repo,
    pull_number: prNumber,
  })
  const filename = humanId({
    separator: "-",
    capitalize: false,
  })
  const value = encodeURIComponent(`---
"${PACKAGE_NAME}": patch
---

${pr.data.title}
`)
  const repoURL = pr.data.head.repo.html_url
  const addChangesetURL = `${repoURL}/new/${pr.data.head.ref}?filename=.changeset/${filename}.md&value=${value}`
  const body = `${IDENTIFIER}
No changeset detected. If you are changing ${
    "`" + PACKAGE_NAME + "`"
  } [click here to add a changeset](${addChangesetURL}).
`
  await createOrUpdateComment(prevComment, prNumber, body)
  process.exit(0)
}

// if has changesets

console.log("Adding label")
await octokit.issues.addLabels({
  ...github.context.repo,
  issue_number: prNumber,
  labels: ["changeset"],
})

console.log("Reading canary.json")
const canary = await fs.promises.readFile("canary.json", "utf8")
console.log({ canary })
const { packages } = JSON.parse(canary)
const { name, url } = packages[0]
const body = `${IDENTIFIER}
Try ${"`" + name + "`"} from this pull request in your project with: 

${"```"}
npm i https://pkg.pr.new/${name}@${prNumber}
${"```"}
`
await createOrUpdateComment(prevComment, prNumber, body)
