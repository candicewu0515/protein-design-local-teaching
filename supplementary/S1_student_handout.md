# Supplementary S1 — Student Handout: Generate, then Verify

*A low-resource, fully local protein-design loop you run yourself.*

You will run the modern de novo protein-design loop on a laptop and decide, with numbers,
whether your designs "worked."

> **What "worked" means here.** A design *passes* when an independently trained structure
> predictor agrees the sequence should fold into the target shape. This is **in silico
> self-consistency — not proof the protein folds in a test tube.** Keep this distinction in
> mind throughout.

## The loop

```
  (a known backbone, or one RFdiffusion invents)
        │
        ▼
  ProteinMPNN  ──►  designs amino acid sequences for that backbone   (generation)
        │
        ▼
  ESMFold      ──►  predicts each sequence's structure               (prediction)
        │
        ▼
  Compare the predicted structure back to the backbone you started from.
```

Two model *types*, one experiment:
- **Generation** (ProteinMPNN, RFdiffusion): *many sequences → one fold.*
- **Prediction** (ESMFold): *one sequence → its structure.*

## Two numbers you will compute

| Metric | What it is | Read it as |
|---|---|---|
| **Cα RMSD** (Å) | how far the predicted structure is from the target backbone | lower = closer to the intended shape |
| **pLDDT** (0–100) | the predictor's confidence | higher = more confident |

## The rubric (a teaching cut-off, not a field standard)

| Verdict | Condition |
|---|---|
| **self-consistent** ✅ | Cα RMSD ≲ 2 Å **and** pLDDT ≳ 70 |
| **borderline** ⚠️ | one of the two is missed (e.g. RMSD 2–3 Å, or pLDDT < 70) |

> Published designability screens vary in thresholds, number of sequences sampled, and the
> folding model used. These cut-offs are for learning, not benchmarking.

## Worksheet

**Part A — Verify the verifier (sanity check).** Before trusting ESMFold, fold the four
*native* sequences and confirm it recovers their known structures.

| PDB | protein (length) | pLDDT | Cα RMSD (Å) | recovers native fold? |
|---|---|---|---|---|
| 1L2Y | Trp-cage (20 aa) | | | |
| 1VII | villin HP36 (36 aa) | | | |
| 1PGA | protein G B1 (56 aa) | | | |
| 1UBQ | ubiquitin (76 aa) | | | |

**Part B — Redesign loop.** ProteinMPNN writes new sequences for each native backbone;
ESMFold folds them; compare back to the native fold.

| Design | Seq-ID to native | pLDDT | Cα RMSD (Å) | Verdict |
|---|---|---|---|---|
| 1L2Y_design1 | | | | |
| 1PGA_design1 | | | | |
| 1PGA_design2 | | | | |
| 1UBQ_design1 | | | | |
| … | | | | |

**Part C — De novo loop.** Fold the two sequences designed for the RFdiffusion backbone and
compare to that invented backbone.

| Design | pLDDT | Cα RMSD (Å) | Verdict |
|---|---|---|---|
| denovo_design1 | | | |
| denovo_design2 | | | |

## Analysis questions

1. ProteinMPNN's sequences are often only 20–60% identical to the natural protein, yet many
   still fold back to the original shape. What does this tell you about the relationship
   between sequence and structure?
2. Two designs for the *same* backbone can land on opposite verdicts. Why do you therefore
   generate several designs and keep the ones that pass?
3. Which protein was hardest for the loop, and why might a small, frayed helical bundle be
   harder than a compact domain?
4. A design passes the rubric. List two reasons it might still **not** fold or function in a
   real cell. (Hint: what does ESMFold actually check? What does it *not* check?)
5. You ran out of memory or it was slow on a long sequence. Which step was the bottleneck,
   and what would you change to make it tractable on your laptop?

## Reference results

A completed version of every table above (the instructor's run) is in
`teaching_demo/data_summary.csv` and narrated in `teaching_demo/RESULTS.md`.
