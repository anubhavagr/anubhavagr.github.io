#!/usr/bin/env python3
"""Generate all figures for the four new blog posts.

Every figure is *computed* here — no hand-drawn claims. Style matches the
site palette: bg #fffdf7, text #211e17, accent #b0613f, border #e0d6c4.
Run:  python3 tools/make_post_figures.py   (writes to assets/img/posts/<slug>/)
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
from matplotlib.colors import LinearSegmentedColormap
from scipy.ndimage import gaussian_filter
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "assets", "img", "posts")

BG, PANEL, BORDER = "#fffdf7", "#fffdf7", "#e0d6c4"
TEXT, SOFT, MUTE = "#211e17", "#544e44", "#877f71"
ACC, ACC2 = "#b0613f", "#d68a64"
CMAP = LinearSegmentedColormap.from_list("site", ["#fbf7ef", "#d68a64", "#b0613f", "#4a2412"])

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

def fig2(w=10.0, h=4.1):
    return plt.figure(figsize=(w, h), constrained_layout=True)

def style_ax(ax):
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(True, axis="both", linestyle="-", linewidth=0.7, alpha=0.5)

def save(fig, slug, name):
    d = os.path.join(ROOT, slug)
    os.makedirs(d, exist_ok=True)
    fig.savefig(os.path.join(d, name), dpi=200)
    plt.close(fig)
    print("wrote", os.path.join(slug, name))

rng = np.random.default_rng(7)

# ============================================================ POST 1: INT8
# --- Figure 1: calibration -------------------------------------------------
# Synthetic post-GELU activation tensor: heavy bulk on [0, 4], smooth decaying tail.
x = np.concatenate([
    rng.gamma(3.2, 0.55, 256_000),       # bulk  ~ [0, 4]
    rng.gamma(1.5, 2.2, 34_000) + 1.5,   # smooth heavy tail ~ [1.5, 29]
])
print(f"[int8/calib] max={x.max():.2f}  P99={np.quantile(x,.99):.2f}  P99.9={np.quantile(x,.999):.2f}")

def quantize(v, xmax, b=8):
    """Affine unsigned saturating quantizer on [0, xmax]."""
    s = xmax / (2**b - 1)
    q = np.clip(np.round(v / s), 0, 2**b - 1)
    return q * s

ths = np.unique(np.quantile(x, np.linspace(0.90, 1.0, 45)))  # candidate clips
mse  = np.array([np.mean((x - quantize(x, t))**2) for t in ths])
p99v = np.quantile(x, 0.99)
mask = x <= p99v
bmse = np.array([np.mean((x[mask] - quantize(x, t)[mask])**2) for t in ths])

def kl_for(t, bins=1024):
    ref, _ = np.histogram(x, bins=bins, range=(0, float(x.max())), density=True)
    qq, _  = np.histogram(quantize(x, t), bins=bins, range=(0, float(x.max())), density=True)
    eps = 1e-10
    return float(np.sum(ref * np.log((ref + eps) / (qq + eps))))

kls = np.array([kl_for(t) for t in ths])
t_kl, t_mse, t_bmse = float(ths[kls.argmin()]), float(ths[mse.argmin()]), float(ths[bmse.argmin()])
t_mm = float(x.max())
print(f"[int8/calib] full-MSE pick={t_mse:.2f}  bulk99-MSE pick={t_bmse:.2f}  KL(1024) pick={t_kl:.2f}")

fig = fig2(10.4, 4.2)
ax = fig.add_subplot(1, 2, 1)
ax.hist(x, bins=400, range=(0, 29), color=ACC2, alpha=0.85, edgecolor="none")
for t, lab, c, ls in [(t_mm, "min–max", MUTE, "--"), (t_bmse, "P99 / bulk-MSE", TEXT, ":"),
                      (t_kl, "entropy (KL)", ACC, "--")]:
    ax.axvline(t, color=c, lw=2.0, linestyle=ls)
    ax.text(t + 0.3, ax.get_ylim()[1] * 0.97, lab, color=c, rotation=90, va="top",
            fontsize=9.5, **MONO)
ax.set_yscale("log")
ax.set_xlabel("activation value"); ax.set_ylabel("density (log)")
ax.set_title("a · One tensor, three ranges", loc="left", **MONO)
style_ax(ax)

ax = fig.add_subplot(1, 2, 2)
def nz(v):
    return v / v.min()
ax.plot(ths, nz(mse) * 1.0,  color=MUTE, lw=2.2, label="full MSE → min–max")
ax.plot(ths, nz(bmse) * 1.0, color=TEXT, lw=2.2, label=f"bulk-99 MSE → P99 ({t_bmse:.1f})")
ax.plot(ths, nz(kls) * 1.0,  color=ACC,  lw=2.2, label=f"KL(1024 bins) → {t_kl:.1f}")
ax.scatter([t_mse], [1.0], color=MUTE, s=55, zorder=5)
ax.scatter([t_bmse], [1.0], color=TEXT, s=55, zorder=5)
ax.scatter([t_kl], [1.0], color=ACC, s=55, zorder=5)
ax.set_yscale("log")
ax.set_xlabel("clip threshold t (quantiles 0.90 – 1.0 of the tensor)")
ax.set_ylabel("error, normalized to its minimum (log)")
ax.set_title("b · Pick an objective, get a threshold", loc="left", **MONO)
ax.legend(loc="upper center", fontsize=9.5)
style_ax(ax)
save(fig, "int8-quantization", "calibration.png")

# --- Figure 2: per-tensor vs per-channel weights ---------------------------
Cout, Cin, k = 48, 64, 3
sigma_c = np.exp(rng.uniform(np.log(0.004), np.log(0.05), Cout))  # channel scales ~12× apart
W = rng.normal(0, 1, (Cout, Cin, k, k)) * sigma_c[:, None, None, None]

def sqnr(err, ref):
    return 10 * np.log10(np.sum(ref**2) / np.sum(err**2))

# symmetric int8, per-tensor
s_t = np.abs(W).max() / 127
wq_t = np.round(W / s_t) * s_t
# per output-channel
s_c = np.abs(W).max(axis=(1, 2, 3), keepdims=True) / 127
wq_c = np.round(W / s_c) * s_c
snr_t, snr_c = sqnr(wq_t - W, W), sqnr(wq_c - W, W)
print(f"[int8/per-channel] per-tensor {snr_t:.1f} dB vs per-channel {snr_c:.1f} dB "
      f"(+{snr_c - snr_t:.1f} dB), channel-scale spread {sigma_c.max()/sigma_c.min():.1f}x")

fig = fig2(10.2, 4.2)
ax = fig.add_subplot(1, 2, 1)
order = np.argsort(sigma_c)
ax.bar(np.arange(Cout), np.abs(W.reshape(Cout, -1)).max(axis=1)[order],
       color=ACC2, edgecolor=ACC, linewidth=0.6)
ax.set_xlabel("output channel (sorted)")
ax.set_ylabel("max |w| per channel")
ax.set_title(f"a · One tensor, {sigma_c.max()/sigma_c.min():.0f}× range spread", loc="left", **MONO)
style_ax(ax)

ax = fig.add_subplot(1, 2, 2)
bars = ax.bar([0, 1], [snr_t, snr_c], color=[MUTE, ACC], width=0.55)
ax.set_xticks([0, 1], ["per-tensor", "per-channel"], **MONO)
ax.set_ylabel("weight SQNR after INT8 (dB)")
for b, v in zip(bars, [snr_t, snr_c]):
    ax.text(b.get_x() + b.get_width() / 2, v + 0.6, f"{v:.1f} dB", ha="center",
            color=TEXT, fontsize=11, **MONO)
ax.set_ylim(0, snr_c * 1.18)
ax.set_title(f"b · Same 8 bits, +{snr_c - snr_t:.0f} dB", loc="left", **MONO)
style_ax(ax)
save(fig, "int8-quantization", "per_channel.png")

# ===================================================== POST 2: RETRIEVAL
# --- Figure 1: unit-vector geometry ----------------------------------------
fig = fig2(10.2, 4.2)
ax = fig.add_subplot(1, 2, 1)
th = np.linspace(0, np.pi / 2, 400)
ax.plot(np.degrees(th), 2 - 2 * np.cos(th), color=ACC, lw=2.4)
for c, dx, dy in [(0.90, -14, 16), (0.95, -14, 16), (0.99, -14, 18)]:
    t = np.arccos(c)
    ax.scatter([np.degrees(t)], [2 - 2 * c], color=TEXT, s=42, zorder=5)
    ax.annotate(f"cos θ = {c:.2f}\nd² = {2 - 2*c:.3f}", (np.degrees(t), 2 - 2 * c),
                xytext=(dx, dy), textcoords="offset points", fontsize=10,
                color=SOFT, **MONO, ha="right")
ax.set_xlabel("angle θ between unit embeddings (deg)")
ax.set_ylabel("‖a − b‖²")
ax.set_title("a · Squared distance vs cosine", loc="left", **MONO)
ax.set_xlim(0, 90); ax.set_ylim(0, 2.05)
style_ax(ax)

ax = fig.add_subplot(1, 2, 2)
tA = np.deg2rad(rng.normal(38, 13, 90))
tB = np.deg2rad(rng.normal(-38, 13, 90))
ax.scatter(np.cos(tA), np.sin(tA), s=16, color=ACC, alpha=0.85, label="class A", lw=0)
ax.scatter(np.cos(tB), np.sin(tB), s=16, color=MUTE, alpha=0.85, label="class B", lw=0)
ax.plot([-1.15, 1.15], [0, 0], color=SOFT, lw=1.4, ls="--", alpha=0.8)
ax.plot([0, 0], [-1.15, 1.15], color=SOFT, lw=1.4, ls="--", alpha=0.8)
tq = np.deg2rad(20)
ax.scatter([np.cos(tq)], [np.sin(tq)], s=130, color=TEXT, marker="*", zorder=6)
ax.annotate("query", (np.cos(tq), np.sin(tq)), xytext=(10, 8),
            textcoords="offset points", fontsize=10.5, **MONO)
arc = np.linspace(0, tq, 40)
ax.plot(0.34 * np.cos(arc), 0.34 * np.sin(arc), color=ACC, lw=1.6)
ax.text(0.40, 0.11, "θ", color=ACC, fontsize=12, fontstyle="italic")
ax.set_xlabel("embedding dim 1"); ax.set_ylabel("embedding dim 2")
ax.set_title("b · On the unit sphere, angle is everything", loc="left", **MONO)
ax.set_xlim(-1.15, 1.15); ax.set_ylim(-1.15, 1.15)
ax.set_aspect("equal")
ax.legend(loc="lower left", fontsize=10)
style_ax(ax)
save(fig, "image-search-geometry", "geometry.png")

# --- Figure 2: cost arithmetic ----------------------------------------------
params = {"MobileNetV2": 3.5, "EfficientNet-B0": 5.3, "DenseNet121": 8.0,
          "ResNet34": 21.8, "InceptionV3": 27.2}           # torchvision, M params
lat = {"MobileNetV2": 0.030, "EfficientNet-B0": 0.035, "DenseNet121": 0.040,
       "ResNet34": 0.045, "InceptionV3": 0.050}            # measured, find-me-lens
from scipy.stats import spearmanr
rho = spearmanr(list(params.values()), list(lat.values())).statistic
print(f"[retrieval/params-vs-latency] Spearman ρ = {rho:.2f}")

fig = fig2(10.2, 4.2)
ax = fig.add_subplot(1, 2, 1)
for n in params:
    ax.scatter(params[n], lat[n], s=70, color=ACC, zorder=5)
    ax.annotate(n, (params[n], lat[n]), xytext=(8, -3), textcoords="offset points",
                fontsize=9.5, color=SOFT, **MONO)
ax.set_xlabel("backbone parameters (M, torchvision)")
ax.set_ylabel("query latency (s, measured)")
ax.set_title(f"a · Latency tracks size — ρ = {rho:.1f}", loc="left", **MONO)
ax.set_xlim(0, 31); ax.set_ylim(0.026, 0.054)
style_ax(ax)

ax = fig.add_subplot(1, 2, 2)
N = np.logspace(3, 7, 200)
d = 2048
ax.loglog(N, 2 * d * N, color=MUTE, lw=2.4, label="Flat — exact, 2dN")
nprobe = 8
ax.loglog(N, 2 * d * nprobe * np.sqrt(N), color=ACC, lw=2.4,
          label=f"IVF — nlist=√N, nprobe={nprobe}")
for nn in [1e5, 1e7]:
    fr = nprobe / np.sqrt(nn)
    ax.annotate(f"{fr*100:.2f}% of exact", (nn, 2 * d * nprobe * np.sqrt(nn)),
                xytext=(6, -16), textcoords="offset points", fontsize=9.5,
                color=ACC, **MONO)
ax.set_xlabel("index size N (vectors)")
ax.set_ylabel("distance ops per query")
ax.legend(loc="upper left", fontsize=10)
ax.set_title("b · What probing √N cells buys", loc="left", **MONO)
style_ax(ax)
save(fig, "image-search-geometry", "cost.png")

# ======================================================== POST 3: DICE
# --- Figure 1: CE vs Dice on the toy population -----------------------------
fig = fig2(10.2, 4.2)
pi = 0.04                                     # foreground fraction
# The "global bias" family: the network outputs the same q on every pixel —
# the direction an under-trained, class-starved model collapses along.
q = np.linspace(0.001, 0.999, 900)
ce = -(pi * np.log(q) + (1 - pi) * np.log(1 - q))   # per-pixel CE, closed form
dice = 2 * pi * q / (q + pi)                        # soft Dice, closed form
ce_n = (ce - ce.min()) / (ce.max() - ce.min())      # min-max normalize each
d_n = ((1 - dice) - (1 - dice).min()) / ((1 - dice).max() - (1 - dice).min())

ax = fig.add_subplot(1, 2, 1)
ax.plot(q, ce_n, color=MUTE, lw=2.4, label="cross-entropy")
ax.plot(q, d_n, color=ACC, lw=2.4, label="1 − Dice")
ax.axvline(pi, color=MUTE, ls="--", lw=1.4)
ax.scatter([pi], [0.0], color=MUTE, s=60, zorder=6)
ax.scatter([1.0], [0.0], color=ACC, s=60, zorder=6, clip_on=False)
ax.annotate("CE minimum: q* = π = 0.04\npredict the prior — calibrated mush",
            (pi, 0.0), xytext=(30, 26), textcoords="offset points",
            fontsize=10, color=MUTE, ha="left")
ax.annotate("Dice minimum: q* = 1\ncommit to foreground",
            (0.999, 0.0), xytext=(-12, 30), textcoords="offset points",
            fontsize=10, color=ACC, ha="right")
ax.set_xlabel("global bias q (probability output on every pixel)")
ax.set_ylabel("loss, min–max normalized over the sweep")
ax.set_title(f"a · π = {pi:.0%}: opposite optima", loc="left", **MONO)
ax.legend(loc="center left", fontsize=10)
ax.set_ylim(-0.05, 1.05)
style_ax(ax)

ax = fig.add_subplot(1, 2, 2)
pif = np.logspace(-3.3, -0.3, 300)            # foreground fraction
share = 1 - pif                                # bg share of CE gradient
ax.semilogx(pif * 100, share * 100, color=ACC, lw=2.4)
ax.scatter([0.39], [99.61], s=70, color=TEXT, zorder=6)
ax.annotate("a 2-px vessel in a 512² frame lives here —\n99.6% of the CE gradient says background",
            (0.39, 99.61), xytext=(28, -18), textcoords="offset points",
            fontsize=10, color=SOFT, ha="left")
ax.set_xlabel("foreground fraction (%)")
ax.set_ylabel("background share of CE gradient (%)")
ax.set_title("b · Where the gradient goes", loc="left", **MONO)
ax.set_ylim(0, 104); ax.set_xlim(0.05, 50)
style_ax(ax)
save(fig, "dice-imbalance", "ce_vs_dice.png")

# --- Figure 2: boundary sensitivity -----------------------------------------
fig = fig2(10.2, 4.2)
ax = fig.add_subplot(1, 2, 1)
deltas = np.linspace(0, 4, 401)
for w, c in [(2, "#4a2412"), (4, ACC), (8, ACC2), (16, MUTE)]:
    ax.plot(deltas, w / (w + deltas), color=c, lw=2.3, label=f"vessel width w = {w} px")
ax.scatter([1], [2 / 3], s=70, color=TEXT, zorder=6)
ax.annotate("1-px error, w = 2:\nDice drops to 0.67", (1, 2 / 3), xytext=(1.35, 0.44),
            fontsize=10, color=SOFT, **MONO,
            arrowprops=dict(arrowstyle="-", color=TEXT, lw=1))
ax.set_xlabel("boundary error δ (px, dilate + erode)")
ax.set_ylabel("Dice")
ax.set_title("a · Thin structures pay full price", loc="left", **MONO)
ax.legend(loc="lower left", fontsize=9.5)
ax.set_ylim(0, 1.02)
style_ax(ax)

ax = fig.add_subplot(1, 2, 2)
H = W = 512
acc_drop = [2 * d * H / (H * W) * 100 for d in deltas]
ax.plot(deltas / 2 * 100, [w / (w + 1) for w in [2]] * 0 + list(2 / (2 + deltas)), color=ACC, lw=2.3)
ax.plot(deltas, [100 - a for a in acc_drop], color=MUTE, lw=2.3)
ax.text(2.1, 0.83, "Dice (w = 2)", color=ACC, fontsize=10.5, **MONO)
ax.text(2.1, 0.955, "pixel accuracy", color=MUTE, fontsize=10.5, **MONO)
ax.set_xlabel("boundary error δ (px)")
ax.set_ylabel("score")
ax.set_title("b · Accuracy sleeps through it", loc="left", **MONO)
ax.set_ylim(0.4, 1.02)
style_ax(ax)
save(fig, "dice-imbalance", "boundary_sensitivity.png")

# ================================================== POST 4: GRAM MATRIX
# --- Figure 1: permutation invariance demo ----------------------------------
C, H, W = 6, 32, 32
ys, xs = np.meshgrid(np.arange(H), np.arange(W), indexing="ij")

def gabor_patch(y0, x0, orient, f=0.30, sigma=2.2):
    X, Y = xs - x0, ys - y0
    gr = np.cos(2 * np.pi * f * (X * np.cos(orient) + Y * np.sin(orient)))
    env = np.exp(-(X**2 + Y**2) / (2 * sigma**2))
    return np.clip(gr * env, 0, None)

F_struct = np.zeros((C, H, W))
spots = [(6, 8, 0.3), (6, 24, 0.3), (16, 8, 1.2), (16, 24, 1.2), (26, 16, 2.1)]
for c in range(C):
    y0, x0, o = spots[c % len(spots)]
    F_struct[c] = gabor_patch(y0, x0, o + 0.15 * c)

F_tex = np.stack([gaussian_filter(rng.normal(0, 1, (H, W)), 1.1) for _ in range(C)])
F_tex = np.clip(F_tex, 0, None)

def gram(F):
    N = C
    f = F.reshape(N, -1)
    return (f @ f.T) / f.shape[1]

perm = rng.permutation(H * W)
F_shuf = F_struct.reshape(C, -1)[:, perm].reshape(C, H, W)
dG = np.abs(gram(F_shuf) - gram(F_struct)).max()
print(f"[gram/permutation] max |ΔG| after shuffling every position: {dG:.2e}")

fig = plt.figure(figsize=(10.4, 6.4), constrained_layout=True)
gs = fig.add_gridspec(2, 3)
panels = [
    (0, 0, F_struct.mean(0), "edge-structured activations", None),
    (0, 1, gram(F_struct), "G = F Fᵀ / HW", None),
    (0, 2, gram(F_shuf), "same F, positions shuffled", f"max |ΔG| = {dG:.0e}"),
    (1, 0, F_tex.mean(0), "stationary texture activations", None),
    (1, 1, gram(F_tex), "G = F Fᵀ / HW", None),
    (1, 2, gram(np.stack([gaussian_filter(rng.normal(0, 1, (H, W)), 1.1) for _ in range(C)]).clip(0)), "a different texture draw", "statistics match"),
]
for r, cc, img, title, note in panels:
    ax = fig.add_subplot(gs[r, cc])
    ax.imshow(img, cmap=CMAP)
    ax.set_xticks([]); ax.set_yticks([])
    for s in ax.spines.values():
        s.set_color(BORDER)
    t = title if note is None else f"{title}\n{note}"
    ax.set_title(t, loc="left", fontsize=10.5, **MONO, color=SOFT if r else TEXT)
save(fig, "gram-matrix", "permutation_invariance.png")

# --- Figure 2: VGG16 receptive fields ----------------------------------------
cfg = [64, "M", 128, "M", 256, 256, "M", 512, 512, "M", 512, 512, "M"]  # VGG16-B/D hybrid used by Gatys' conv counts
# Use the true VGG16 config: 2,2,3,3,3 convs
layers = [64, 64, "M", 128, 128, "M", 256, 256, 256, "M", 512, 512, 512, "M", 512, 512, 512, "M"]
names, rfs, strides, rf, sc = [], [], [], 1, 1
conv_i = 0
for L in layers:
    if L == "M":
        rf += 1 * sc; sc *= 2
        names.append(f"pool{names.count('pool')+ 0 or ''}" if False else f"pool{sum(1 for n in names if n.startswith('pool'))+1}")
    else:
        b = sum(1 for n in names if n.startswith("conv")) // 3 + 1  # rough
        conv_i += 1
        blk = 1 if conv_i <= 2 else 2 if conv_i <= 4 else 3 if conv_i <= 7 else 4 if conv_i <= 10 else 5
        idx_in_blk = conv_i - [0, 2, 4, 7, 10][blk - 1]
        names.append(f"conv{blk}_{idx_in_blk}")
        rf += 2 * sc
    rfs.append(rf); strides.append(sc)
style_layers = {"conv1_1", "conv2_1", "conv3_1", "conv4_1", "conv5_1"}
content_layer = "conv4_2"
print("[gram/rf] " + ", ".join(f"{n}:{r}" for n, r in zip(names, rfs)))

fig = fig2(10.2, 4.3)
ax = fig.add_subplot(1, 1, 1)
xs_ = np.arange(len(names))
for i, (n, r) in enumerate(zip(names, rfs)):
    if n in style_layers:
        ax.bar(i, r, color=ACC, width=0.72)
        ax.text(i, r + 3, n, rotation=90, fontsize=8.6, color=ACC, ha="center", va="bottom", **MONO)
    elif n == content_layer:
        ax.bar(i, r, color=TEXT, width=0.72)
        ax.text(i, r + 3, n, rotation=90, fontsize=8.6, color=TEXT, ha="center", va="bottom", **MONO)
    elif n.startswith("conv"):
        ax.bar(i, r, color=ACC2, alpha=0.55, width=0.72)
    else:
        ax.bar(i, r, color=BORDER, width=0.72)
        ax.text(i, r + 3, n, rotation=90, fontsize=8.2, color=MUTE, ha="center", va="bottom", **MONO)
ax.set_xticks([])
ax.set_xlabel("VGG16 depth →")
ax.set_ylabel("receptive field (px)")
ax.set_title("Receptive fields, computed: texture early, content late — "
             "style layers ■, content layer ■", loc="left", **MONO)
style_ax(ax)
save(fig, "gram-matrix", "receptive_fields.png")

print("ALL FIGURES DONE")
