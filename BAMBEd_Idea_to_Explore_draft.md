# An Idea to Explore: Teaching Generative Protein Design with a Low-Resource Local Workflow

Xia Wu^1,\*

^1^Department of Internal Medicine, Carver College of Medicine, University of Iowa, Iowa City, IA, USA

\*Corresponding author: xwu76@uiowa.edu · ORCID: 0009-0006-9852-812X

## Abstract

Generative deep learning has, in a few years, become a standard tool of protein engineering, and biochemistry and molecular biology curricula are moving quickly to introduce it. The dominant teaching vehicle is the cloud notebook, which hides the underlying pipeline, depends on rationed free GPU quotas, and can stop working when a runtime resets or an institution blocks the service. Here we describe, as an idea to explore, a low-resource local teaching workflow that runs the canonical "generate → inverse-fold → validate" loop of de novo protein design on consumer Apple Silicon laptop-class hardware, without a dedicated GPU. RFdiffusion generates a backbone, ProteinMPNN designs sequences for it, and ESMFold predicts whether those sequences fold back to the intended shape. The pedagogical centerpiece is the in silico self-consistency (designability) screen, a concrete, student-computable criterion that turns the otherwise abstract question "did the design work?" into a calculation. We report a small worked example run end-to-end on consumer Apple Silicon laptop-class hardware (CPU-only, no discrete GPU), spanning four native backbones (20–76 residues) and one 30-residue de novo backbone with two designed sequences; it was tested on consumer Apple Silicon hardware, with Windows/Linux instructions provided where dependencies support them. A CUDA GPU accelerates and scales the workflow but is not required to meet the learning objectives. We outline measurable objectives, a two-session module, anticipated obstacles, and a path for others to evaluate the idea's effectiveness. The approach is offered as a transparent, equity-minded alternative to cloud-based instruction; it has not yet been formally assessed.

**Keywords:** protein design; generative AI; deep learning; RFdiffusion; ProteinMPNN; ESMFold; bioinformatics education; low-resource computing; reproducibility

## The idea

The 2024 Nobel Prize in Chemistry recognized computational protein structure prediction and design, and the tools behind it—AlphaFold, RoseTTAFold, RFdiffusion, ProteinMPNN—are now routine in research and industry. Curricula are racing to introduce them, but the dominant instructional vehicle is the cloud notebook: a hosted environment (typified by ColabFold and related Google Colab notebooks [4]) that hides installation, runs on borrowed GPUs, and works only until a quota expires, a runtime resets, or a network or institutional policy blocks the service. Students click "Run" and watch a structure appear, but they rarely see where computation happens, what hardware it demands, or how to judge whether a designed protein is any good.

The idea we propose to explore is deliberately modest: **run the whole pipeline on a machine the student already has.** Rather than a cloud demo, students install and run a complete generative protein-design loop—backbone generation, sequence design, and structure-based validation—on a single laptop, at small scale, without a dedicated GPU. The pedagogical payoff is not only independence from the cloud; it is that *making the computation local makes the computation visible.* Students see why one model needs heavy compute while another runs comfortably on a CPU, confront the real limits of their hardware, and—most importantly—apply a concrete, quantitative criterion to decide whether their own designs succeeded.

## Why this matters pedagogically

Three recurring problems with cloud-based AI instruction motivate a local alternative:

1. **Equity and access.** Free cloud GPU tiers are rationed and unpredictable; students with weaker connectivity, or at institutions behind restrictive firewalls, are disadvantaged. A workflow that runs on consumer laptop-class hardware, and that can be pre-installed on shared departmental machines, lets an entire cohort participate in a network-free lab session.
2. **Transparency.** When installation and model weights are abstracted away, students cannot see that "AI" is software with dependencies, memory footprints, and runtimes. Installing and running it locally turns a black box into an inspectable system—an explicit course outcome rather than an accident.
3. **Reproducibility and data control.** A pinned local environment (a single conda or container specification with fixed versions) gives every student and every semester the same software stack, unlike a cloud backend that changes silently. For students working with unpublished sequences, after a one-time setup the activity runs without sending data off the machine.

