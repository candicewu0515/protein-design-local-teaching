#!/usr/bin/env python3
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

GEN="#1a9850"; PRED="#2b6cb0"; INK="#222"
fig,ax=plt.subplots(figsize=(12.5,4.6)); ax.set_xlim(0,100); ax.set_ylim(0,46); ax.axis("off")

# grouping bands
def band(x0,x1,color,label):
    ax.add_patch(FancyBboxPatch((x0,9),x1-x0,26,boxstyle="round,pad=0.4,rounding_size=2",
                 fc=color+"14",ec=color,lw=1.4))
    ax.text((x0+x1)/2,37.5,label,ha="center",va="center",fontsize=11,fontweight="bold",color=color)
band(15.5,55.5,GEN,"GENERATION  (make a protein)")
band(58.5,79.5,PRED,"PREDICTION  (read a protein)")

def box(x,title,sub,ec):
    ax.add_patch(FancyBboxPatch((x,15),17,15,boxstyle="round,pad=0.3,rounding_size=1.5",
                 fc="white",ec=ec,lw=2))
    ax.text(x+8.5,25.5,title,ha="center",va="center",fontsize=10.5,fontweight="bold",color=INK)
    ax.text(x+8.5,19.5,sub,ha="center",va="center",fontsize=8.5,color="#555")

box(0.5,"Design spec","length / target\nbackbone","#888")
box(18.0,"RFdiffusion","noise → backbone","#1a9850")
box(37.0,"ProteinMPNN","backbone → sequence","#1a9850")
box(60.0,"AlphaFold2 /\nESMFold","sequence → structure","#2b6cb0")
box(82.5,"Verify","pLDDT, Cα-RMSD\npass: pLDDT>80,\nRMSD<2 Å","#b8860b")

def arrow(x0,x1):
    ax.add_patch(FancyArrowPatch((x0,22.5),(x1,22.5),arrowstyle="-|>",mutation_scale=18,lw=2,color=INK))
for x0,x1 in [(17.5,18.0),(35.0,37.0),(54.0,60.0),(77.0,82.5)]:
    arrow(x0,x1)

# self-consistency feedback annotation
ax.add_patch(FancyArrowPatch((91,15),(46,7),connectionstyle="arc3,rad=0.25",
             arrowstyle="-|>",mutation_scale=15,lw=1.6,ls="--",color="#b8860b"))
ax.text(50,3.2,"Self-consistency check: does the generated protein fold back to its target shape?  "
        "Informative only because the validator is trained independently of the generator (orthogonality).",
        ha="center",va="center",fontsize=8.5,style="italic",color="#7a5c00")

ax.text(50,43.5,"Generate, then Verify — the teaching loop",ha="center",fontsize=13,fontweight="bold",color=INK)
fig.tight_layout()
fig.savefig("figures/workflow_diagram.png",dpi=200,bbox_inches="tight")
print("wrote figures/workflow_diagram.png")
