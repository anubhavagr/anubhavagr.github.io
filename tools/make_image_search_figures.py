#!/usr/bin/env python3
"""Regenerate the two figures for the image-search-geometry post.

Design goals (2026 rework):
- Functional two-hue palette: site clay #b0613f vs petrol teal #20777a, so
  categories read instantly on the cream background instead of four shades
  of brown.
- Every annotation placed at hand-checked coordinates — no label collisions.
- Panels teach: takeaway titles, shaded meaning-zones, the trade-off drawn
  on the chart, not just the data.

Run:  python3 tools/make_image_search_figures.py
Writes: assets/img/posts/image-search-geometry/{geometry,cost}.png
"""
import numpy as np
import matplotlib
matplotlib.use("Agg")
from matplotlib import font_manager
from matplotlib.patches import Wedge
import glob as _glob
import os

for _f in _glob.glob(os.path.join(os.path.dirname(__file__), "fonts", "*.ttf")):
    font_manager.fontManager.addfont(_f)

import matplotlib.pyplot as plt

ROOT = os.path.join(os.path.dirname(__file__), "..", "assets", "img", "posts")

BG, PANEL, BORDER = "#fffdf7", "#fffdf7", "#e0d6c4"
TEXT, SOFT, MUTE = "#211e17", "#544e44", "#877f71"
CLAY, CLAY_SOFT = "#b0613f", "#d68a64"
TEAL, TEAL_SOFT = "#20777a", "#5ea3a1"

plt.rcParams.update({
    "figure.facecolor": BG, "axes.facecolor": PANEL,
    "savefig.facecolor": BG, "font.family": "Inter",
    "text.color": TEXT, "axes.labelcolor": SOFT,
    "xtick.color": SOFT, "ytick.color": SOFT,
    "axes.edgecolor": BORDER, "axes.linewidth": 1.0,
    "grid.color": BORDER, "grid.alpha": 0.55, "grid.linewidth": 0.8,
    "font.size": 11.5, "axes.titlesize": 12.5, "axes.labelsize": 11,
    "legend.frameon": False, "figure.dpi": 200,
})
MONO = {"family": "JetBrains Mono"}

def style_ax(ax, grid=True):
    ax.spines[["top", "right"]].set_visible(False)
    if grid:
        ax.grid(True, linestyle="-", linewidth=0.7, alpha=0.5)
    else:
        ax.grid(False)

def save(fig, name):
    d = os.path.join(ROOT, "image-search-geometry")
    os.makedirs(d, exist_ok=True)
    fig.savefig(os.path.join(d, name), dpi=200)
    plt.close(fig)
    print("wrote", os.path.join(d, name))

rng = np.random.default_rng(11)

# ================================================================
# FIGURE 1 — geometry.png
# ================================================================
fig = plt.figure(figsize=(10.6, 4.15), constrained_layout=True)

# --- Panel a: d^2 = 2 - 2 cos θ ---------------------------------
ax = fig.add_subplot(1, 2, 1)
c = np.linspace(0.0, 1.0, 400)
ax.plot(c, 2 - 2 * c, color=CLAY, lw=2.6, zorder=3)

# "where similar images live" band (explained in the figure caption)
ax.axvspan(0.90, 1.0, color=TEAL, alpha=0.08, zorder=1)

# the equation, boxed in the empty region under the curve's left flank
# (kept inside the axes so it can't occlude the y-tick labels)
ax.text(0.30, 0.64, "||a − b||² = 2 − 2·cos θ", color=TEXT, fontsize=12.5,
        ha="center", va="center", **MONO,
        bbox=dict(boxstyle="round,pad=0.5", fc="#fbf7ef", ec=BORDER, lw=1.0))

