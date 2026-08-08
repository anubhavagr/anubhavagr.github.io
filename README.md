# anubhavagr.github.io

Personal portfolio of **Anubhav Agrawal** — Machine Learning Engineer.
Live at **[anubhavagr.github.io](https://anubhavagr.github.io/)**.

## Stack

Zero build step. Plain HTML + CSS + vanilla JS, served statically by GitHub Pages.

```
index.html                      # landing (hero, work, experience, projects, skills, patents, contact)
projects/
  aimag.html                    # case study — X-ray super-resolution product ($200K+ ARR)
  adaptive-rag.html             # case study — stateful LangGraph RAG agent
assets/
  css/styles.css                # design system (tokens, themes, components)
  js/main.js                    # interactions (theme, scrollspy, reveal, project rendering, résumé manifest)
  js/data.js                    # content data for case-study + project cards
  img/favicon.svg, og.svg
  anubhav-agrawal-resume.pdf    # latest résumé (kept in sync by the resume repo CI — see below)
  resume.manifest.json          # { updated, sha } for "last updated" + cache-bust
```

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
