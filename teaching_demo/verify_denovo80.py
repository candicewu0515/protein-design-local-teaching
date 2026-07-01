#!/usr/bin/env python3
"""Verify the de-novo-80aa designs: fold-back Cα-RMSD to the RFdiffusion backbone
+ ESMFold pLDDT + pass verdict. Self-contained (no external analysis module).

  Cα atoms only, chain A, model 1, mapped by ordinal residue position.
  Superposition: Kabsch (optimal least-squares). Pass: RMSD < 2 Å AND pLDDT > 80."""
import os, csv
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
BACKBONE = os.path.join(HERE, "rfdiff_out_80aa/denovo80_0.pdb")
PREDDIR = os.path.join(HERE, "esmfold_denovo80")
MPNN_SCORE = {1: "1.14", 2: "1.10", 3: "1.07", 4: "1.16"}


def read_ca(path):
    """CA coords ordered by residue number (chain A, model 1) + raw B-factors."""
    rows, inmodel = [], True
    for line in open(path):
        if line.startswith("ENDMDL"):
            inmodel = False
        if not inmodel:
            continue
        if line.startswith("ATOM") and line[12:16].strip() == "CA":
            if line[21] not in ("A", " "):
                continue
            if line[16] not in (" ", "A"):
                continue
            rows.append((int(line[22:26]),
                         (float(line[30:38]), float(line[38:46]), float(line[46:54])),
                         float(line[60:66])))
    rows.sort(key=lambda r: r[0])
    seen, keep = set(), []
    for r in rows:
        if r[0] not in seen:
            seen.add(r[0]); keep.append(r)
    return np.array([r[1] for r in keep], float), np.array([r[2] for r in keep], float)


def pdb_plddt(path):
    _, bf = read_ca(path)
    if bf.size == 0:
        return float("nan")
    m = float(bf.mean())
    return m * 100.0 if bf.max() <= 1.5 else m


def kabsch(P, Q):
    Pc, Qc = P - P.mean(0), Q - Q.mean(0)
    V, _, Wt = np.linalg.svd(Pc.T @ Qc)
    d = np.sign(np.linalg.det(V @ Wt))
    return Pc @ (V @ np.diag([1, 1, d]) @ Wt), Qc


def metrics(pred_pdb, ref_pdb):
    P, _ = read_ca(pred_pdb)
    Q, _ = read_ca(ref_pdb)
    n = min(len(P), len(Q))
    P, Q = P[:n], Q[:n]
    Pa, Qc = kabsch(P, Q)
    d = np.sqrt(((Pa - Qc) ** 2).sum(1))
    rmsd = float(np.sqrt((d ** 2).mean()))
    L = len(Q)
    d0 = max(1.24 * (L - 15) ** (1 / 3) - 1.8, 0.5) if L > 15 else 0.5
    tm = float((1.0 / (1.0 + (d / d0) ** 2)).sum() / L)
    return rmsd, tm, n


def verdict(plddt, rmsd):
    return "self-consistent" if (plddt >= 80 and rmsd < 2.0) else "borderline"


rows = []
for i in range(1, 5):
    pred = os.path.join(PREDDIR, f"denovo80_design{i}.pdb")
    if not os.path.exists(pred):
        print("MISSING", pred); continue
    rmsd, tm, n = metrics(pred, BACKBONE)
    pl = pdb_plddt(pred)
    v = verdict(pl, rmsd)
    rows.append((i, MPNN_SCORE[i], pl, rmsd, tm, v))
    print(f"design{i}  mpnn={MPNN_SCORE[i]}  pLDDT={pl:5.1f}  CA-RMSD={rmsd:4.2f}A  TM={tm:.3f}  -> {v}")

out = os.path.join(HERE, "denovo80_verify.csv")
with open(out, "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["id", "mpnn_score", "mean_pLDDT", "CA_RMSD_A", "TMscore", "verdict"])
    for i, sc, pl, rmsd, tm, v in rows:
        w.writerow([f"denovo80_design{i}", sc, f"{pl:.1f}", f"{rmsd:.2f}", f"{tm:.3f}", v])
print("WROTE", out)
