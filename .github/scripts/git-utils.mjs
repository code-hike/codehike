import { exec, getExecOutput } from "@actions/exec"
import github from "@actions/github"
import fs from "fs"

export async function checkout(branch) {
  let { stderr } = await getExecOutput("git", ["checkout", branch], {
    ignoreReturnCode: true,
  })
  let isCreatingBranch = !stderr
    .toString()
    .includes(`Switched to a new branch '${branch}'`)
  if (isCreatingBranch) {
    await exec("git", ["checkout", "-b", branch])
  }
}

export async function resetBranch() {
  // reset current branch to the commit that triggered the workflow
  await exec("git", ["reset", `--hard`, github.context.sha])
}

export async function commitAll(message) {
  await exec("git", ["add", "."])
  await exec("git", ["commit", "-m", message])
}

export async function forcePush(branch) {
  await exec("git", ["push", "origin", `HEAD:${branch}`, "--force"])
}

export async function setupUser() {
  await exec("git", ["config", "user.name", `"github-actions[bot]"`])
  await exec("git", [
    "config",
    "user.email",
    `"github-actions[bot]@users.noreply.github.com"`,
  ])
  await fs.promises.writeFile(
    `${process.env.HOME}/.netrc`,
    `machine github.com\nlogin github-actions[bot]\npassword ${process.env.GITHUB_TOKEN}`,
  )
}

export async function pushTags() {
  await exec("git", ["push", "origin", "--tags"])
}
