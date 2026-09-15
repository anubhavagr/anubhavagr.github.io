#!/usr/bin/env python3
"""Figures for the two ipic posts + the open-source card.

All diagrams faithfully mirror the architecture documented in ipic's README;
the RRF and memory figures are computed from the formulas in the posts.
Style matches the site palette (same tokens as make_post_figures.py).
"""
import numpy as np
import matplotlib
matplotlib.use("Agg")
from matplotlib import font_manager
import glob as _glob
import os

for _f in _glob.glob(os.path.join(os.path.dirname(__file__), "fonts", "*.ttf")):
    font_manager.fontManager.addfont(_f)

import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

ROOT = os.path.join(os.path.dirname(__file__), "..", "assets", "img", "posts")
BG, PANEL, BORDER = "#fffdf7", "#fffdf7", "#e0d6c4"
TEXT, SOFT, MUTE = "#211e17", "#544e44", "#877f71"
ACC, ACC2 = "#b0613f", "#d68a64"

plt.rcParams.update({
    "figure.facecolor": BG, "axes.facecolor": PANEL, "savefig.facecolor": BG,
    "font.family": "Inter", "text.color": TEXT,
    "axes.labelcolor": SOFT, "xtick.color": SOFT, "ytick.color": SOFT,
    "axes.edgecolor": BORDER, "font.size": 11,
})
MONO = {"family": "JetBrains Mono"}

def save(fig, slug, name):
    d = os.path.join(ROOT, slug)
    os.makedirs(d, exist_ok=True)
    fig.savefig(os.path.join(d, name), dpi=200)
    plt.close(fig)
    print("wrote", os.path.join(slug, name))

# ===================================================== FIG 1: architecture
fig, ax = plt.subplots(figsize=(10.6, 6.2), constrained_layout=True)
ax.set_xlim(0, 100); ax.set_ylim(0, 100); ax.axis("off")

def box(x, y, w, h, title, sub="", fc="#fbf7ef", ec=ACC, tc=TEXT, lw=1.4):
    ax.add_patch(FancyBboxPatch((x, y), w, h,
        boxstyle="round,pad=0.6,rounding_size=1.4",
        facecolor=fc, edgecolor=ec, linewidth=lw, mutation_aspect=0.42))
    cy = y + h / 2
    if sub:
        ax.text(x + w/2, cy + 2.6, title, ha="center", va="center", fontsize=10.5,
                fontweight="bold", color=tc)
        ax.text(x + w/2, cy - 3.4, sub, ha="center", va="center", fontsize=8.6,
                color=SOFT, **MONO)
    else:
        ax.text(x + w/2, cy, title, ha="center", va="center", fontsize=10.5,
                fontweight="bold", color=tc)

def arrow(x1, y1, x2, y2, style="-|>", color=ACC, lw=1.6, ls="-", rad=0.0):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2),
        arrowstyle=style, mutation_scale=13, color=color, linewidth=lw,
        linestyle=ls, connectionstyle=f"arc3,rad={rad}"))

def lane_label(x, y, txt):
    ax.text(x, y, txt, ha="left", va="center", fontsize=8.4, color=MUTE, **MONO)

# --- indexing row (top) — v1: single pipeline
box(2,  80, 15, 12, "scan", "N-core walker")
box(22, 80, 19, 12, "workers", "text/PDF fast · A/V whisper")
box(46, 80, 14, 12, "chunk", "320 w · 24 overlap")
box(65, 80, 16, 12, "embed", "bge-small int8")
arrow(17.4, 86, 21.4, 86); arrow(41.6, 86, 45.4, 86); arrow(60.6, 86, 64.4, 86)

# --- stores (middle)
box(18, 58, 22, 11, "SQLite catalog", "FTS5 keyword rows · WAL", fc="#f6e3d7")
box(48, 58, 24, 11, "vector store", "i8-quantized · mmap'd", fc="#f6e3d7")
arrow(30, 79.4, 30, 69.8, color=MUTE, ls="--")           # workers -> FTS5
arrow(72, 79.4, 66, 69.8, color=ACC)                      # embed -> vectors
lane_label(31.5, 74.5, "text")
lane_label(66.2, 74.5, "384-d, 1 B/comp")

