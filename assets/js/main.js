/* ----------------------------------------------------------------------------
 * Portfolio interactions:
 *  - sticky nav state + mobile menu
 *  - scrollspy for nav links
 *  - subtle scroll-reveal
 *  - dynamic work/project rendering (from data.js)
 *  - resume manifest fetch for "last updated" + cache-bust
 * -------------------------------------------------------------------------- */
(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------- Nav state ----------------------------- */
  const nav = $("#nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 8);
    const top = $("#to-top");
    if (top) top.classList.toggle("show", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = $("#burger");
  const links = $("#nav-links");
  if (burger && links) {
    burger.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    $$("a", links).forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  /* --------------------------- Scrollspy ----------------------------- */
  const sections = $$("section[id]");
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            $$("#nav-links a, .identity__index a").forEach((a) => a.classList.remove("active"));
            $$(`#nav-links a[href="#${e.target.id}"], .identity__index a[href="#${e.target.id}"]`)
              .forEach((a) => a.classList.add("active"));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* --------------------------- Reveal -------------------------------- */
  // Reusable: observe any .reveal that hasn't been enrolled yet, so it works
  // for static markup AND elements injected later by renderWork/renderProjects.
  let rio = null;
  function observeReveals() {
    const els = $$(".reveal:not(.reveal--watched)");
    if (!els.length) return;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => { el.classList.add("in", "reveal--watched"); });
      return;
    }
    if (!rio) {
      rio = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
    }
    els.forEach((el) => { el.classList.add("reveal--watched"); rio.observe(el); });
  }
  observeReveals();

  /* --------------------- Render work + projects --------------------- */
  // Static-first: index.html ships prerendered markup for crawlers and
  // no-JS readers; JS re-renders only when a grid is still empty.
  function renderWork() {
    const host = $("#work-grid");
    if (!host || !window.SITE_DATA || host.children.length) return;
    host.innerHTML = window.SITE_DATA.cases.map((c) => `
      <a class="case-card case-card--featured reveal" href="${c.href}">
        <span class="case-card__tag">${c.tag}</span>
        <h3>${c.title}</h3>
        <p>${c.blurb}</p>
        <div class="case-card__kpis">
          ${c.kpis.map((k) => `<div><b>${k.v}</b><span>${k.l}</span></div>`).join("\n          ")}
        </div>
        <span class="case-card__arrow">read case study →</span>
      </a>`).join("");
  }
  function renderPosts() {
    const host = $("#posts-grid");
    if (!host || !window.SITE_DATA || host.children.length) return;
    host.innerHTML = window.SITE_DATA.posts.map((p) => `
      <a class="post-row reveal" href="${p.href}">
        <div class="post-row__left">
          <span class="post-row__part">${p.tag}</span>
        </div>
        <div class="post-row__body">
          <h3>${p.title}<span class="post-row__arrow">→</span></h3>
          <p>${p.dek}</p>
        </div>
      </a>`).join("");
  }
  function renderLab() {
    const host = $("#lab-grid");
    if (!host || !window.SITE_DATA || host.children.length) return;
    host.innerHTML = window.SITE_DATA.lab.map((p) => `
      <a class="lab-card reveal" href="${p.href}" target="_blank" rel="noopener">
        <div class="lab-card__media">
          <img src="${p.img}" alt="${p.alt || ""}" loading="lazy" />
        </div>
        <div class="lab-card__body">
          <span class="lab-card__repo">${p.repo}</span>
          <h3>${p.title}</h3>
          <p>${p.hook}</p>
          <div class="chips">${p.chips.map((c) => `<span class="chip">${c}</span>`).join("")}</div>
          <span class="lab-card__arrow">open repo →</span>
        </div>
      </a>`).join("");
  }
  function renderProjects() {
    const host = $("#proj-grid");
    if (!host || !window.SITE_DATA || host.children.length) return;
    host.innerHTML = window.SITE_DATA.projects.map((p) => `
      <a class="proj-card reveal" href="${p.href}" target="_blank" rel="noopener">
        <div class="proj-card__top">
          <h3>${p.name}</h3>
          <span class="proj-card__note">${p.note || ""} →</span>
        </div>
        <p>${p.desc}</p>
        <div class="chips">${p.chips.map((c) => `<span class="chip">${c}</span>`).join("")}</div>
      </a>`).join("");
  }
  renderWork();
  renderPosts();
  renderLab();
  renderProjects();
  observeReveals(); // enroll the freshly injected cards

  /* --------------------- Posts list folding -------------------------- */
  // Long index walls overwhelm a first-time visitor: start with the recent
  // four and expand on demand. No-JS readers and crawlers see all rows —
  // collapsing only happens here, in script.
  const postsGrid = $("#posts-grid");
  const postsToggle = $("#posts-toggle");
  if (postsGrid && postsToggle && postsGrid.children.length > 4) {
    const total = postsGrid.children.length;
    postsGrid.classList.add("is-collapsed");
    postsToggle.classList.remove("is-hidden");
    postsToggle.textContent = `Show all ${total} posts ↓`;
    postsToggle.addEventListener("click", () => {
      const collapsed = postsGrid.classList.toggle("is-collapsed");
      postsToggle.textContent = collapsed ? `Show all ${total} posts ↓` : "Show fewer ↑";
      postsToggle.setAttribute("aria-expanded", String(!collapsed));
    });
  }

  /* ----------------------- Resume manifest --------------------------- */
  const resumeLinks = $$(".js-resume-link");
  const updatedEl = $("#resume-updated");
  fetch("assets/resume.manifest.json", { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : null))
    .then((m) => {
      if (!m) return;
      if (resumeLinks.length && m.sha) {
        resumeLinks.forEach((l) => {
          const url = new URL(l.href, location.href);
          url.searchParams.set("v", String(m.sha).slice(0, 8));
          l.href = url.toString();
        });
      }
      if (updatedEl && m.updated) {
        const d = new Date(m.updated);
        if (!isNaN(d)) {
          updatedEl.textContent = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
          updatedEl.closest("[data-updated-wrap]")?.classList.remove("is-hidden");
        }
      }
    })
    .catch(() => {});

  /* ----------------------- Footer year ------------------------------- */
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
