#!/usr/bin/env python3
"""Paper figures for the ColabFold/AlphaFold2 enrichment line.

Fig A (esmfold_vs_af2.png): visualizes Table 3 — ESMFold vs AlphaFold2 on the four
  native sequences, grouped bars for pLDDT and Cα-RMSD.
Fig B (af2_native_panels.png): stitches ColabFold's own MSA-coverage and
  per-residue pLDDT plots for the four proteins into one labeled panel.
Numbers come from data_summary.csv (single source of truth).
"""
import csv, os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(HERE, "figures"), exist_ok=True)

# ---- load canonical table ----
rows = list(csv.DictReader(open(os.path.join(HERE, "data_summary.csv"))))
order = ["1L2Y", "1VII", "1PGA", "1UBQ"]
names = {"1L2Y": "Trp-cage\n(20 aa)", "1VII": "villin HP36\n(36 aa)",
         "1PGA": "protein G B1\n(56 aa)", "1UBQ": "ubiquitin\n(76 aa)"}

def get(pid, predictor, field):
    for r in rows:
        if r["stage"] == "verify_native" and r["id"] == f"{pid}_{predictor}":
            return float(r[field])
    return float("nan")

esm_pl = [get(p, "ESMFold", "mean_pLDDT") for p in order]
af2_pl = [get(p, "ColabFold", "mean_pLDDT") for p in order]
esm_rm = [get(p, "ESMFold", "CA_RMSD_A") for p in order]
af2_rm = [get(p, "ColabFold", "CA_RMSD_A") for p in order]

# ============ Figure A: ESMFold vs AF2 grouped bars ============
x = np.arange(len(order)); w = 0.38
ESM = "#4C72B0"; AF2 = "#DD8452"
figA, (a1, a2) = plt.subplots(1, 2, figsize=(11, 4.4))

b1 = a1.bar(x - w/2, esm_pl, w, label="ESMFold (single-seq)", color=ESM)
b2 = a1.bar(x + w/2, af2_pl, w, label="AlphaFold2 (MSA)", color=AF2)
a1.set_ylim(0, 105); a1.set_ylabel("mean pLDDT (confidence)")
a1.set_title("Confidence on the four native sequences")
a1.axhline(90, ls=":", c="0.5", lw=1); a1.text(3.42, 90.6, "90 = very high", fontsize=7, c="0.4", ha="right")
for b in (b1, b2):
    a1.bar_label(b, fmt="%.1f", fontsize=7, padding=1)

r1 = a2.bar(x - w/2, esm_rm, w, label="ESMFold (single-seq)", color=ESM)
r2 = a2.bar(x + w/2, af2_rm, w, label="AlphaFold2 (MSA)", color=AF2)
a2.axhline(2.0, ls="--", c="r", lw=1); a2.text(3.45, 2.06, "2 Å pass line", color="r", fontsize=7, ha="right")
a2.set_ylabel("Cα-RMSD to experimental structure (Å)")
a2.set_title("Accuracy vs experiment (lower = better)")
ymax = max(esm_rm + af2_rm) * 1.25
a2.set_ylim(0, ymax)
for b in (r1, r2):
    a2.bar_label(b, fmt="%.2f", fontsize=7, padding=1)

for ax in (a1, a2):
    ax.set_xticks(x); ax.set_xticklabels([names[p] for p in order], fontsize=8)
    ax.legend(fontsize=8, loc="upper left" if ax is a2 else "lower right")
    ax.spines[["top", "right"]].set_visible(False)

figA.suptitle("Single-sequence ESMFold vs. MSA-based AlphaFold2, both run locally GPU-free on the native sequences",
              fontsize=11, fontweight="bold")
figA.text(0.5, 0.005,
          "villin is the hardest for both predictors (2.12 vs 2.18 Å) — a property of the target, not one model;  "
          "MSA helps protein G (AF2 0.29 < ESMFold 0.49 Å).",
          ha="center", fontsize=8, style="italic", color="0.3")
figA.tight_layout(rect=[0, 0.03, 1, 0.95])
figA.savefig(os.path.join(HERE, "figures/esmfold_vs_af2.png"), dpi=160)
print("wrote figures/esmfold_vs_af2.png")

# ============ Figure B: stitch AF2 coverage + pLDDT plots ============
cf = os.path.join(HERE, "colabfold_native")
figB, axes = plt.subplots(2, 4, figsize=(15, 7))
disp = {"1L2Y": "Trp-cage (20 aa)", "1VII": "villin HP36 (36 aa)",
        "1PGA": "protein G B1 (56 aa)", "1UBQ": "ubiquitin (76 aa)"}
for j, pid in enumerate(order):
    cov = os.path.join(cf, f"{pid}_native_coverage.png")
    pl = os.path.join(cf, f"{pid}_native_plddt.png")
    for i, (img, lab) in enumerate([(cov, "MSA coverage"), (pl, "per-residue pLDDT")]):
        ax = axes[i, j]; ax.axis("off")
        if os.path.exists(img):
            ax.imshow(mpimg.imread(img))
        if i == 0:
            ax.set_title(disp[pid], fontsize=11, fontweight="bold")
        if j == 0:
            ax.text(-0.04, 0.5, lab, rotation=90, va="center", ha="right",
                    transform=ax.transAxes, fontsize=10, fontweight="bold")
figB.suptitle("Local AlphaFold2 on the four native sequences: MSA depth (top) and per-residue confidence (bottom)",
              fontsize=12, fontweight="bold")
figB.tight_layout(rect=[0.02, 0, 1, 0.96])
figB.savefig(os.path.join(HERE, "figures/af2_native_panels.png"), dpi=130)
print("wrote figures/af2_native_panels.png")