# --- query row (bottom)
box(2, 22, 16, 12, "query", "typed or spoken")
box(24, 36, 20, 10, "dense lane", "dot product · cosine", ec=ACC)
box(24, 22, 20, 10, "keyword lane", "BM25 via FTS5", ec=ACC2)
box(24, 8,  20, 10, "filename lane", "path match", ec=ACC2)
box(52, 22, 17, 12, "weighted RRF", "1.0 · 0.7 · 0.5 · k=60")
box(77, 22, 15, 12, "results", "ranked, cited")
arrow(18.4, 28, 23.4, 41, rad=-0.15)
arrow(18.4, 28, 23.4, 27)
arrow(18.4, 28, 23.4, 13, rad=0.15)
arrow(44.6, 41, 51.4, 29, rad=0.1)
arrow(44.6, 27, 51.4, 27)
arrow(44.6, 13, 51.4, 25, rad=-0.1)
arrow(69.4, 28, 76.4, 28)
# stores feed the lanes at query time
arrow(28, 57.4, 28, 46.8, color=MUTE, ls="--")
arrow(60, 57.4, 42, 41.5, color=MUTE, ls="--", rad=0.12)

ax.text(2, 95.5, "V1 INDEXING — one pipeline, background, resumable", fontsize=9.5, color=MUTE, **MONO)
ax.text(2, 49.5, "V1 QUERY — 3 lanes, single-digit milliseconds", fontsize=9.5, color=MUTE, **MONO)
save(fig, "ipic-architecture", "arch.png")

# ============================================ FIG 1b: v2 sharded architecture
fig = plt.figure(figsize=(10.6, 6.4), constrained_layout=True)
ax = fig.add_subplot(1, 1, 1)
ax.set_xlim(0, 100); ax.set_ylim(0, 100); ax.axis("off")

# engine owns shared models + budgets (top)
box(2, 84, 28, 11, "engine", "shared models · compute budget")
box(36, 84, 30, 11, "extraction pool", "text/PDF fast · A/V whisper-gated")
box(71, 84, 26, 11, "image writer", "CLIP · batch 16 · round-robin")
arrow(30.4, 89.5, 35.4, 89.5)
arrow(66.4, 89.5, 70.4, 89.5)

# shards (middle) — one per root
for i, (name, sub) in enumerate([("shard · root A", "catalog · 3 stores · writer"),
                                  ("shard · root B", "catalog · 3 stores · writer")]):
    x = 4 + i * 34
    box(x, 58, 30, 12, name, sub, fc="#f6e3d7")
ax.text(70.5, 64, "…one per root\nbounded channels (8192)\n= natural backpressure",
        fontsize=8.6, color=MUTE, va="center", **MONO)
arrow(50, 83.4, 19, 70.8, color=MUTE, ls="--")
arrow(50, 83.4, 53, 70.8, color=MUTE, ls="--")

# stores per shard (small, inside shard boxes via labels)
lane_label(5, 54.2, "text store 384-d i8 · image store 512-d i8 · audio fingerprints 128-d")

# query row (bottom)
box(2, 20, 15, 12, "query", "typed or spoken")
box(21, 34, 18, 10, "semantic", "w 1.0", ec=ACC)
box(21, 22, 18, 10, "vision", "w 0.9", ec=ACC)
box(41.5, 34, 18, 10, "keyword", "w 0.7", ec=ACC2)
box(41.5, 22, 18, 10, "filename", "w 0.5", ec=ACC2)
box(64, 20, 15, 12, "global RRF", "cross-shard ranks\nk=60")
box(84, 20, 14, 12, "hydrate", "top-k only")
arrow(17.4, 26, 20.4, 39, rad=-0.15)
arrow(17.4, 26, 20.4, 27)
arrow(39.4, 39, 41.1, 39)
arrow(39.4, 27, 41.1, 27)
arrow(60, 39, 63.4, 30, rad=0.1)
arrow(60, 27, 63.4, 26)
arrow(79.4, 26, 83.4, 26)
# shards feed lanes
arrow(19, 57.4, 25, 44.8, color=MUTE, ls="--")
arrow(53, 57.4, 50, 44.8, color=MUTE, ls="--")

ax.text(2, 97.5, "V2 — engine supervises per-root shards; every root scans, writes and serves in parallel",
        fontsize=9.5, color=MUTE, **MONO)
ax.text(2, 12.5, "QUERY — 4 lanes collected per shard in parallel, fused over global ranks, hydrated after fusion",
        fontsize=9.5, color=MUTE, **MONO)
save(fig, "ipic-architecture", "arch-v2.png")

# ===================================================== FIG 2: memory math
fig = plt.figure(figsize=(10.2, 4.2), constrained_layout=True)
ax = fig.add_subplot(1, 1, 1)
d = 384
Ns = np.array([10_000, 100_000, 1_000_000])
f32 = Ns * d * 4 / 1e6   # MB
i8  = Ns * d * 1 / 1e6   # MB (per-vector scale ≈ 4 B, negligible)
x = np.arange(len(Ns))
ax.bar(x - 0.18, f32, width=0.34, color=MUTE, label="f32 vectors")
ax.bar(x + 0.18, i8,  width=0.34, color=ACC,  label="i8-quantized (ipic)")
for xi, (a, b) in enumerate(zip(f32, i8)):
    ax.text(xi - 0.18, a * 1.15, f"{a:,.0f} MB", ha="center", fontsize=9.5, color=MUTE, **MONO)
    ax.text(xi + 0.18, b * 1.15, f"{b:,.1f} MB", ha="center", fontsize=9.5, color=ACC, **MONO)
