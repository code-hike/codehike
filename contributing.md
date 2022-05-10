## Files and Folders

- `packages/mdx`: the npm package
- `packages/mdx/vite.config.js`: we only use vite for testing with vitest
- `packages/mdx/rollup.config.js`: rollup builds the thing we release to npm
- `packages/mdx/next.config.js`: we have a nextjs testing site, our poor man's storybook
- `packages/mdx/pages`: the pages for the nextjs test site
- `packages/mdx/dev`: code and content used by the nextjs test site
- `packages/mdx/src/remark`: the code that runs at build time when you compile an mdx file
- `examples`: a list of examples, most of them use the Code Hike version from `packages/mdx/dist`
- `examples/bundle-test`: this one is used by `.github/workflows/bundle-analysis.yml`
