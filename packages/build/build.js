#!/usr/bin/env node

const path = require("path")
const spawn = require("child_process").spawn

function build(args) {
  const configPath = path.resolve(
    __dirname,
    "rollup.config.js"
  )

  // console.log({ configPath, cwd: process.cwd(), args: process.argv.slice(2) });

  spawn("yarn", ["rollup", "-c", configPath, ...args], {
    stdio: "inherit",
    // cwd: "foo"
  })
}

module.exports = {
  build,
}