ax.set_yscale("log")
ax.set_xticks(x, [f"{n:,} chunks".replace(",", " ") for n in Ns])
ax.set_ylabel("vector index on disk (MB, log)")
ax.set_title("384-d embeddings: 1 byte per component instead of 4 — the 4× that keeps ipic swap-friendly",
             loc="left", fontsize=11.5)
ax.legend(loc="upper left", fontsize=10)
ax.spines[["top", "right"]].set_visible(False)
ax.grid(axis="y", color=BORDER, alpha=0.5, linewidth=0.7)
save(fig, "ipic-architecture", "memory.png")
print(f"[ipic/memory] real index: {1548*384*1/1e6:.2f} MB i8 vs {1548*384*4/1e6:.2f} MB f32")

# ===================================================== FIG 3: RRF fusion
K = 60.0
WV, WVIS, WK = 1.0, 0.9, 0.7
docs = {
    # doc: (semantic rank, keyword rank, vision rank) — None = absent from lane
    "D1 — overview doc":   (1, 3, None),
    "D2 — related notes":  (2, 9, None),
    "D3 — background":     (3, 15, None),
    "D4 — exact ID match": (8, 1, None),
    "D5 — folder mention": (12, 2, None),
    "D6 — tangential":     (20, 30, None),
    "D7 — beach photo":    (25, None, 1),
}
def rrf(ranks):
    score = 0.0
    for w, r in [(WV, ranks[0]), (WK, ranks[1]), (WVIS, ranks[2])]:
        if r is not None:
            score += w / (K + r)
    return score
scores = {k: rrf(v) for k, v in docs.items()}
order = sorted(scores, key=scores.get, reverse=True)
print("[ipic/rrf] fused ranking (4-lane weights 1.0/0.9/0.7):")
for i, k in enumerate(order, 1):
    s, kw, vis = docs[k]
    print(f"  {i}. {k:22s} sem={s:>2} kw={kw if kw else '—':>2} vis={vis if vis else '—':>2}  score={scores[k]:.5f}")

fig = plt.figure(figsize=(10.4, 4.6), constrained_layout=True)
ax = fig.add_subplot(1, 2, 1)
ys = np.arange(len(order))[::-1]
vals = [scores[k] for k in order]
colors = [ACC if ("photo" in k or "exact" in k) else (ACC2 if (docs[k][1] or 0) <= 3 or (docs[k][2] or 0) <= 3 else BORDER) for k in order]
ax.barh(ys, vals, color=colors, edgecolor=TEXT, linewidth=0.4, height=0.62)
for y, k in zip(ys, order):
    ax.text(0.0004, y, k, va="center", fontsize=9.4, color=TEXT)
    s, kw, vis = docs[k]
    ax.text(scores[k] + 0.00035, y,
            f"sem {s:>2} · kw {kw if kw is not None else '—'} · vis {vis if vis is not None else '—'}",
            va="center", fontsize=8.2, color=MUTE, **MONO)
ax.set_yticks([])
ax.set_xlim(0, max(vals) * 1.34)
ax.set_xlabel("fused RRF score")
ax.set_title(f"a · w_sem={WV} · w_vis={WVIS} · w_kw={WK} — computed", loc="left", fontsize=10.5, **MONO)
ax.spines[["top", "right", "left"]].set_visible(False)
ax.grid(axis="x", color=BORDER, alpha=0.5, linewidth=0.7)

ax = fig.add_subplot(1, 2, 2)
r = np.linspace(1, 60, 300)
for k, c, lw in [(1, "#4a2412", 2.0), (10, ACC2, 2.0), (60, ACC, 2.6), (600, MUTE, 2.0)]:
    ax.plot(r, 1.0 / (k + r), color=c, lw=lw, label=f"k = {k}")
ax.set_xlabel("document's rank r in a lane")
ax.set_ylabel("points contributed  (1 / (k + r))")
ax.set_yscale("log")
ax.legend(fontsize=9.5, loc="upper right")
ax.set_title("b · k sets how winner-take-most the fusion is", loc="left", fontsize=10.5, **MONO)
ax.spines[["top", "right"]].set_visible(False)
ax.grid(color=BORDER, alpha=0.5, linewidth=0.7)
save(fig, "ipic-hybrid-search", "rrf_fusion.png")
print("DONE")
