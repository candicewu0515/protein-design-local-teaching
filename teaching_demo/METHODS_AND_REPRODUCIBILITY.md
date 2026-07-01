# Methods & Reproducibility

This supplement records everything needed to regenerate every number and figure in
the write-up from the scripts in this directory. It is written to journal-supplement
standard for a **computational technical note / education protocol** — there is no
wet-lab experiment here; all "validation" is *in silico* self-consistency (see
[Scope and limitations](#scope-and-limitations)).

## 1. Hardware & operating system
| Item | Value |
|---|---|
| Machine | Apple M4 Max |
| RAM | 48 GB |
| OS | macOS 26.5.1 (build 25F80) |
| Accelerator | none used — all models ran on **CPU** (ColabFold log: `no GPU detected, will be using CPU`); ESMFold on CPU/MPS. No CUDA GPU. |

## 2. Software versions & pinning
| Tool | Role | Version / checkpoint | Commit | Env lock |
|---|---|---|---|---|
| ColabFold (AlphaFold2) | predict (MSA-based) | colabfold **1.6.1** | `0ff47949` | `localcolabfold/pixi.lock` |
| localcolabfold installer | install | — | `9101b99` | — |
| JAX | ColabFold backend | 0.5.0 | — | pixi.lock |
| ESMFold | predict (single-seq) | `facebook/esmfold_v1` (HF transformers) | — | `envs/` (conda) |
| ProteinMPNN | generate sequence | model `v_48_020`, seed 37, T=0.1 | clone incomplete¹ | — |
| RFdiffusion | generate backbone | default base ckpt | `2d0c003` | `RFdiffusion/` |
| Python (analysis) | metrics | 3.12.12 | — | pixi env |
| numpy | metrics | 2.1.3 | — | — |

¹ The ProteinMPNN `git clone` failed mid-pack (`clone_mpnn.log`: `fetch-pack: invalid index-pack output`), so the `.git` is absent and the design header records `git_hash=unknown`. The code is vendored under `protein_model_tools/ProteinMPNN/` and the **checkpoint name `v_48_020` is the citable identity**. For a journal submission, re-clone to pin an exact commit.

## 3. Inputs (experimental structures)
Reference structures downloaded from the RCSB PDB; chain **A** only. PDB header
deposition dates:

| PDB | protein | length (chain A) | residue numbering | deposited |
|---|---|---|---|---|
| 1L2Y | Trp-cage | 20 | 1–20 | 25-FEB-2002 |
| 1VII | villin HP36 | 36 | **41–76** | 15-JAN-1997 |
| 1PGA | protein G B1 | 56 | 1–56 | 23-NOV-1993 |
| 1UBQ | ubiquitin | 76 | 1–76 | 02-JAN-1987 |

> Note the offset numbering of 1VII (41–76). This is why structure comparison maps
> CA atoms by **ordinal position**, not by raw residue number (§5).

## 4. Commands (entry points)
All wrappers live in `protein_model_tools/`; outputs land in `teaching_demo/`.

```bash
# --- ESMFold (prediction half), native + designed sequences ---
protein_model_tools/run_esmfold.sh   # -> teaching_demo/esmfold_out/, esmfold_designed/

# --- ProteinMPNN (generation): 2 seqs/backbone, seed 37, T=0.1, model v_48_020 ---
#     (driver in protein_model_tools/; designs -> teaching_demo/seqs/designed8.fasta)

# --- RFdiffusion (de novo backbone), CPU via NVTX no-op shim ---
protein_model_tools/run_rfdiffusion.sh   # 80 aa, 50 steps (~3.7 min on laptop CPU; ~40 s on free Colab T4)

# --- ColabFold / AlphaFold2 on the 4 native sequences (this work) ---
cd protein_model_tools
./run_colabfold.sh --num-recycle 3 --num-seeds 1 --num-models 5 \
    ../teaching_demo/seqs/native4.fasta ../teaching_demo/colabfold_native
#   model-type auto -> alphafold2_ptm; MSA = MMseqs2 remote API (mmseqs2_uniref_env);
#   no Amber relax; rank by pLDDT.

# --- Unified metrics table (regenerates data_summary.csv) ---
cd teaching_demo
python analyze_structures.py
```

### Mac-specific reproducibility finding (RFdiffusion)
RFdiffusion's stock code calls CUDA-only **NVTX** profiling and crashes on a Mac
(`RuntimeError: NVTX functions not installed`; see `rfdiff_out/rfdiff.log`). It runs
on Apple-Silicon CPU only after no-op'ing those calls — done non-invasively by
`protein_model_tools/rfdiff_cpu_shim.py`, which patches
`torch.cuda.nvtx.range_push/range_pop` to no-ops before handing off to
`scripts/run_inference.py` (success log: `rfdiff_out/rfdiff_shim.log`).

## 5. Structure-comparison metrics (`analyze_structures.py`)
- **Atoms:** CA only, chain A, model 1 (NMR ensembles → first model).
- **Residue mapping:** the two structures in every comparison are a *single chain of
  identical length in 1:1 sequence correspondence*, so CA atoms are mapped by
  **ordinal position after sorting by residue number**. This is mandatory because
  experimental chains may use offset numbering (1VII = 41–76). `n_aligned` is
  reported and any length mismatch is flagged (none beyond min()).
- **Superposition:** Kabsch (optimal least-squares on the mapped CA pairs).
- **CA_RMSD_A:** RMSD after Kabsch superposition.
- **TMscore:** Σ 1/(1+(dᵢ/d0)²) / L_ref, d0 = 1.24·(L_ref−15)^(1/3) − 1.8 (floored at
  0.5), L_ref = reference length. This is a **fixed-superposition (Kabsch)**
  approximation, *not* TM-align's rotation-optimized score; reported for
  scale-awareness. ⚠️ TM-score's d0 collapses for very short chains, so for the
  ≤36-aa cases (Trp-cage, villin) **CA-RMSD is the primary metric** and TM-score is
  only indicative (e.g. Trp-cage RMSD 0.51 Å but TM 0.55).
- **mean_pLDDT:** ESMFold stores per-residue confidence as a **0–1 B-factor → ×100**;
  ColabFold pLDDT and pTM are read from the rank_001 `*_scores_rank_001_*.json`
  (already 0–100 / 0–1). Auto-scaling in code: B-factor ≤ 1.5 ⇒ ×100.

## 6. Output map
| Path | Contents |
|---|---|
| `ref_pdb/` | experimental PDBs (1L2Y, 1VII, 1PGA, 1UBQ) |
| `esmfold_out/` | ESMFold predictions of native sequences |
| `esmfold_designed/` | ESMFold predictions of ProteinMPNN redesigns |
| `colabfold_native/` | ColabFold/AF2 predictions of native sequences (5 models each) |
| `rfdiff_out_80aa/` | RFdiffusion de novo backbone (`denovo80_0.pdb`) |
| `denovo80_mpnn/` | ProteinMPNN sequences for the de novo backbone |
| `esmfold_denovo80/` | ESMFold predictions of the de novo designs |
| `seqs/` | `native4.fasta`, `designed8.fasta`, `denovo80_designs.fasta` |
| `data_summary.csv` | **unified metrics table** (every claimed number) |
| `analyze_structures.py` | regenerates `data_summary.csv` |
| `make_figures.py` | overlay + scatter figures |

## Scope and limitations
1. **This is a computational demo, not experimental validation.** Every "verified" /
   "self-consistent" verdict means *an independent predictor agrees the sequence
   should adopt the target fold* — it does **not** show the protein folds in a tube.
2. **n is small and the size range is narrow** (4 proteins, 20–76 aa). Numbers do not
   generalize to larger proteins, multidomain proteins, or complexes.
3. **Orthogonality, not ground truth.** ProteinMPNN (generation) and ESMFold/AF2
   (prediction) are independently trained, which is what makes their agreement
   informative — but two models can share blind spots.
4. **Metric caveats** as in §5 (TM-score unreliable < ~30 aa; fixed-superposition).
5. **Runtimes are CPU-bound and not optimized**; the same pipeline is far faster on a
   CUDA GPU and is the recommended setup for anything beyond this teaching scale.