# three marked points as numbered disks, keyed by the block below —
# no leader lines, nothing that can strike through anything
# (disk 3 sits a hair inside the corner so the axes spines don't clip it)
marks = [(0.90, 0.200, "1"), (0.95, 0.100, "2"), (0.984, 0.032, "3")]
for cx, dy, num in marks:
    ax.scatter([cx], [dy], s=95, color=TEAL, edgecolor="white",
               linewidth=1.2, zorder=5)
    ax.text(cx, dy, num, color="white", fontsize=7, ha="center",
            va="center", zorder=6, **MONO)
ax.text(0.03, 0.14,
        "1 · cos θ = 0.90 → d² = 0.200\n"
        "2 · cos θ = 0.95 → d² = 0.100\n"
        "3 · cos θ = 0.99 → d² = 0.020",
        color=SOFT, fontsize=9.6, ha="left", va="bottom", linespacing=1.7,
        **MONO)

ax.set_xlabel("cosine similarity  cos θ")
ax.set_ylabel("squared Euclidean distance  ‖a − b‖²")
# panel titles live in the blog's figcaption, not in the image
ax.set_xlim(0, 1.0); ax.set_ylim(0, 2.05)
ax.set_xticks([0, 0.25, 0.5, 0.75, 1.0])
style_ax(ax)

# --- Panel b: unit circle, angle is everything -------------------
ax = fig.add_subplot(1, 2, 2)
tA = np.deg2rad(rng.normal(38, 11, 85))
tB = np.deg2rad(rng.normal(-38, 11, 85))
tA = tA[np.abs(np.rad2deg(tA)) < 72]
tB = tB[np.abs(np.rad2deg(tB)) < 72]

# soft class sectors behind the points
ax.add_patch(Wedge((0, 0), 1.14, 14, 62, facecolor=TEAL, alpha=0.10, lw=0))
ax.add_patch(Wedge((0, 0), 1.14, -62, -14, facecolor=CLAY, alpha=0.10, lw=0))

ax.scatter(np.cos(tA), np.sin(tA), s=17, color=TEAL, alpha=0.85, lw=0,
           label="class A", zorder=4)
ax.scatter(np.cos(tB), np.sin(tB), s=17, color=CLAY, alpha=0.85, lw=0,
           label="class B", zorder=4)

# decision boundary: the single ray that separates the two sectors
ax.plot([-1.22, 1.22], [0, 0], color=SOFT, lw=1.4, ls=(0, (5, 4)), alpha=0.9)
ax.text(-1.19, 0.07, "angular decision boundary", color=MUTE, fontsize=8.6,
        ha="left", **MONO)

# query on the circle + the same-direction point at half radius
tq = np.deg2rad(20)
qx, qy = np.cos(tq), np.sin(tq)
hx, hy = 0.52 * qx, 0.52 * qy
ax.scatter([qx], [qy], s=170, color=TEXT, marker="*", zorder=6, label="query")
ax.scatter([hx], [hy], s=58, facecolor="none", edgecolor=TEXT, lw=1.5, zorder=6)
ax.plot([hx, qx], [hy, qy], color=TEXT, lw=1.0, ls=":", zorder=5)
ax.annotate("query", (qx, qy), xytext=(9, 4), textcoords="offset points",
            fontsize=10, color=TEXT, **MONO)
ax.annotate("same direction, half the length\n→ identical ranking",
            xy=(hx, hy), xytext=(-1.19, 0.55), textcoords="data",
            fontsize=9.3, color=SOFT, ha="left", va="center", linespacing=1.5,
            arrowprops=dict(arrowstyle="-", color=MUTE, lw=0.9,
                            shrinkA=2, shrinkB=5,
                            connectionstyle="arc3,rad=0.12"))

# θ arc from the dim-1 axis to the query ray
arc = np.linspace(0, tq, 50)
ax.plot(0.35 * np.cos(arc), 0.35 * np.sin(arc), color=TEAL, lw=1.8, zorder=5)
ax.text(0.42, 0.055, "θ", color=TEAL, fontsize=13, fontstyle="italic",
        ha="center", va="center")

