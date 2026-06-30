#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/xiawu/Documents/innovatebio_hackathon"
export HF_HOME="$ROOT/protein_model_tools/.cache/huggingface"
export TRANSFORMERS_CACHE="$ROOT/protein_model_tools/.cache/huggingface/transformers"

exec "$ROOT/envs/esmfold/bin/python" "$ROOT/protein_model_tools/run_esmfold.py" "$@"
