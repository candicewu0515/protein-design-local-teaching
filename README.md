# Generate, then verify: a low-resource teaching workflow for generative protein design

This is a teaching module for the basic loop behind de novo protein design. You invent a
shape, design a sequence to fit it, then check whether that sequence actually folds back to
the shape you started with.

- **RFdiffusion** builds a backbone (a 3D shape, no sequence yet).
- **ProteinMPNN** writes amino-acid sequences for that backbone.
- **ESMFold** (or AlphaFold2) folds each sequence back, and you compare the result to the
  backbone you generated.

Students run the full loop on a free Colab GPU, and the two light steps (sequence design and
validation) also run on an ordinary laptop with no GPU. What they walk away with is a number
they can work out themselves: how close the predicted structure lands to the target backbone
(Cα RMSD) and how sure the predictor is (pLDDT). That gives "did my design work?" an answer
you can measure instead of guess.

A design is called *self-consistent* when an independently trained predictor agrees the
sequence should adopt the target fold. That is a computational check, not proof that the
protein folds in a test tube. No wet-lab validation is claimed here.

## What's in here

- [`BAMBEd_Idea_to_Explore_draft.md`](BAMBEd_Idea_to_Explore_draft.md) — the manuscript
  (*Biochemistry and Molecular Biology Education*, "An Idea to Explore" format).
- [`teaching_demo/DE_NOVO_COLAB_MANUAL.md`](teaching_demo/DE_NOVO_COLAB_MANUAL.md) — a
  step-by-step, no-code walkthrough of the whole loop on Colab, field by field.
- [`submission_notes_and_pitch.md`](submission_notes_and_pitch.md) — submission checklist and
  working notes.
- [`supplementary/`](supplementary/) — teaching materials:
  [`S1_student_handout.md`](supplementary/S1_student_handout.md) (rubric + worksheet) and
  [`S2_instructor_guide.md`](supplementary/S2_instructor_guide.md) (timeline, objective
  mapping, common failure modes).
- [`protein_model_tools/`](protein_model_tools/) — small wrapper scripts (`run_*.sh`,
  `run_esmfold.py`, `rfdiff_cpu_shim.py`). The upstream tool repos and model weights are not
  included.
- [`teaching_demo/`](teaching_demo/) — the worked example: scripts, inputs, outputs, figures,
  and a results table.
  - [`teaching_demo/data_summary.csv`](teaching_demo/data_summary.csv) — every number reported
    in the paper.
  - [`teaching_demo/METHODS_AND_REPRODUCIBILITY.md`](teaching_demo/METHODS_AND_REPRODUCIBILITY.md)
    — environment, versions, commands, and metric definitions.

## Hardware

The worked example was run on a MacBook (Apple Silicon M4 Max, 48 GB RAM). ProteinMPNN and
ESMFold run on the CPU in seconds to minutes for small proteins. RFdiffusion is the heavy
step: about 40 seconds for an 80-residue backbone on a free Colab T4 GPU, or about 3.7 minutes
on the same laptop CPU. So generation is fastest on the free GPU, but even that step stays
within reach of a laptop at the sizes used here.

## Author

Xia Wu, Department of Internal Medicine, Carver College of Medicine, University of Iowa.
ORCID: [0009-0006-9852-812X](https://orcid.org/0009-0006-9852-812X)

## License

Code: MIT. Manuscript text and figures: CC BY 4.0. See [`LICENSE`](LICENSE).
