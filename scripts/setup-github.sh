#!/bin/bash
# Run this after: sudo xcodebuild -license
# Creates GitHub repo and pushes ircost

set -e
cd "$(dirname "$0")/.."

# Check Xcode license
if ! git --version &>/dev/null; then
  echo "Error: Git requires Xcode license. Run: sudo xcodebuild -license"
  exit 1
fi

# Init and commit if needed
if [ ! -d .git ]; then
  git init
  git add .
  git commit -m "Initial commit: Iran War Cost Tracker with Sanity CMS"
fi

# Create repo and push (requires gh CLI: brew install gh && gh auth login)
if command -v gh &>/dev/null; then
  gh repo create ircost --public --source=. --push --description "Iran War Cost Tracker - Live estimate of U.S. taxpayer spending on military operations"
  echo "Done! Repo: https://github.com/$(gh api user -q .login)/ircost"
else
  echo "GitHub CLI (gh) not found. Install: brew install gh && gh auth login"
  echo "Then run: gh repo create ircost --public --source=. --push"
  echo ""
  echo "Or create repo manually at https://github.com/new?name=ircost"
  echo "Then: git remote add origin https://github.com/YOUR_USERNAME/ircost.git"
  echo "      git branch -M main && git push -u origin main"
fi
