/* ----------------------------------------------------------------------------
 * Content data for the portfolio.
 *   - cases:    flagship work, large cards linking to case-study pages
 *   - posts:    benchmark write-ups, list rows linking to post pages
 *   - lab:      side projects with real visual results (image, hook, chips)
 *   - projects: text-only chips for further GitHub repos
 * Kept as plain JS so the markup stays clean.
 *
 * NOTE: index.html prerenders these lists into static markup for crawlers
 * and no-JS readers. Regenerate the static rows when editing below.
 * -------------------------------------------------------------------------- */

window.SITE_DATA = {
  cases: [
    {
      title: "Adaptive RAG — a stateful interviewer that listens",
      href: "projects/adaptive-rag.html",
      tag: "LLMs · Retrieval · Production",
      blurb:
        "Built the retrieval and reasoning core behind an AI interviewer that adapts in real time — three parallel retrieval paths, hybrid search, cross-encoder re-ranking, and an eval harness as the source of truth.",
      kpis: [
        { v: "0.95", l: "Recall@5" },
        { v: "0.8s", l: "p50 latency" },
        { v: "−68%", l: "faster" },
        { v: "500+", l: "users" }
      ],
      chips: ["LangGraph", "RAG", "MongoDB", "Cross-Encoder", "Eval Harness"]
    },
    {
      title: "Real-time blind X-ray image super-resolution",
      href: "projects/xray-superres.html",
      tag: "Computer Vision · Medical AI",
      blurb:
        "Super-resolution and denoising on live cath-lab feeds — owned end-to-end from model R&D through INT8/FP16 quantization to TensorRT/C++ serving, plus the automatic QCA pipeline cardiologists use mid-procedure. Three patents applied for.",
      kpis: [
        { v: "$200K+", l: "ARR" },
        { v: "600+", l: "FPS · RTX 4090" },
        { v: "−70%", l: "latency" },
        { v: "0.94", l: "Dice · QCA" }
      ],
      chips: ["PyTorch", "TensorRT", "ONNX", "INT8/FP16", "FastAPI", "C++"]
    }
  ],

  posts: [
    {
      title: "Scaling a vector index to 350,000 files: sharding, backpressure, and a CLIP vision lane",
      href: "posts/ipic-v2-scale.html",
      img: "assets/img/posts/ipic-architecture/app-search.png",
      alt: "Real screenshot of the ipic application: a natural-language search returning ranked hits across file types with live status",
      tag: "Performance",
      dek: "Part 3: the v2 rewrite — per-root shards with bounded-channel backpressure, a CLIP vision lane that nearly starved, a compute budget, measured results at 350k-file scale, and what shipped after: store compaction, whole-home default scope, v0.1.1 as a macOS DMG."
    },
    {
      title: "Serving an LLM on a MacBook Pro: mlx-lm vs llama.cpp, from 1 user to 32",
      href: "posts/inference-lab.html",
      img: "assets/img/posts/inference-lab/sweep_throughput.png",
      alt: "Line chart showing aggregate throughput staying flat from 1 concurrent user to 32",
      tag: "Part 1",
      dek: "mlx-lm vs llama.cpp under 1 fairness contract: 45–56 tok/s single-stream, and a throughput curve flat from 1 user to 32. Crash forensics find the lock."
    },
    {
      title: "Multi-instance LLM serving: why 3× the memory bought only 9% more throughput",
      href: "posts/inference-lab-2.html",
      img: "assets/img/posts/inference-lab/dispatch_scaling.png",
      alt: "Dispatch benchmark chart from Part 2 of the inference-lab series",
      tag: "Part 2",
      dek: "K process-isolated instances behind 1 queue: +9% for 3× the RAM. The arithmetic says why — 1 instance already saturates the M4 Pro's memory bus."
    },
    {
      title: "How INT8 quantization works: calibration, error bounds, and why accuracy barely drops",
      href: "posts/int8-quantization.html",
      img: "assets/img/posts/int8-quantization/calibration.png",
      alt: "Calibration experiment: activation histogram with three candidate ranges, and error curves versus clip threshold",
      tag: "Inference",
      dek: "What INT8 quantization is and why it barely hurts — the affine map derived, the s/2 error bound, three calibrators that disagree on purpose, and the per-channel trick worth +6 dB."
    },
    {
      title: "Cosine similarity vs Euclidean distance: what matters for image search",
      href: "posts/image-search-geometry.html",
      img: "assets/img/posts/image-search-geometry/geometry.png",
      alt: "Unit-sphere geometry of embeddings: squared distance versus cosine similarity, and two classes separated by angle",
      tag: "Retrieval",
      dek: "How search-by-image works, from zero: the cosine/L2 proof, what precision 1.00 with recall 0.87 actually diagnoses, and the arithmetic that decides when exact search dies."
    },
    {
      title: "Class imbalance in medical segmentation: why cross-entropy fails and Dice loss works",
      href: "posts/dice-imbalance.html",
      img: "assets/img/posts/dice-imbalance/ce_vs_dice.png",
      alt: "Cross-entropy and Dice loss curves showing opposite optima under class imbalance",
      tag: "Medical CV",
      dek: "In medical segmentation the target — a coronary vessel — is 0.39% of the pixels, and the standard loss trains a model that's great at everything else. Derived, then fixed with Dice."
    },
    {
      title: "How neural style transfer works: VGG features, Gram matrices, and receptive fields",
      href: "posts/gram-matrix.html",
      img: "assets/img/posts/gram-matrix/permutation_invariance.png",
      alt: "Gram matrices before and after shuffling every feature position, unchanged to machine precision",
      tag: "Deep Learning",
      dek: "Style transfer explained from zero — and its key object provably discards all position information (measured: 1.7e-18). Plus the receptive-field arithmetic behind the layer choices."
    },
    {
      title: "On-device semantic file search in Rust: the ipic engine architecture",
      href: "posts/ipic-architecture.html",
      img: "assets/img/posts/ipic-architecture/arch.png",
      alt: "Diagram of the v1 ipic engine: one indexing pipeline feeding SQLite FTS5 and an i8 vector store, and a query path with three retrieval lanes fused by weighted reciprocal rank fusion",
      tag: "Rust",
      dek: "Part 1 of the ipic build log: the first engine — 3 retrieval lanes fused by RRF, an i8-quantized mmap'd vector store, whisper on CPU, crash-safety by job state. One focused week, 23 commits."
    },
    {
      title: "Hybrid search with reciprocal rank fusion: semantic, keyword, filename, and vision lanes",
      href: "posts/ipic-hybrid-search.html",
      img: "assets/img/posts/ipic-hybrid-search/rrf_fusion.png",
      alt: "Reciprocal rank fusion: computed fused scores for seven documents across semantic, vision and keyword lanes, and the effect of the constant k",
      tag: "Hybrid Search",
      dek: "Part 2: the ranking math — weighted reciprocal rank fusion across semantic, vision, keyword and filename lanes, derived from requirements and computed on a worked example. No re-ranker, 4–10 ms."
    }
  ],

  /* Image-led showcase. The point: real inputs, real outputs. */
  lab: [
    {
      title: "ipic — a file manager that understands your files",
      repo: "ipic",
      hook:
        "Fully on-device RAG over your entire home directory: type or speak a query, get ranked results across text, PDFs, audio, video and images. Rust, local whisper transcription, i8-quantized vectors — no cloud, ever. Shipped as a macOS DMG.",
      img: "assets/img/posts/ipic-architecture/app-search.png",
      alt: "Real screenshot of the ipic app: a natural-language search returning 100 ranked hits across file types, with a status bar showing text and CLIP-vision embedders and image-content search active",
      href: "https://github.com/anubhavagr/ipic",
      chips: ["Rust", "Hybrid RAG", "Whisper", "SQLite FTS5", "ONNX", "macOS DMG · v0.1.1"]
    },
    {
      title: "Colorizing black-and-white photography",
      repo: "no_more_BWs",
      hook:
        "ECCV'16 and SIGGRAPH'17 colorization run side by side over Ansel Adams landscapes and personal photos. Four-panel grid: original, B&W input, both outputs.",
      img: "assets/img/projects/colorization.png",
      alt: "Four-panel colorization grid comparing ECCV and SIGGRAPH model outputs",
      href: "https://github.com/anubhavagr/no_more_BWs",
      chips: ["PyTorch", "Colorization", "ECCV'16", "SIGGRAPH'17"]
    },
    {
      title: "Painting photos with the style of other art",
      repo: "neural-style-transfer",
      hook:
        "Gatys et al. (2015) reimplemented from scratch — content + style aligned through VGG feature maps and Gram-matrix losses.",
      img: "assets/img/projects/style-transfer-1.png",
      alt: "Neural style transfer output showing a content image restyled",
      href: "https://github.com/anubhavagr/neural-style-transfer",
      chips: ["PyTorch", "Gatys 2015", "VGG", "Gram loss"]
    },
    {
      title: "Stitching N photos into 1 wide view",
      repo: "Panorama-image-stitching",
      hook:
        "Feature matching → homography → warping → blending, end to end on OpenCV. 3 overlapping frames fused into a 3815-px panorama.",
      img: "assets/img/projects/panorama.png",
      alt: "Wide panorama stitched from three overlapping photographs",
      href: "https://github.com/anubhavagr/Panorama-image-stitching",
      chips: ["OpenCV", "Feature Matching", "Homography"]
    }
  ],

  /* Compact chips for further repos — text only. */
  projects: [
    {
      name: "ArterySeg",
      desc:
        "Coronary artery segmentation — U-Net++/ResNet50 encoder, Sobel edge-enhancement layer, spatial attention, TensorRT export.",
      href: "https://github.com/anubhavagr/ArterySeg",
      note: "U-Net++ · ResNet50 · TensorRT",
      chips: ["PyTorch", "Segmentation", "TensorRT", "Medical"]
    },
    {
      name: "find-me-lens",
      desc:
        "Content-based image retrieval over FAISS, benchmarking five CNN backbones. 1.00 precision / 0.87 recall at ~30 ms.",
      href: "https://github.com/anubhavagr/find-me-lens",
      note: "P 1.00 · R 0.87 · 30 ms",
      chips: ["FAISS", "CNN", "Embeddings", "Python"]
    },
    {
      name: "VideoStabilization",
      desc:
        "Affine trajectory extraction → constrained-optimization smoothing → path-following crop.",
      href: "https://github.com/anubhavagr/VideoStabilization",
      note: "Affine · trajectory smoothing",
      chips: ["OpenCV", "Optimization", "Video"]
    },
    {
      name: "pytorch-cpp-tensorrt",
      desc:
        "PyTorch → ONNX → TensorRT → C++ walkthrough, 1 notebook per stage. The pattern I use in production.",
      href: "https://github.com/anubhavagr/pytorch-cpp-tensorrt",
      note: "5-stage pipeline",
      chips: ["TensorRT", "ONNX", "C++", "Deployment"]
    },
    {
      name: "Condio",
      desc:
        "Multiprocessing audio format converter across CPU cores.",
      href: "https://github.com/anubhavagr/Condio",
      note: "multiprocessing",
      chips: ["Python", "Audio"]
    },
    {
      name: "LLMfromscratch",
      desc:
        "Active fork of a 36-project build-every-layer LLM manual.",
      href: "https://github.com/anubhavagr/LLMfromscratch",
      note: "36 projects",
      chips: ["LLM", "Transformers"]
    }
  ]
};
