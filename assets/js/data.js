/* ----------------------------------------------------------------------------
 * Content data for the portfolio.
 *   - cases:    flagship work, large cards linking to case-study pages
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
        "Two years building and shipping an X-ray super-resolution & denoising product line end-to-end — model R&D, INT8/FP16 quantization, FastAPI/C++ serving, and the QCA pipeline cardiologists actually use.",
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
        "Built the retrieval & reasoning core behind an AI interviewer that adapts in real time — three parallel retrieval paths, hybrid search, cross-encoder re-ranking, and an eval harness as the source of truth.",
      kpis: [
        { v: "0.95", l: "Recall@5" },
        { v: "0.8s", l: "p50 latency" },
        { v: "−68%", l: "faster" },
        { v: "500+", l: "users" }
      ],
      chips: ["LangGraph", "RAG", "MongoDB", "Cross-Encoder", "Eval Harness"]
    },
    {
      title: "Inference Lab I — the Flat Line Under Mac LLM Serving",
      href: "posts/inference-lab.html",
      tag: "LLM Serving · Benchmarking",
      blurb:
        "mlx-lm vs llama.cpp on one M4 Pro — same Qwen2.5-7B model, same prompts, same fairness contract. 45–56 tok/s single-stream, then a throughput curve that stays flat from one user to thirty-two. Crash forensics find the lock; the fix everyone suggests becomes Part 2.",
      kpis: [
        { v: "56", l: "tok/s mlx" },
        { v: "45", l: "tok/s llama" },
        { v: "100 ms", l: "TTFT llama" },
        { v: "±4%", l: "conc 1→32" }
      ],
      chips: ["mlx-lm", "llama.cpp", "Metal", "Benchmarking"]
    },
    {
      title: "Inference Lab II — Three Times the Memory Bought Nine Percent",
      href: "posts/inference-lab-2.html",
      tag: "LLM Serving · Benchmarking",
      blurb:
        "The follow-up everyone asked for: K process-isolated model instances behind one queue, measured honestly at K=1,2,3. Three times the RAM buys +9% throughput — because one instance already streams ~250 GB/s of the M4 Pro's ~273 GB/s memory bus. The arithmetic, the proof, and why only continuous batching gets past it.",
      kpis: [
        { v: "+9%", l: "for 3× RAM" },
        { v: "246/273", l: "GB/s at K=1" },
        { v: "2.8×", l: "TPOT at K=3" },
        { v: "≈12×", l: "H100 predicted" }
      ],
      chips: ["multiprocessing", "Metal", "vLLM", "Roofline"]
    }
  ],

  /* Image-led showcase. The point: real inputs, real outputs. */
  lab: [
    {
      title: "Colorizing black-and-white photography",
      repo: "no_more_BWs",
      hook:
        "Two deep colorization models — ECCV'16 and SIGGRAPH'17 — run side by side over Ansel Adams landscapes and personal photos. Four-panel grid: original, B&W input, ECCV output, SIGGRAPH output.",
      img: "assets/img/projects/colorization.png",
      alt: "Four-panel colorization grid comparing ECCV and SIGGRAPH model outputs",
      href: "https://github.com/anubhavagr/no_more_BWs",
      chips: ["PyTorch", "Colorization", "ECCV'16", "SIGGRAPH'17"]
    },
    {
      title: "Painting photos with the style of other art",
      repo: "neural-style-transfer",
      hook:
        "Gatys et al. (2015) reimplemented from scratch in PyTorch — content + style aligned through VGG feature maps and Gram-matrix losses. Hundreds of style/content pairs rendered through one notebook.",
      img: "assets/img/projects/style-transfer-1.png",
      alt: "Neural style transfer output showing a content image restyled",
      href: "https://github.com/anubhavagr/neural-style-transfer",
      chips: ["PyTorch", "Gatys 2015", "VGG", "Gram loss"]
    },
    {
      title: "Stitching N photos into one wide view",
      repo: "Panorama-image-stitching",
      hook:
        "Feature matching → homography → warping → blending, end to end on OpenCV. Output below: three overlapping frames fused into a single 3815-pixel-wide panorama.",
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
        "Coronary artery segmentation with a U-Net++/ResNet50 encoder, a custom Sobel edge-enhancement layer, spatial attention, mixed-precision training, and a TensorRT export + benchmark path.",
      href: "https://github.com/anubhavagr/ArterySeg",
      note: "U-Net++ · ResNet50 · TensorRT",
      chips: ["PyTorch", "Segmentation", "TensorRT", "Medical"]
    },
    {
      name: "find-me-lens",
      desc:
        "Content-based image retrieval (a Google Lens clone) benchmarking five CNN backbones — ResNet34, MobileNetV2, EfficientNet-B0, DenseNet121, InceptionV3 — over FAISS. Measured 1.00 precision / 0.87 recall at ~30 ms inference.",
      href: "https://github.com/anubhavagr/find-me-lens",
      note: "P 1.00 · R 0.87 · 30 ms",
      chips: ["FAISS", "CNN", "Embeddings", "Python"]
    },
    {
      name: "VideoStabilization",
      desc:
        "Frame-to-frame affine trajectory extraction → smoothed via constrained optimization → cropped output following the smoothed path. Three sample clips in the repo.",
      href: "https://github.com/anubhavagr/VideoStabilization",
      note: "Affine · trajectory smoothing",
      chips: ["OpenCV", "Optimization", "Video"]
    },
    {
      name: "pytorch-cpp-tensorrt",
      desc:
        "End-to-end PyTorch → ONNX → TensorRT → C++ conversion walkthrough with notebooks for each stage. The pattern I use in production, distilled into a teaching repo.",
      href: "https://github.com/anubhavagr/pytorch-cpp-tensorrt",
      note: "5-stage pipeline",
      chips: ["TensorRT", "ONNX", "C++", "Deployment"]
    },
    {
      name: "Condio",
      desc:
        "A multiprocessing audio format converter that parallelizes batch conversion across CPU cores.",
      href: "https://github.com/anubhavagr/Condio",
      note: "multiprocessing",
      chips: ["Python", "Audio"]
    },
    {
      name: "LLMfromscratch",
      desc:
        "Active fork of a 36-project build-every-layer LLM manual — kept for deep architectural fluency on transformer internals.",
      href: "https://github.com/anubhavagr/LLMfromscratch",
      note: "36 projects",
      chips: ["LLM", "Transformers"]
    }
  ]
};
