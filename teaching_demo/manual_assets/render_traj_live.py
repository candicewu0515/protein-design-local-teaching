#!/usr/bin/env python3
"""Render the LIVE Colab RFdiffusion denoising trajectory as an animated GIF
(same run as the results in the manual). CA ribbon, rainbow N->C, frames aligned
to the final fold so the structure emerges from noise; confidence bar 10 -> 98."""
import numpy as np
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation, PillowWriter
from mpl_toolkits.mplot3d.art3d import Line3DCollection
from matplotlib.patches import Rectangle

TRAJ = "../colab_run/traj_pX0.pdb"
TRB  = "../colab_run/backbone_denovo80_0.trb"
OUT  = "denovo80_traj.gif"
BG, ORANGE, TEAL, WHITE, MUTE = "#0C2429", "#E29A4B", "#4C9E96", "#F4F3EE", "#8FA0A0"

# parse CA per state (this traj uses ENDMDL, no MODEL records)
models, cur = [], []
for line in open(TRAJ):
    if line.startswith("ATOM") and line[12:16].strip() == "CA":
        cur.append([float(line[30:38]), float(line[38:46]), float(line[46:54])])
    elif line.startswith("ENDMDL"):
        if cur:
            models.append(np.array(cur)); cur = []
if cur:
    models.append(np.array(cur))
n = len(models)

def kabsch(P, Q):
    Pc, Qc = P - P.mean(0), Q - Q.mean(0)
    V, _, Wt = np.linalg.svd(Pc.T @ Qc)
    d = np.sign(np.linalg.det(V @ Wt))
    return Pc @ (V @ np.diag([1, 1, d]) @ Wt)

ref = models[-1] - models[-1].mean(0)
aln = [kabsch(m, ref) for m in models]
pl = np.array(np.load(TRB, allow_pickle=True)["plddt"]).mean(1)
pl = pl * 100 if pl.max() <= 1 else pl
lim = np.abs(aln[-1]).max() * 0.78
L = aln[0].shape[0]
segcol = [plt.get_cmap("turbo")(i / (L - 1)) for i in range(L - 1)]

fig = plt.figure(figsize=(5.2, 5.2), dpi=150); fig.patch.set_facecolor(BG)
ax = fig.add_subplot(111, projection="3d"); ax.set_facecolor(BG)
bar = fig.add_axes([0.06, 0.10, 0.55, 0.03]); bar.set_axis_off()
order = list(range(n)) + [n - 1] * 12

def draw(fi):
    ax.clear(); ax.set_facecolor(BG)
    idx = order[fi]; P = aln[idx]; prog = idx / (n - 1)
    ax.add_collection3d(Line3DCollection([[P[i], P[i + 1]] for i in range(L - 1)],
                        colors=segcol, linewidth=4 + 6 * prog, alpha=0.4 + 0.6 * prog))
    ax.scatter(P[:, 0], P[:, 1], P[:, 2], c=range(L), cmap="turbo",
               s=14 + 26 * prog, alpha=0.3 + 0.6 * prog, edgecolors="none")
    ax.set_xlim(-lim, lim); ax.set_ylim(-lim, lim); ax.set_zlim(-lim, lim)
    ax.set_axis_off(); ax.set_box_aspect((1, 1, 1), zoom=1.35)
    ax.view_init(elev=14, azim=(idx * 4) % 360)
    p = pl[idx]
    ax.text2D(0.04, 0.95, "RFdiffusion  ·  de novo  ·  80 aa", transform=ax.transAxes,
              color=WHITE, fontsize=12, fontweight="bold")
    ax.text2D(0.04, 0.90, f"denoising step {min(idx + 1, n):>2}/{n}", transform=ax.transAxes, color=MUTE, fontsize=10)
    ax.text2D(0.60, 0.90, "noise  ->  fold", transform=ax.transAxes, color=TEAL, fontsize=10, style="italic")
    ax.text2D(0.04, 0.05, f"confidence (pLDDT)  {p:4.0f}", transform=ax.transAxes, color=ORANGE, fontsize=11, fontweight="bold")
    bar.clear(); bar.set_axis_off(); bar.set_xlim(0, 1); bar.set_ylim(0, 1)
    bar.add_patch(Rectangle((0, 0), 1, 1, color="#24454A"))
    bar.add_patch(Rectangle((0, 0), p / 100, 1, color=ORANGE))
    return []

FuncAnimation(fig, draw, frames=len(order), interval=90, blit=False).save(
    OUT, writer=PillowWriter(fps=12), savefig_kwargs={"facecolor": BG})
print("WROTE", OUT, "| states", n, "| CA", L, "| pLDDT %.0f->%.0f" % (pl[0], pl[-1]))
