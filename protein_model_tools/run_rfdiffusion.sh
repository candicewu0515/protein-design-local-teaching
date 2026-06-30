#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/xiawu/Documents/innovatebio_hackathon"
RFD="$ROOT/protein_model_tools/RFdiffusion"

export DGLBACKEND=pytorch
export XDG_CACHE_HOME="$ROOT/protein_model_tools/.cache"

cd "$RFD"
exec "$ROOT/envs/rfdiffusion-mac/bin/python" scripts/run_inference.py "$@"
