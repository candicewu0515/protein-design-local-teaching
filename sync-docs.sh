#!/usr/bin/env bash
# Regenerate the MkDocs site source (docs/) from the authoring home (teaching_demo/).
# Edit teaching_demo/DE_NOVO_COLAB_MANUAL.md, then run this, then commit + push.
set -euo pipefail
cd "$(dirname "$0")"

SRC=teaching_demo
mkdir -p docs/manual_assets docs/colab_run

cp "$SRC/DE_NOVO_COLAB_MANUAL.md" docs/index.md
cp "$SRC"/manual_assets/*.png "$SRC"/manual_assets/*.gif docs/manual_assets/
cp "$SRC"/colab_run/mpnn_results.csv "$SRC"/colab_run/design.fasta "$SRC"/colab_run/best.pdb docs/colab_run/

echo "synced docs/ from $SRC/  ($(find docs -type f | wc -l | tr -d ' ') files)"
