/* ----------------------------------------------------------------------------
 * Content data for the portfolio.
 *   - cases:    flagship work, large cards linking to case-study pages
 *   - posts:    benchmark write-ups, list rows linking to post pages
 *   - lab:      side projects with real visual results (image, hook, chips)
 *   - projects: text-only chips for further GitHub repos
 * Kept as plain JS so the markup stays clean.
 * -------------------------------------------------------------------------- */

window.SITE_DATA = {
  cases: [
    {
      title: "AIMAG — X-ray Super-Resolution in Production",
      href: "projects/aimag.html",
      tag: "Computer Vision · Medical AI",
      blurb:
        "X-ray super-resolution and denoising, owned end-to-end — model R&D, INT8/FP16 quantization, TensorRT/C++ serving, and the QCA pipeline cardiologists use in live procedures.",
      kpis: [
        { v: "$200K+", l: "ARR" },
        { v: "600+", l: "FPS" },
        { v: "−70%", l: "latency" },
        { v: "0.94", l: "Dice" }
      ],
      chips: ["PyTorch", "TensorRT", "ONNX", "INT8/FP16", "FastAPI", "C++"]
    },
    {
      title: "Adaptive RAG — a Stateful Interviewer That Listens",
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
    }
  ],

  posts: [
    {
      title: "A MacBook Pro can serve an LLM. Then the second user arrives.",
      href: "posts/inference-lab.html",
      tag: "Part 1",
      date: "Aug 2026",
      dek: "mlx-lm vs llama.cpp under 1 fairness contract: 45–56 tok/s single-stream, and a throughput curve flat from 1 user to 32. Crash forensics find the lock."
    },
    {
      title: "3× the memory bought me 9%.",
      href: "posts/inference-lab-2.html",
      tag: "Part 2",
      date: "Aug 2026",
      dek: "K process-isolated instances behind 1 queue: +9% for 3× the RAM. The arithmetic says why — 1 instance already saturates the M4 Pro's memory bus."
    },
    {
      title: "256 levels is plenty. Here's the math that proves it.",
      href: "posts/int8-quantization.html",
      tag: "Inference",
      date: "Aug 2026",
      dek: "What INT8 quantization is and why it barely hurts — the affine map derived, the s/2 error bound, three calibrators that disagree on purpose, and the per-channel trick worth +6 dB."
    },
    {
      title: "Image search is geometry before it is learning.",
      href: "posts/image-search-geometry.html",
      tag: "Retrieval",
      date: "Aug 2026",
      dek: "How search-by-image works, from zero: the cosine/L2 proof, what precision 1.00 with recall 0.87 actually diagnoses, and the arithmetic that decides when exact search dies."
    },
    {
      title: "99.6% accuracy, completely useless.",
      href: "posts/dice-imbalance.html",
      tag: "Medical CV",
      date: "Aug 2026",
      dek: "In medical segmentation the target — a coronary vessel — is 0.39% of the pixels, and the standard loss trains a model that's great at everything else. Derived, then fixed with Dice."
    },
    {
      title: "The Gram matrix doesn't care where anything is.",
      href: "posts/gram-matrix.html",
      tag: "Deep Learning",
      date: "Aug 2026",
      dek: "Style transfer explained from zero — and its key object provably discards all position information (measured: 1.7e-18). Plus the receptive-field arithmetic behind the layer choices."
    },
    {
      title: "A file manager that understands your files — entirely offline.",
      href: "posts/ipic-architecture.html",
      tag: "Systems",
      date: "Aug 2026",
      dek: "ipic's architecture tour: one background pipeline indexes a disk for meaning — whisper for speech, i8 vectors in an mmap, crash-safe by design. No cloud, no API calls."
    },
    {
      title: "Three retrieval lanes, one formula to fuse them.",
      href: "posts/ipic-hybrid-search.html",
      tag: "Retrieval",
      date: "Aug 2026",
      dek: "Semantic search misses exact strings; keyword search misses meaning. ipic runs both plus filenames and fuses them with weighted reciprocal rank fusion — derived, computed, running in 4 ms."
    }
  ],

  /* Image-led showcase. The point: real inputs, real outputs. */
  lab: [
    {
      title: "ipic — a file manager that understands your files",
      repo: "ipic",
      hook:
        "Fully on-device RAG over your whole disk: type or speak a query, get ranked results across text, PDFs, audio and video. Rust, local whisper transcription, i8-quantized vectors — no cloud, ever.",
      img: "assets/img/posts/ipic-architecture/card.png",
      alt: "Simplified card diagram of ipic: your disk indexed locally with whisper, embeddings and FTS5; one typed or spoken query answered by three retrieval lanes fused with RRF",
      href: "https://github.com/anubhavagr/ipic",
      chips: ["Rust", "Hybrid RAG", "Whisper", "SQLite FTS5", "ONNX"]
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