A small but growing set of teaching resources brings AI structure tools into biochemistry classrooms—e.g., a module built around AlphaFold2 for structure *prediction* [5], open notebook collections such as DL4Proteins [6], and reflective treatments of teaching bioinformatics with generative AI [7]. What is comparatively underexplored is a unit that (a) covers *generative design*, not only prediction; (b) is engineered to run on *low-resource, GPU-free* hardware; and (c) centers a *computable success metric* students apply to their own output. That combination is the idea offered here.

## The science students need (and learn)

Modern de novo design is a three-step loop, and each step maps to a distinct, teachable concept:

- **Generation (the "what shape?" step).** RFdiffusion is a denoising diffusion model fine-tuned from the RoseTTAFold structure-prediction network; from random noise it produces a protein *backbone*—a plausible 3D fold—optionally conditioned on constraints such as a binding target or symmetry [1]. Conceptually it is the structural analog of an image diffusion model. Crucially, RFdiffusion outputs only geometry (a poly-glycine trace): it proposes a shape but no sequence.
- **Inverse folding (the "which sequence?" step).** ProteinMPNN takes a fixed backbone and predicts amino acid sequences likely to fold into it—the *inverse* of structure prediction [2]. It is fast, lightweight, and (a point students find surprising) runs perfectly well on a CPU. Students learn that one backbone admits many sequences, and that design is a one-to-many problem.
- **Validation (the "did it work?" step).** ESMFold, a single-sequence language-model–based structure predictor, folds each designed sequence and asks whether the predicted structure matches the backbone we started from [3]. Because it needs no multiple-sequence alignment, ESMFold is fast and self-contained—well suited to a closed-loop classroom exercise.

### The teachable centerpiece: in silico self-consistency

The conceptual heart of the module is the **self-consistency (designability) screen**, a widely used in silico proxy for "is this design likely to fold?" [1]. The loop is compact and entirely assessable:

> backbone (RFdiffusion) → N candidate sequences (ProteinMPNN) → re-predict each structure (ESMFold) → compare back to the original backbone.

Two numbers summarize the outcome:

- **Self-consistency RMSD (scRMSD):** the smallest backbone Cα RMSD between the starting structure and the ESMFold re-predictions of the designed sequences.
- **pLDDT:** ESMFold's per-residue confidence.

For the classroom we adopt a **practical rubric adapted from common designability screens**—labeling a design *self-consistent* when, for example, backbone Cα RMSD to the target is on the order of < 2 Å with pLDDT above ~70, and *borderline* otherwise—while stating plainly that these are pedagogical cut-offs, not an absolute field standard; published screens vary in thresholds, number of sequences sampled, and the folding model used. This single criterion converts a vague question ("did my protein work?") into a calculation students perform and defend—a clean opportunity to teach quantitative reasoning and the meaning and pitfalls of confidence scores.

Two honest caveats are themselves part of the lesson. First, self-consistency pipelines often use AlphaFold2 as the folding oracle. We use ESMFold as the primary verifier because, as a single-sequence model needing no alignment, it is the fastest to run locally; a local AlphaFold2 (via ColabFold) can be run alongside it so students see the single-sequence vs. MSA-based contrast directly [4]. ESMFold is generally less accurate than AlphaFold2, especially on de novo sequences, so a self-consistent verdict here is weaker evidence than in a research screen [3]. Second, and more fundamentally, the screen validates self-consistency, **not** real-world function: an in silico pass is a hypothesis, not a working protein [1]. Teaching both caveats explicitly inoculates students against over-reading the result.

## A small worked example on a laptop

