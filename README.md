# Generate, then Verify — a low-resource, fully local teaching workflow for generative protein design

A teaching module that runs the canonical **generate → inverse-fold → validate** loop of
de novo protein design on a laptop, without a dedicated GPU:

> **RFdiffusion** (generate a backbone) → **ProteinMPNN** (design sequences for it) →
> **ESMFold** (predict whether the sequences fold back to the intended shape)

The pedagogical centerpiece is the **in silico self-consistency (designability) screen** —
a concrete, student-computable success criterion (backbone Cα RMSD + pLDDT) that turns the
abstract question *"did the design work?"* into a calculation.

> ⚠️ **Scope:** a "self-consistent" result means an independently trained predictor agrees a
> designed sequence should adopt the target fold. This is **in silico self-consistency, not
> proof that the protein folds in a tube** — no wet-lab validation is claimed.

## Contents

- [`BAMBEd_Idea_to_Explore_draft.md`](BAMBEd_Idea_to_Explore_draft.md) — the manuscript
  (*Biochemistry and Molecular Biology Education*, "An Idea to Explore" format).
- [`submission_notes_and_pitch.md`](submission_notes_and_pitch.md) — submission checklist and
  editor pitch (working notes).
- [`teaching_demo/`](teaching_demo/) — the worked example: scripts, inputs, outputs, figures,
  and a machine-readable results table.
  - [`teaching_demo/RESULTS.md`](teaching_demo/RESULTS.md) — narrated results with teaching points.
  - [`teaching_demo/data_summary.csv`](teaching_demo/data_summary.csv) — every reported number.
  - [`teaching_demo/METHODS_AND_REPRODUCIBILITY.md`](teaching_demo/METHODS_AND_REPRODUCIBILITY.md)
    — environment, versions, commands, metric definitions.

## Hardware

The worked example was run end-to-end on a consumer Apple Silicon laptop (M4 Max, 48 GB RAM),
CPU-only, no CUDA GPU. ProteinMPNN and ESMFold run comfortably on CPU for small proteins;
RFdiffusion's generation step is the compute-limiting part and a CUDA GPU is recommended for
anything beyond small demonstrations.

## Author

Xia Wu — Department of Internal Medicine, Carver College of Medicine, University of Iowa.
ORCID: [0009-0006-9852-812X](https://orcid.org/0009-0006-9852-812X)

## License

Code: MIT. Manuscript text and figures: CC BY 4.0. See [`LICENSE`](LICENSE).
