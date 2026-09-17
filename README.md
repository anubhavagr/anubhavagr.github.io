# anubhavagr.github.io

Personal portfolio of **Anubhav Agrawal** — AI Engineer.
Live at **[anubhavagr.github.io](https://anubhavagr.github.io/)**.

## Stack

Zero build step. Plain HTML + CSS + vanilla JS, served statically by GitHub Pages.

```
index.html                      # landing (orientation rail, work, blogs, open source, experience, skills, contact)
projects/
  adaptive-rag.html             # case study — stateful LangGraph RAG agent
  xray-superres.html            # case study — real-time blind X-ray super-resolution
posts/                          # 9 engineering posts (inference series, ipic series, ML theory)
assets/
  css/styles.css                # design system (tokens, layout rail, components)
  js/main.js                    # interactions (nav, scrollspy, reveal, rendering, posts folding, résumé manifest)
  js/data.js                    # content data for cards and post rows
  img/favicon.svg, og.svg, og.png
  anubhav-agrawal-resume.pdf    # latest résumé (kept in sync by the resume repo CI — see below)
  resume.manifest.json          # { updated, sha } for "last updated" + cache-bust
robots.txt, sitemap.xml         # crawler surface
```

Note: the homepage grids are prerendered as static HTML for crawlers and
no-JS readers; `main.js` re-renders a grid only when it is empty. When
editing `data.js`, regenerate the matching static rows in `index.html`.

## Résumé auto-deploy

The résumé PDF is **not** edited here. Source of truth is the private
[`resume`](https://github.com/anubhavagr/resume) repo (`main.tex`).

A GitHub Actions workflow in that repo compiles `main.tex` to PDF and pushes
`assets/anubhav-agrawal-resume.pdf` (+ a small `resume.manifest.json`) into this
repo. The site fetches the manifest at runtime to display "last updated" and to
cache-bust the download link.

## Run locally

Just open `index.html` — or:

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```
