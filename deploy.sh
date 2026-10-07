#!/bin/sh
# Deploy web ke Cloudflare: hanya file yang sudah di-commit, tanpa file internal.
set -e
cd "$(dirname "$0")"
if [ -n "$(git status --porcelain)" ]; then
  echo "Ada perubahan yang belum di-commit. Commit dulu: git add -A && git commit -m \"...\""; exit 1
fi
rm -rf dist && mkdir dist
git archive HEAD | tar -x -C dist
rm -f dist/README.md dist/index-lama.html dist/wrangler.jsonc dist/deploy.sh dist/.gitignore
npx wrangler deploy
git push
