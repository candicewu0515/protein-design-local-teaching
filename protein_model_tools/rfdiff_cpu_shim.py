#!/usr/bin/env python3
"""Run RFdiffusion on a CUDA-less Mac by no-op'ing CUDA NVTX profiling calls,
then hand control to scripts/run_inference.py via Hydra. Non-invasive: patches
at runtime, does not edit RFdiffusion source."""
import sys, runpy, contextlib
import torch

# --- no-op the NVTX profiling markers that assume a CUDA build ---
def _noop(*a, **k):
    return None

@contextlib.contextmanager
def _noop_ctx(*a, **k):
    yield

if hasattr(torch, "cuda") and hasattr(torch.cuda, "nvtx"):
    torch.cuda.nvtx.range_push = _noop
    torch.cuda.nvtx.range_pop = _noop
    try:
        torch.cuda.nvtx.range = _noop_ctx
    except Exception:
        pass

# Hydra reads CLI args from sys.argv[1:]; drop this shim's own name.
sys.argv = ["scripts/run_inference.py"] + sys.argv[1:]
runpy.run_path("scripts/run_inference.py", run_name="__main__")
