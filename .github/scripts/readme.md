First:

- fill the right values in `.github/scripts/params.mjs`
- add `canary.json` to gitignore
- add `NPM_TOKEN` to secrets
- enable PR creation for Actions
  - go to https://github.com/organizations/YOUR_ORG/settings/actions and check Allow GitHub Actions to create and approve pull requests
  - then go to https://github.com/YOUR_ORG/YOUR_REPO/settings/actions and check the box that previously was grayed out

---

## pr-updated

For every new commit in a PR to `next`:

```
- build package
- if no new changeset
  - (update) comment with a link to add a changeset in the PR
- if new changeset
  - add `changeset` label to the PR
  - (update) comment with the canary install in the PR
```

## pr-merged

For every merged PR to `next` that contains the `changeset` label:

```
- find the issues closed by the PR
- for every issue
  - add a comment with the canary install
```

## push-to-next

For every push to `next`:

```
- build package
- if no changes, skip
- checkout and reset the `release` branch
- run `pnpm version-packages`
- push the `release` branch
- create or update release PR
  - body: changelog
  - labels: `release`
```

```
- create a PR from 'next' to 'main' if it doesn't exist
  - title: Update website
```

## release-pr-merged

for every `release` pr merged to `next`:

```
- run build and  `pnpm release`
- push tags
- create github release
- find all `changeset` PRs
  - find related issues
    - add comments in fixed issues
  - remove `changeset` label
```

## sponsors
