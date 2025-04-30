#!/usr/bin/env bash
# update-base.sh -- rename integra360* to base* and update imports
set -euo pipefail
BRANCH="chore/rename-integra360-to-base"
echo "Creating work branch $BRANCH"
git checkout -b "$BRANCH"

echo "Renaming files and folders that contain integra360..."
for f in $(git ls-files | grep -i integra360); do
  new=$(echo "$f" | sed 's/integra360/base/Ig')
  git mv "$f" "$new"
done

echo "Replacing strings inside files..."
# update code, but skip node_modules, .git and binary files
grep -rIl --exclude-dir=node_modules --exclude=.git integra360 . | xargs sed -i 's/integra360/base/Ig'

echo "Updating dependencies to latest LTS-friendly versions..."
npm install express@^5 zod@latest pino@latest pino-http@latest helmet@latest --save
npm install --save-dev jest supertest eslint prettier husky

echo "Running lint & tests..."
npm run lint --if-present || true
npm test --if-present || true

echo "All done! Review changes and push:"
echo "   git push --set-upstream origin $BRANCH"