To show the workflow is real rather than aspirational, we ran it end-to-end on consumer laptop-class hardware with no discrete GPU—a consumer Apple Silicon laptop (M4 Max, 48 GB RAM)—with RFdiffusion, ProteinMPNN, and ESMFold all executed on CPU. It was tested on macOS; Windows/Linux instructions can be provided where dependencies support them. The example is deliberately small and is bundled with the module so instructors can reproduce or pre-compute it.

It separates the loop into two parts that exercise different concepts and different hardware demands:

- **Native-backbone redesign (the primary hands-on track).** Because RFdiffusion's generation step needs heavy compute, the dependable everyday track redesigns four real backbones of increasing size: Trp-cage (PDB 1L2Y, 20 aa), the villin headpiece subdomain (1VII, 36 aa), the B1 domain of protein G (1PGA, 56 aa), and ubiquitin (1UBQ, 76 aa). ProteinMPNN writes two new sequences for each native backbone and ESMFold refolds them. Using natural proteins gives a measurable target and a built-in positive control—a healthy pipeline should recover sequences whose ESMFold predictions return close to the native fold. This entire track needs no GPU: ProteinMPNN and ESMFold run on CPU in seconds-to-minutes for proteins this size. Before trusting ESMFold as a verifier, students first confirm it reproduces the four native structures from their real sequences (in our run, pLDDT 88–92 and Cα RMSD 0.5–0.8 Å, except the villin headpiece at 2.1 Å—a genuinely harder, frayed helical bundle).
- **De novo generation (the harder, honest case).** One 30-residue backbone is generated with RFdiffusion from noise; ProteinMPNN then designs two sequences for it, each validated through the same loop. Here students see the genuinely difficult case, where a self-consistent verdict is less certain and failures are common and instructive.

For each design students record backbone RMSD to the starting structure and ESMFold pLDDT, and classify it against the classroom rubric (Table 2). Pedagogically, the contrast is the point: the native cases anchor expectations, while the de novo cases reveal how much harder de novo design is than redesign.

> **Note on RFdiffusion without CUDA.** RFdiffusion's reference implementation targets NVIDIA/CUDA hardware. To run GPU-free we execute it through a CPU-only path, which is slow and practical only for very small backbones (roughly 20–40 residues; in our example a 30-residue de novo backbone took about 0.8 min on a laptop CPU). This is a real limitation, and we treat it as a teaching point rather than hide it: it concretely demonstrates why generative backbone design is the compute-hungry step, and why a CUDA GPU is recommended for any work beyond small demonstrations—while the rest of the loop (ProteinMPNN, ESMFold) remains comfortable on commodity hardware.

**Table 1. The three tools, their role in the loop, and their compute demands on a laptop.**

| Tool | Role in the loop | Compute demand on a commodity laptop |
|---|---|---|
| RFdiffusion | Generates the backbone — proposes a 3D shape (geometry only, no sequence) | Heaviest step. Runs CPU-only for very small backbones (~20–40 aa) and is slow; a CUDA GPU is recommended for anything larger. |
| ProteinMPNN | Inverse folding — designs amino acid sequences for a fixed backbone | Light. Runs on CPU in seconds; no GPU needed. |
| ESMFold | Validation — folds each designed sequence (single-sequence, no MSA) to compare back to the starting backbone | Moderate. Runs on CPU in minutes for small proteins (≤ ~80 aa); memory and time grow steeply with sequence length. |

**Table 2. Worked-example results (laptop CPU, GPU-free).** ProteinMPNN wrote two sequences per backbone; ESMFold folded each and it was compared to its reference structure (the native fold for redesigns; the RFdiffusion backbone for de novo). Cα RMSD is the primary metric; verdicts follow the classroom rubric.

