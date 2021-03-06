#!/usr/bin/env node

const [command, ...args] = process.argv.slice(2)

// console.log({ command, args })

switch (command) {
  case "build": {
    const { build } = require("./build")
    build(args)
    break
  }
  case "watch": {
    const { build } = require("./build")
    build(["--watch"])
    break
  }
  case "version": {
    const { changeVersion } = require("./version")
    changeVersion(args)
    break
  }
}
