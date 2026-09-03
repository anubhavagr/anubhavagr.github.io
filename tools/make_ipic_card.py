#!/usr/bin/env python3
"""Card-sized ipic diagram: readable at ~370 px display width (lab card)."""
import matplotlib
matplotlib.use("Agg")
from matplotlib import font_manager
import glob as _glob
import os

for _f in _glob.glob(os.path.join(os.path.dirname(__file__), "fonts", "*.ttf")):
    font_manager.fontManager.addfont(_f)

import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

BG, BORDER = "#fffdf7", "#e0d6c4"
TEXT, SOFT, MUTE, ACC, ACC2 = "#211e17", "#544e44", "#877f71", "#b0613f", "#d68a64"
plt.rcParams.update({"figure.facecolor": BG, "savefig.facecolor": BG,
                     "font.family": "Inter", "text.color": TEXT})
MONO = {"family": "JetBrains Mono"}

fig, ax = plt.subplots(figsize=(7.4, 3.7), constrained_layout=True)
ax.set_xlim(0, 100); ax.set_ylim(0, 100); ax.axis("off")

def box(x, y, w, h, title, sub="", fc="#fbf7ef", ec=ACC, ts=27):
    ax.add_patch(FancyBboxPatch((x, y), w, h,
        boxstyle="round,pad=1.0,rounding_size=2.4",
        facecolor=fc, edgecolor=ec, linewidth=2.4, mutation_aspect=0.5))
    cy = y + h / 2
    if sub:
        ax.text(x + w/2, cy + 6.5, title, ha="center", va="center", fontsize=ts, fontweight="bold")
        ax.text(x + w/2, cy - 8.5, sub, ha="center", va="center", fontsize=18, color=SOFT, **MONO)
    else:
        ax.text(x + w/2, cy, title, ha="center", va="center", fontsize=ts, fontweight="bold")

def arrow(x1, y1, x2, y2, color=ACC, lw=3.0, ls="-", rad=0.0):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle="-|>",
        mutation_scale=24, color=color, linewidth=lw, linestyle=ls,
        connectionstyle=f"arc3,rad={rad}"))

# Row 1 — indexing
box(2, 63, 27, 27, "your disk", "pdf · audio · video")
box(45, 63, 30, 27, "local index", "whisper · FTS5")
arrow(30.4, 76.5, 43.6, 76.5)
# Row 2 — query path
box(2, 13, 27, 27, "one query", "typed or spoken")
box(45, 13, 25, 27, "3 lanes", "semantic · keyword")
box(79, 13, 18, 27, "RRF", "", ts=30)
arrow(30.4, 26.5, 43.6, 26.5)
arrow(71.5, 26.5, 77.6, 26.5)
# index feeds the lanes
arrow(60, 61.5, 58, 41.5, color=MUTE, lw=2.4, ls=(0, (4, 3)))

# offline badge
ax.add_patch(FancyBboxPatch((52, 92), 45, 8,
    boxstyle="round,pad=0.7,rounding_size=2.0",
    facecolor=ACC, edgecolor="none", mutation_aspect=0.5))
ax.text(74.5, 96, "no cloud · no API calls", ha="center", va="center",
        fontsize=17, color="#fffdf7", fontweight="bold", **MONO)

save_path = os.path.join(os.path.dirname(__file__), "..", "assets", "img", "posts", "ipic-architecture", "card.png")
fig.savefig(save_path, dpi=200)
print("wrote", os.path.normpath(save_path))
