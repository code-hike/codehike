#!/usr/bin/env node

const path = require("path");
const spawn = require("child_process").spawn;

const configPath = path.resolve(__dirname, "rollup.config.js");

// console.log({ configPath, cwd: process.cwd(), args: process.argv.slice(2) });

spawn("yarn", ["rollup", "-c", configPath, ...process.argv.slice(2)], {
  stdio: "inherit",
  // cwd: "foo"
});