| Track | Design | Protein (length) | Seq-ID to native | pLDDT | Cα RMSD (Å) | Verdict |
|---|---|---|---|---|---|---|
| Redesign | 1L2Y_design1 | Trp-cage (20 aa) | 40% | 90.7 | 0.53 | self-consistent |
| Redesign | 1L2Y_design2 | Trp-cage (20 aa) | 40% | 90.6 | 0.58 | self-consistent |
| Redesign | 1VII_design1 | villin HP36 (36 aa) | 25% | 75.6 | 2.95 | borderline |
| Redesign | 1VII_design2 | villin HP36 (36 aa) | 19% | 72.8 | 2.31 | borderline |
| Redesign | 1PGA_design1 | protein G B1 (56 aa) | 62% | 85.3 | 2.91 | borderline |
| Redesign | 1PGA_design2 | protein G B1 (56 aa) | 55% | 93.6 | 0.35 | self-consistent |
| Redesign | 1UBQ_design1 | ubiquitin (76 aa) | 53% | 93.4 | 0.77 | self-consistent |
| Redesign | 1UBQ_design2 | ubiquitin (76 aa) | 57% | 93.3 | 0.90 | self-consistent |
| De novo | denovo_design1 | de novo (30 aa) | — | 90.5 | 0.27 | self-consistent |
| De novo | denovo_design2 | de novo (30 aa) | — | 78.7 | 0.40 | borderline |

The contrast students are meant to notice: ProteinMPNN's sequences are only 19–62% identical to the natural protein yet most still fold back to the original shape (many sequences, one fold); two designs from the *same* 1PGA backbone landed on opposite verdicts (0.35 Å vs 2.91 Å), motivating why one samples several designs and filters; and the villin headpiece is consistently the hardest case—a built-in "where the loop struggles" lesson rather than a failure to hide. These values are intended as teaching examples, not a benchmark of model performance.

## Proposed learning objectives

Written with backward design and Bloom's taxonomy so each is observable and assessable. By the end of the module, students will be able to:

1. **Explain** the generate → inverse-fold → validate paradigm and identify which model performs each step (*Understand*).
2. **Install and run** the three-tool pipeline locally from a pinned environment specification—after initial installation and model download, without relying on cloud notebooks (*Apply*).
3. **Compute and interpret** the self-consistency screen (scRMSD, pLDDT) to classify their own designs against a stated rubric (*Analyze/Evaluate*).
4. **Explain** why generative backbone design is the compute-limiting step, and **adjust** design length and parameters to fit available hardware (*Apply/Analyze*).
5. **Critique** the limits of in silico validation—distinguishing self-consistency from experimentally verified function, and ESMFold from a research-grade oracle (*Evaluate*).

## Proposed classroom implementation

A two-session unit for an upper-division undergraduate or early-graduate course in biochemistry, structural biology, or computational biology. **Prerequisite knowledge:** basic command-line use and familiarity with protein structure (primary vs. tertiary structure, the idea of a backbone); no machine-learning background is assumed, and no programming beyond running provided scripts is required.

**Pre-work (asynchronous).** A short reading or video on diffusion models and inverse folding; the instructor (or IT) pre-installs the pinned environment and downloads model weights to the shared or student machines so the in-class session needs no network. Because CPU generation is slow, the instructor pre-computes the de novo backbones so class time is spent on design and analysis, not waiting.

**Session 1 — Run the loop (≈2 h, lab).** Students redesign the native backbones with ProteinMPNN and refold with ESMFold on their own laptops (CPU), then run the design/validation steps on the pre-computed de novo backbones, recording runtimes and any memory limits they hit. Deliverable: a completed run log.

**Session 2 — Judge the loop (≈2 h).** Students compute scRMSD/pLDDT, classify their designs with the rubric, and present one success and one failure with a hypothesis for the failure. Discussion prompts: Why might a confident ESMFold prediction still be wrong experimentally? Why did the native redesigns generally fare better than the de novo designs? Why does ProteinMPNN not need a GPU when RFdiffusion does?

**Supporting materials (supplementary).** A pinned environment specification, annotated scripts/notebooks for each step (environment check → ProteinMPNN redesign → ESMFold validation → RFdiffusion de novo demo), the worked-example inputs and outputs, a student handout with the designability rubric, and an instructor guide listing common failure modes.

