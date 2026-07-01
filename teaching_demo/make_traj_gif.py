#!/usr/bin/env python3
"""Render the RFdiffusion de-novo-80aa denoising trajectory as an animated GIF.
CA ribbon, rainbow N->C, every frame Kabsch-aligned to the final fold so the
structure visibly *emerges from noise*. Styled to match the dark-teal deck."""
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation, PillowWriter
from mpl_toolkits.mplot3d.art3d import Line3DCollection

TRAJ = "rfdiff_out_80aa/traj/denovo80_0_pX0_traj_pymol.pdb"
TRB  = "rfdiff_out_80aa/denovo80_0.trb"
OUT  = "figures/denovo80_traj.gif"

BG, INK, ORANGE, TEAL, WHITE, MUTE = "#0C2429", "#0C2429", "#E29A4B", "#4C9E96", "#F4F3EE", "#8FA0A0"

# ---- parse CA per model ----
models, cur = [], []
for line in open(TRAJ):
    if line.startswith("MODEL"):
        cur = []
    elif line.startswith("ATOM") and line[12:16].strip() == "CA":
        cur.append([float(line[30:38]), float(line[38:46]), float(line[46:54])])
    elif line.startswith("ENDMDL"):
        models.append(np.array(cur))
models = [m for m in models if len(m)]
n = len(models)

def kabsch(P, Q):  # rotate P onto Q
    Pc, Qc = P - P.mean(0), Q - Q.mean(0)
    V, _, Wt = np.linalg.svd(Pc.T @ Qc)
    d = np.sign(np.linalg.det(V @ Wt))
    R = V @ np.diag([1, 1, d]) @ Wt
    return Pc @ R

ref = models[-1] - models[-1].mean(0)
aln = [kabsch(m, ref) for m in models]

pl = np.array(np.load(TRB, allow_pickle=True)["plddt"]).mean(1)
pl = pl * 100 if pl.max() <= 1 else pl

lim = np.abs(aln[-1]).max() * 0.78  # size the view to the final fold (hero frame)
L = aln[0].shape[0]
cmap = plt.get_cmap("turbo")
seg_col = [cmap(i / (L - 1)) for i in range(L - 1)]

fig = plt.figure(figsize=(5.2, 5.2), dpi=150)
fig.patch.set_facecolor(BG)
ax = fig.add_subplot(111, projection="3d")
ax.set_facecolor(BG)
# overlay axes for the confidence bar (2D patches can't sit on a 3D axes)
bar_ax = fig.add_axes([0.06, 0.10, 0.55, 0.03]); bar_ax.set_axis_off()
bar_ax.set_xlim(0, 1); bar_ax.set_ylim(0, 1)

# frame plan: hold on the finished fold at the end
order = list(range(n)) + [n - 1] * 12

def draw(fi):
    ax.clear()
    ax.set_facecolor(BG)
    idx = order[fi]
    P = aln[idx]
    segs = [[P[i], P[i + 1]] for i in range(L - 1)]
    prog = idx / (n - 1)
    lc = Line3DCollection(segs, colors=seg_col, linewidth=4 + 6 * prog, alpha=0.4 + 0.6 * prog)
    ax.add_collection3d(lc)
    ax.scatter(P[:, 0], P[:, 1], P[:, 2], c=range(L), cmap="turbo", s=14 + 26 * prog, alpha=0.3 + 0.6 * prog, edgecolors="none")
    ax.set_xlim(-lim, lim); ax.set_ylim(-lim, lim); ax.set_zlim(-lim, lim)
    ax.set_axis_off()
    ax.set_box_aspect((1, 1, 1), zoom=1.35)
    ax.view_init(elev=14, azim=(idx * 4) % 360)
    step = min(idx + 1, n)
    ax.text2D(0.04, 0.95, "RFdiffusion  ·  de novo  ·  80 aa", transform=ax.transAxes,
              color=WHITE, fontsize=12, fontweight="bold", family="DejaVu Sans")
    ax.text2D(0.04, 0.90, f"denoising step {step:>2}/{n}", transform=ax.transAxes,
              color=MUTE, fontsize=10, family="DejaVu Sans")
    # confidence bar
    p = pl[idx]
    ax.text2D(0.04, 0.05, f"confidence (pLDDT)  {p:4.0f}", transform=ax.transAxes,
              color=ORANGE, fontsize=11, fontweight="bold", family="DejaVu Sans")
    ax.text2D(0.60, 0.90, "noise  →  fold", transform=ax.transAxes,
              color=TEAL, fontsize=10, style="italic", family="DejaVu Sans")
    from matplotlib.patches import Rectangle
    bar_ax.clear(); bar_ax.set_axis_off(); bar_ax.set_xlim(0, 1); bar_ax.set_ylim(0, 1)
    bar_ax.add_patch(Rectangle((0, 0), 1, 1, color="#24454A"))
    bar_ax.add_patch(Rectangle((0, 0), p / 100, 1, color=ORANGE))
    return []

anim = FuncAnimation(fig, draw, frames=len(order), interval=90, blit=False)
anim.save(OUT, writer=PillowWriter(fps=12), savefig_kwargs={"facecolor": BG})
print("WROTE", OUT, "| frames", len(order), "| CA len", L, "| pLDDT %.0f->%.0f" % (pl[0], pl[-1]))
