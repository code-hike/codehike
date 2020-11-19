## submodules

Add a submodule:

```bash
$ git submodule add git@github.com:code-hike/react-tutorial-demo.git external/react-tutorial-demo
```

Remove a submodule:

```bash
$ ./scripts/rm-submodule.sh react-tutorial-demo
```

## change version

Change all packages versions (will change to `0.0.0+last-commit-sha`):

```bash
$ yarn new-version
```

Or specific version:

```bash
$ yarn new-version 1.0.0
```
