#!/usr/bin/env node

const path = require("path")
const { spawnSync } = require("child_process")

function build(args) {
  const configPath = path.resolve(
    __dirname,
    "rollup.config.js"
  )

  const p = spawnSync(
    "yarn",
    ["rollup", "--silent", "-c", configPath, ...args],
    { stdio: "inherit" }
  )

  process.exitCode = p.status
}

module.exports = {
  build,
}
