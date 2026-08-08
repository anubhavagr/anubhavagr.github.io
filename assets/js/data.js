/* ----------------------------------------------------------------------------
 * Content data for the projects + OSS sections.
 * Kept as plain JS so the markup stays clean and new work can be added by
 * appending an object — no template surgery required.
 * -------------------------------------------------------------------------- */

window.SITE_DATA = {
  /* Flagship work — rendered as large case-study cards. */
  cases: [
    {
      title: "AIMAG — X-ray Super-Resolution Product",
      href: "projects/aimag.html",
      tag: "Computer Vision · Medical AI",
      blurb:
        "Owned the data, model R&D, quantization and release of an X-ray super-resolution & denoising product line driving $200K+ ARR — deployed in clinical cath-labs.",
      kpis: [
        { v: "$200K+", l: "ARR" },
        { v: "600+ FPS", l: "inference" },
        { v: "−70%", l: "latency" },
        { v: "−35%", l: "VRAM" }
      ],
      chips: ["PyTorch", "TensorRT", "ONNX", "INT8/FP16", "FastAPI", "C++"]
    },
    {
      title: "Adaptive RAG — Stateful LangGraph Agent",
      href: "projects/adaptive-rag.html",
      tag: "LLMs · Retrieval · Production",
      blurb:
        "Built a 3-path retrieval pipeline with hybrid search and cross-encoder re-ranking for a stateful interviewer agent — 0.95 Recall@5 over 10K+ docs at 0.8s p50.",
      kpis: [
        { v: "0.95", l: "Recall@5" },
        { v: "0.8s", l: "p50 latency" },
        { v: "−68%", l: "query time" },
        { v: "500+", l: "concurrent users" }
      ],
      chips: ["LangGraph", "RAG", "MongoDB", "Cross-Encoder", "Eval Harness"]
    }
  ],

  /* Open-source / side projects — sourced from GitHub. */
  projects: [
    {
      name: "ArterySeg",
      desc: "Coronary artery segmentation with a ResNet34/ResNet50 U-Net++ encoder, a custom Sobel edge-enhancement layer, spatial attention and mixed-precision training. Ships a TensorRT export + benchmark path.",
      href: "https://github.com/anubhavagr/ArterySeg",
      stars: "U-Net++ · ResNet50 · TensorRT",
      chips: ["PyTorch", "Segmentation", "TensorRT", "Medical"]
    },
    {
      name: "find-me-lens",
      desc: "Content-based image retrieval system (a Google Lens clone) benchmarking five CNN backbones with FAISS similarity search and a Tkinter query UI. Reports precision, recall, F1 and inference time.",
      href: "https://github.com/anubhavagr/find-me-lens",
      stars: "FAISS · 5 CNN backbones · CBIR",
      chips: ["FAISS", "ResNet", "Embeddings", "Python"]
    },
    {
      name: "no_more_BWs",
      desc: "Image colorization comparing ECCV and SIGSIGRAPH models end-to-end, with a four-panel visual comparison pipeline.",
      href: "https://github.com/anubhavagr/no_more_BWs",
      stars: "Colorization · GAN",
      chips: ["PyTorch", "CV"]
    },
    {
      name: "neural-style-transfer",
      desc: "From-scratch PyTorch implementation of Gatys et al. (2015) — A Neural Algorithm of Artistic Style.",
      href: "https://github.com/anubhavagr/neural-style-transfer",
      stars: "Gatys 2015 · PyTorch",
      chips: ["PyTorch", "Research"]
    },
    {
      name: "Condio",
      desc: "A multiprocessing audio format converter that parallelizes batch conversion across CPU cores.",
      href: "https://github.com/anubhavagr/Condio",
      stars: "multiprocessing",
      chips: ["Python", "Audio"]
    },
    {
      name: "LLMfromscratch",
      desc: "Build-every-layer walkthrough of an LLM across 36 projects — actively studied fork for deep architectural fluency.",
      href: "https://github.com/anubhavagr/LLMfromscratch",
      stars: "36-project LLM manual",
      chips: ["LLM", "Deep Learning"]
    }
  ]
};
