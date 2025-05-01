# MD Test Suite

All the `*.0.mdx` files in this directory are tests

Add the snapshots you are interested in testing to the `snapshots` array in the frontmatter of the mdx file:

```md
---
syntaxHighlight: github-light
snapshots:
  - before-remark
  - after-remark
  - after-rehype
  - before-recma-compiled-js
  - before-recma-compiled-jsx
  - before-recma-compiled-function
  - before-recma-js
  - before-recma-js-dev
  - before-recma-jsx
  - after-recma-js
  - after-recma-js-dev
  - after-recma-jsx
  - compiled-js
  - compiled-js-dev
  - compiled-jsx
  - compiled-function
  - parsed-jsx
  - rendered
  - rendered-dev
---
```

## Errors

If there are errors in the test, it will be snapshoted in the `testname.1.error.md` file

## Running only one test:

filter by test name: `pnpm watch -t foo` and then `r` to rerun the current test

## TODO

- rerun tests when md file changes
- remove carriage returns from snapshots