ax.set_xlabel("embedding dim 1"); ax.set_ylabel("embedding dim 2")
ax.set_xlim(-1.22, 1.22); ax.set_ylim(-1.22, 1.22)
ax.set_aspect("equal")
ax.legend(loc="upper left", fontsize=9.5, handletextpad=0.3)
style_ax(ax, grid=False)
save(fig, "geometry.png")

# ================================================================
# FIGURE 2 — cost.png
# ================================================================
params = {"MobileNetV2": 3.5, "EfficientNet-B0": 5.3, "DenseNet121": 8.0,
          "ResNet34": 21.8, "InceptionV3": 27.2}        # torchvision, M params
lat_ms = {"MobileNetV2": 30, "EfficientNet-B0": 35, "DenseNet121": 40,
          "ResNet34": 45, "InceptionV3": 50}             # measured, find-me-lens

fig = plt.figure(figsize=(10.6, 4.15), constrained_layout=True)

# --- Panel a: latency vs backbone size ---------------------------
ax = fig.add_subplot(1, 2, 1)
# trade-off spine between the two endpoints
ax.plot([params["MobileNetV2"], params["InceptionV3"]],
        [lat_ms["MobileNetV2"], lat_ms["InceptionV3"]],
        color=MUTE, lw=1.2, ls=(0, (4, 3)), zorder=2)

offsets = {"MobileNetV2": (9, -4), "EfficientNet-B0": (9, -4),
           "DenseNet121": (9, -4), "ResNet34": (9, -4),
           "InceptionV3": (-7, 9)}
ha = {n: "left" for n in params}; ha["InceptionV3"] = "right"
for n in params:
    star = n in ("MobileNetV2", "InceptionV3")
    ax.scatter([params[n]], [lat_ms[n]], s=105 if star else 58,
               color=TEAL if n == "MobileNetV2" else CLAY if n == "InceptionV3" else SOFT,
               zorder=5)
    ax.annotate(n, (params[n], lat_ms[n]), xytext=offsets[n],
                textcoords="offset points", fontsize=9.3,
                color=TEXT if star else SOFT, ha=ha[n], **MONO)

ax.text(24.5, 31.5, "+0.5 pp recall for +67% latency", color=SOFT,
        fontsize=9.5, ha="center", **MONO)

ax.set_xlabel("backbone parameters (M, torchvision)")
ax.set_ylabel("query latency (ms, measured)")
ax.set_xlim(0, 32); ax.set_ylim(26, 54)
style_ax(ax)

# --- Panel b: exact vs IVF cost ----------------------------------
ax = fig.add_subplot(1, 2, 2)
N = np.logspace(3, 7, 240)
d, nprobe = 2048, 8
exact = 2 * d * N
ivf = 2 * d * nprobe * np.sqrt(N)

ax.loglog(N, exact, color=CLAY, lw=2.6, label="exact — compare all N", zorder=3)
ax.loglog(N, ivf, color=TEAL, lw=2.6, label="IVF, nprobe=8 — compare 8√N", zorder=3)
ax.fill_between(N[10:], ivf[10:], exact[10:], color=TEAL, alpha=0.08, zorder=1)

for nn, pct in [(1e5, "2.5% of exact"), (1e7, "0.25% of exact")]:
    ax.axvline(nn, color=MUTE, lw=0.9, ls=":", zorder=2)
    ax.scatter([nn, nn], [2 * d * nn, 2 * d * nprobe * np.sqrt(nn)],
               s=34, color=[CLAY, TEAL], zorder=5)
    ax.annotate(pct, (nn, 2 * d * nprobe * np.sqrt(nn)), xytext=(-10, 12),
                textcoords="offset points", fontsize=9.3, color=TEAL,
                ha="right", **MONO)

ax.text(2.4e6, 7.5e8, "≈400× less work", color=TEAL, fontsize=10,
        ha="center", **MONO)

ax.set_xlabel("index size N (vectors)")
ax.set_ylabel("distance ops per query")
ax.legend(loc="upper left", fontsize=9.5)
style_ax(ax)
save(fig, "cost.png")

print("DONE")
