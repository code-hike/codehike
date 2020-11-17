#!/bin/bash

# from https://stackoverflow.com/a/7646931/1325646

# Remove config entries:

git config -f .git/config --remove-section submodule.external/$1
git config -f .gitmodules --remove-section submodule.external/$1
git add .gitmodules

# Remove directory from index:

git rm --cached external/$1

# Delete unused files:
rm -rf external/$1
rm -rf .git/modules/external/$1