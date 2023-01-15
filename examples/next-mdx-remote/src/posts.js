import fs from "fs"
import path from "path"

// POSTS_PATH is useful when you want to get the path to a specific file
export const POSTS_PATH = path.join(process.cwd(), "posts")

export const postNames = fs
  .readdirSync(POSTS_PATH)
  .filter((path) => /\.mdx?$/.test(path))
  .map((path) => path.replace(/\.mdx?$/, ""))
