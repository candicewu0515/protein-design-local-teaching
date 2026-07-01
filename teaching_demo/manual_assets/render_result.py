#!/usr/bin/env python3
"""Overlay the best AlphaFold-validated design (rainbow) on the RFdiffusion
backbone (grey) from the live Colab run — shows the design lands on the shape."""
import numpy as np
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Line3DCollection

BB = "../colab_run/backbone_denovo80_0.pdb"
BEST = "../colab_run/best.pdb"
OUT = "live_result_overlay.png"

def ca(path):
    xs = []
    for l in open(path):
        if l.startswith("ATOM") and l[12:16].strip() == "CA" and l[21] in "A ":
            xs.append([float(l[30:38]), float(l[38:46]), float(l[46:54])])
    return np.array(xs)

def kabsch(P, Q):
    Pc, Qc = P - P.mean(0), Q - Q.mean(0)
    V, _, Wt = np.linalg.svd(Pc.T @ Qc)
    d = np.sign(np.linalg.det(V @ Wt))
    R = V @ np.diag([1, 1, d]) @ Wt
    return Pc @ R, Qc

B, D = ca(BB), ca(BEST)
n = min(len(B), len(D)); B, D = B[:n], D[:n]
Da, Bc = kabsch(D, B)
rmsd = float(np.sqrt(((Da - Bc) ** 2).sum(1).mean()))

fig = plt.figure(figsize=(6.2, 5.0), dpi=150)
fig.patch.set_facecolor("white")
ax = fig.add_subplot(111, projection="3d"); ax.set_facecolor("white")
# backbone: grey tube
segB = [[Bc[i], Bc[i + 1]] for i in range(n - 1)]
ax.add_collection3d(Line3DCollection(segB, colors="#b9c0c6", linewidth=7, alpha=0.85))
# design: rainbow tube
cmap = plt.get_cmap("turbo")
segD = [[Da[i], Da[i + 1]] for i in range(n - 1)]
ax.add_collection3d(Line3DCollection(segD, colors=[cmap(i / (n - 2)) for i in range(n - 1)], linewidth=4.5, alpha=0.98))
lim = np.abs(Bc).max() * 0.98
ax.set_xlim(-lim, lim); ax.set_ylim(-lim, lim); ax.set_zlim(-lim, lim)
ax.set_axis_off(); ax.set_box_aspect((1, 1, 1), zoom=1.08); ax.view_init(elev=20, azim=60)
ax.text2D(0.02, 0.97, "Best design (AlphaFold) on the RFdiffusion backbone", transform=ax.transAxes,
          fontsize=12, fontweight="bold", color="#202124")
ax.text2D(0.02, 0.05, f"grey = generated backbone   ·   rainbow = validated design   ·   Cα-RMSD = {rmsd:.2f} Å",
          transform=ax.transAxes, fontsize=10.5, color="#5f6368")
fig.savefig(OUT, facecolor="white", bbox_inches="tight", pad_inches=0.15)
print("WROTE", OUT, "| CA", n, "| RMSD %.2f" % rmsd)
