import { Octokit } from "@octokit/action"
import github from "@actions/github"
import { BASE_BRANCH } from "./params.mjs"

const octokit = new Octokit({})

console.log("Find existing PR")
const { data: prs } = await octokit.pulls.list({
  ...github.context.repo,
  state: "open",
  base: "main",
  head: `${github.context.repo.owner}:${BASE_BRANCH}`,
})
console.log("Existing PRs", prs)

const title = `✨ Update website ✨`
const body = ""

if (prs.length === 0) {
  console.log("Creating new PR")
  await octokit.rest.pulls.create({
    ...github.context.repo,
    base: "main",
    head: BASE_BRANCH,
    title,
    body,
  })
} else {
  // console.log("Updating existing PR")
  // const { number } = prs[0]
  // await octokit.rest.pulls.update({
  //   ...github.context.repo,
  //   pull_number: number,
  //   title,
  //   body,
  // })
}
