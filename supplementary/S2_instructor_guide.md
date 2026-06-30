# Supplementary S2 — Instructor Guide

*Generate, then Verify — a low-resource, fully local teaching workflow for generative protein design.*

## Overview

Students run the **generate → inverse-fold → validate** loop (RFdiffusion → ProteinMPNN →
ESMFold) on a laptop, with no dedicated GPU, and judge their designs with an in silico
self-consistency rubric. The module was demonstrated end-to-end on a consumer Apple Silicon
laptop (M4 Max, 48 GB RAM), CPU-only.

- **Audience:** upper-division undergraduate or early-graduate.
- **Course fit:** biochemistry, structural biology, or computational biology.
- **Prerequisites:** basic command-line use; protein structure basics (primary vs. tertiary,
  the idea of a backbone). No machine-learning background; no programming beyond running
  provided scripts.

## Learning objectives → assessment mapping

| # | Objective (Bloom) | Evidence |
|---|---|---|
| 1 | Explain the generate→inverse-fold→validate paradigm; name each model's role (*Understand*) | Concept question; handout Part A/B framing |
| 2 | Install/run the pipeline locally from a pinned environment (*Apply*) | Completed run log |
| 3 | Compute & interpret the self-consistency rubric (*Analyze/Evaluate*) | Filled worksheet tables + verdicts |
| 4 | Explain why generation is the compute-limiting step; adjust to fit hardware (*Apply/Analyze*) | Analysis Q5; runtime/memory notes |
| 5 | Critique the limits of in silico validation (*Evaluate*) | Analysis Q4; reflection |

## Timeline

**Pre-work (asynchronous).** Short reading/video on diffusion models and inverse folding.
Instructor/IT pre-installs the environment and downloads model weights to the machines so the
in-class session needs no network. **Pre-compute the de novo RFdiffusion backbone** (CPU
generation is slow) so class time goes to design and analysis, not waiting.

**Session 1 — Run the loop (≈2 h).** Students do Part A (sanity check) and Part B (redesign)
on their own laptops; then run design/validation on the pre-computed de novo backbone
(Part C). Deliverable: completed run log.

**Session 2 — Judge the loop (≈2 h).** Students compute Cα RMSD/pLDDT, assign verdicts, and
present one success and one failure with a hypothesis. Use the discussion prompts below.

## Pre-class setup checklist

- [ ] Environment installed and pinned (see `teaching_demo/METHODS_AND_REPRODUCIBILITY.md` §2
      for exact versions/commits).
- [ ] Model weights downloaded once (ESMFold `facebook/esmfold_v1`; ProteinMPNN `v_48_020`;
      RFdiffusion base checkpoint).
- [ ] Reference PDBs in place (`teaching_demo/ref_pdb/`: 1L2Y, 1VII, 1PGA, 1UBQ).
- [ ] De novo backbone pre-generated (`teaching_demo/rfdiff_out/`).
- [ ] Dry-run `python teaching_demo/analyze_structures.py` to confirm it regenerates
      `data_summary.csv`.

## Common failure modes & fixes (observed)

| Symptom | Cause | Fix |
|---|---|---|
| RFdiffusion crashes on Mac: `RuntimeError: NVTX functions not installed` | Stock code calls CUDA-only NVTX profiling | Use `protein_model_tools/rfdiff_cpu_shim.py`, which no-ops `torch.cuda.nvtx.range_push/pop` before inference |
| ProteinMPNN `git_hash=unknown` in design headers | Clone failed mid-pack (`clone_mpnn.log`) so `.git` is absent | Cite the **checkpoint name `v_48_020`** as the identity; re-clone to pin an exact commit for submission |
| Structure comparison misaligns residues | Offset numbering (1VII residues 41–76) | Map Cα atoms by **ordinal position**, not raw residue number (already handled in `analyze_structures.py` §5) |
| TM-score looks "bad" on tiny proteins | TM-score's `d0` collapses for chains < ~30 aa | Use **Cα RMSD as primary** for short chains; treat TM-score as indicative only |
| Slow / out-of-memory on a longer sequence | ESMFold cost grows steeply with length; RFdiffusion CPU is the bottleneck | Keep designs short (≤ ~80 aa); pre-compute de novo backbones; a CUDA GPU is recommended beyond this teaching scale |

## Discussion prompts (with expected answers)

- *Why does ProteinMPNN not need a GPU when RFdiffusion does?* ProteinMPNN is a lightweight
  message-passing network doing a few forward passes; RFdiffusion runs many denoising steps
  through a large structure network.
- *Why did native redesigns generally fare better than de novo designs?* A natural backbone is
  known to be foldable and provides an experimental target; de novo backbones are invented and
  may be less designable.
- *A confident ESMFold prediction — is the protein real?* No. Self-consistency means a
  predictor agrees, not that the protein expresses, folds, or functions in vitro. Generation
  and prediction models can share blind spots.

## Honesty notes to convey

- This is a **computational demo, not experimental validation** (`RESULTS.md` Scope).
- **n is small (4 proteins, 20–76 aa)**; nothing generalizes to large/multidomain proteins.
- Reported numbers are **teaching examples, not a benchmark** of model performance.

## Materials map

- Student handout: `supplementary/S1_student_handout.md`
- Worked-example results: `teaching_demo/data_summary.csv`, `teaching_demo/RESULTS.md`
- Methods/versions/commands/metrics: `teaching_demo/METHODS_AND_REPRODUCIBILITY.md`
- Analysis & figures: `teaching_demo/analyze_structures.py`, `teaching_demo/make_figures.py`
- Pipeline wrappers: `protein_model_tools/run_*.sh`, `run_esmfold.py`, `rfdiff_cpu_shim.py`
