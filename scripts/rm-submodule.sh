#!/bin/bash

# from https://stackoverflow.com/a/7646931/1325646

# Remove config entries:

git config -f .git/config --remove-section submodule.demos/$1
git config -f .gitmodules --remove-section submodule.demos/$1
git add .gitmodules

# Remove directory from index:

git rm --cached demos/$1

# Delete unused files:
rm -rf demos/$1
rm -rf .git/modules/demos/$1