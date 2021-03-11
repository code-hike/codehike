#!/usr/bin/env node

const path = require("path")
const spawn = require("child_process").spawn

function build(args) {
  const configPath = path.resolve(
    __dirname,
    "rollup.config.js"
  )

  spawn("yarn", ["rollup", "-c", configPath, ...args], {
    stdio: "inherit",
    // cwd: "foo"
  })
}

module.exports = {
  build,
}
