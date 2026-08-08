/* ----------------------------------------------------------------------------
 * Portfolio interactions (minimal):
 *  - theme toggle (persisted)
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

  /* ----------------------------- Theme ------------------------------- */
  const root = document.documentElement;
  const saved = localStorage.getItem("aa-theme");
  if (saved) root.setAttribute("data-theme", saved);
  else if (window.matchMedia("(prefers-color-scheme: light)").matches)
    root.setAttribute("data-theme", "light");

  function updateThemeIcon() {
    const isLight = root.getAttribute("data-theme") === "light";
    const icon = $("#theme-icon");
    if (!icon) return;
    icon.innerHTML = isLight
      ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
      : '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
  }
  updateThemeIcon();

  const themeBtn = $("#theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    if (isLight) { root.removeAttribute("data-theme"); localStorage.removeItem("aa-theme"); }
    else { root.setAttribute("data-theme", "light"); localStorage.setItem("aa-theme", "light"); }
    updateThemeIcon();
  });

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
            $$("#nav-links a").forEach((a) => a.classList.remove("active"));
            const link = $(`#nav-links a[href="#${e.target.id}"]`);
            if (link) link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* --------------------------- Reveal -------------------------------- */
  const revealEls = $$(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const rio = new IntersectionObserver(
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
    revealEls.forEach((el) => rio.observe(el));
  }

  /* --------------------- Render work + projects --------------------- */
  function chip(c) { return `<span class="chip">${c}</span>`; }
  function renderWork() {
    const host = $("#work-list");
    if (!host || !window.SITE_DATA) return;
    host.innerHTML = window.SITE_DATA.cases.map((c) => `
      <a class="work-item reveal" href="${c.href}">
        <div class="work-item__top">
          <h3>${c.title}</h3>
          <span class="work-item__tag">case study →</span>
        </div>
        <p>${c.blurb}</p>
        <div class="work-item__meta">
          ${c.kpis.map((k) => `<span><b>${k.v}</b> ${k.l}</span>`).join("")}
        </div>
      </a>`).join("");
  }
  function renderProjects() {
    const host = $("#proj-list");
    if (!host || !window.SITE_DATA) return;
    host.innerHTML = window.SITE_DATA.projects.map((p) => `
      <a class="proj-item reveal" href="${p.href}" target="_blank" rel="noopener">
        <div class="proj-item__top">
          <h3>${p.name}</h3>
          <span class="proj-item__note">${p.stars} →</span>
        </div>
        <p>${p.desc}</p>
        <div class="chips">${p.chips.map(chip).join("")}</div>
      </a>`).join("");
  }
  renderWork();
  renderProjects();

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
