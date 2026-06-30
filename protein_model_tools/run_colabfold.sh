#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/xiawu/Documents/innovatebio_hackathon"
COLABFOLD="$ROOT/protein_model_tools/localcolabfold/.pixi/envs/default"

export PATH="$COLABFOLD/bin:$PATH"
export MPLCONFIGDIR="$ROOT/protein_model_tools/.cache/matplotlib"
export XDG_CACHE_HOME="$ROOT/protein_model_tools/.cache"

exec colabfold_batch "$@"