## Anticipated challenges and how to address them

- **Installation friction / dependency conflicts.** Mitigated by shipping a single pinned environment and pre-downloaded weights; students *read* the specification (a transparency outcome) but are not asked to debug toolchains from scratch.
- **Slow CPU generation.** RFdiffusion on CPU is the bottleneck; we constrain de novo work to very small backbones and pre-compute them before class so analysis never waits on a slow run.
- **Memory limits.** Reframed from bug to lesson: a guided exercise on why folding cost grows steeply with sequence length, and how shortening designs keeps them tractable on commodity hardware.
- **Conceptual overreach.** Explicitly and repeatedly separate in silico self-consistency from experimental validation, and ESMFold from a research-grade folding oracle, to prevent the misconception that a passing design is a working protein.

## How the idea could be evaluated

As an idea to explore, this module has not yet been formally assessed. We propose that adopters evaluate it with: pre/post concept inventories on the design paradigm and on confidence-score interpretation (objectives 1, 3, 5); rubric-scored run logs and analyses (objectives 2–4); and a short attitudes survey on self-efficacy and access compared with prior cloud-based exercises. Adoption across a range of student-owned machines would also test the central practical claim—that the workflow is genuinely portable to low-resource hardware.

## Conclusion

Generative protein design is becoming core content in molecular bioscience education, but teaching it through opaque cloud notebooks trades understanding and access for convenience. We offer, as an idea to explore, a low-resource local workflow that runs the complete generate–design–validate loop on consumer laptop-class hardware and makes its own success criterion computable by students. By relocating the computation to a machine students can see and control, the module turns the constraints of real hardware—and the discipline of an in silico success metric—into the lesson itself. We invite instructors to adopt, stress-test, and assess it.

## Data and code availability

All scripts, inputs, outputs, the worked-example results table, and the supplementary student
handout (S1) and instructor guide (S2) are openly available at
https://github.com/candicewu0515/protein-design-local-teaching. Code is released under the MIT
License and written materials under CC BY 4.0. Software versions, commits, commands, and metric
definitions are recorded in `teaching_demo/METHODS_AND_REPRODUCIBILITY.md`.

## References

1. Watson JL, Juergens D, Bennett NR, et al. De novo design of protein structure and function with RFdiffusion. *Nature*. 2023;620:1089–1100. doi:10.1038/s41586-023-06415-8
2. Dauparas J, Anishchenko I, Bennett N, et al. Robust deep learning–based protein sequence design using ProteinMPNN. *Science*. 2022;378:49–56. doi:10.1126/science.add2187
3. Lin Z, Akin H, Rao R, et al. Evolutionary-scale prediction of atomic-level protein structure with a language model. *Science*. 2023;379:1123–1130. doi:10.1126/science.ade2574
4. Mirdita M, Schütze K, Moriwaki Y, Heo L, Ovchinnikov S, Steinegger M. ColabFold: making protein folding accessible to all. *Nature Methods*. 2022;19:679–682. doi:10.1038/s41592-022-01488-1
5. Boland DJ, Ayres NM. Cracking AlphaFold2: leveraging the power of artificial intelligence in undergraduate biochemistry curriculums. *PLOS Computational Biology*. 2024;20(6):e1012123. doi:10.1371/journal.pcbi.1012123
6. Chungyoun M, Au G, Carpentier B, Puvada S, Thomas C, Gray JJ. DL4Proteins Jupyter notebooks teach how to use artificial intelligence for biomolecular structure prediction and design. *arXiv* preprint arXiv:2511.02128; 2025.
7. Teufel AI, Liberles DA. Teaching bioinformatics with generative AI: judgment, uncertainty, and responsibility. *Journal of Microbiology & Biology Education*. 2026;27:e00331-25. doi:10.1128/jmbe.00331-25
