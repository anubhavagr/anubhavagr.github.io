/* ----------------------------------------------------------------------------
 * Portfolio interactions:
 *  - theme toggle (persisted)
 *  - sticky nav state + mobile menu
 *  - scrollspy for nav links
 *  - scroll-reveal via IntersectionObserver
 *  - animated metric counters
 *  - pointer-tracked card glow
 *  - dynamic project rendering (from data.js)
 *  - resume manifest fetch for "last updated" + cache-bust
 * -------------------------------------------------------------------------- */
(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------- Theme ------------------------------- */
  const THEME_KEY = "aa-theme";
  const root = document.documentElement;
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) root.setAttribute("data-theme", saved);
  else if (window.matchMedia("(prefers-color-scheme: light)").matches)
    root.setAttribute("data-theme", "light");

  function toggleTheme() {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next === "dark" ? "" : next);
    if (next === "dark") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, "light");
    updateThemeIcon();
  }
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
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

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
  const navlinkFor = (id) => $(`#nav-links a[href="#${id}"]`);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            $$("#nav-links a").forEach((a) => a.classList.remove("active"));
            const link = navlinkFor(e.target.id);
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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => rio.observe(el));
  }

  /* ----------------------- Metric counters --------------------------- */
  const counters = $$("[data-count]");
  function parseTarget(raw) {
    const m = String(raw).match(/^([\d.]+)(.*)$/);
    if (!m) return null;
    return { val: parseFloat(m[1]), suffix: m[2] };
  }
  function animateCount(el) {
    const target = parseTarget(el.dataset.count);
    if (!target) return;
    const dur = 1200;
    const start = performance.now();
    const decimals = (target.val.toString().split(".")[1] || "").length;
    function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = target.val * eased;
      el.textContent = v.toFixed(decimals) + target.suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target.val + target.suffix;
    }
    requestAnimationFrame(frame);
  }
  if (counters.length && !prefersReduced && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  /* --------------------- Pointer-tracked glow ------------------------ */
  $$(".card, .case").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* --------------------- Render projects ----------------------------- */
  function chip(c) {
    return `<span class="chip">${c}</span>`;
  }
  function renderCases() {
    const host = $("#cases");
    if (!host || !window.SITE_DATA) return;
    host.innerHTML = window.SITE_DATA.cases
      .map(
        (c) => `
      <a class="case reveal" href="${c.href}">
        <div class="case__body">
          <span class="card__tag">${c.tag}</span>
          <h3>${c.title}</h3>
          <p>${c.blurb}</p>
          <div class="kpis">
            ${c.kpis.map((k) => `<div class="kpi"><b>${k.v}</b><span>${k.l}</span></div>`).join("")}
          </div>
          <div class="chips">${c.chips.map(chip).join("")}</div>
          <span class="arrow">Read the case study
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </div>
        <div class="case__visual">${caseVisual(c)}</div>
      </a>`
      )
      .join("");
  }
  function caseVisual(c) {
    // Lightweight inline SVG "signature" graphic per case.
    if (c.href.includes("aimag")) {
      return `
      <svg class="stage" viewBox="0 0 320 200" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--accent-3)"/>
          </linearGradient>
        </defs>
        <rect x="30" y="34" width="120" height="132" rx="6" fill="none" stroke="var(--surface-line)" stroke-dasharray="3 4"/>
        <rect x="170" y="34" width="120" height="132" rx="6" fill="url(#g1)" opacity="0.12" stroke="var(--accent)"/>
        <path d="M40 130 Q70 70 100 110 T150 100 T210 80 T270 60" fill="none" stroke="url(#g1)" stroke-width="2"/>
        <path d="M180 130 Q210 70 240 110 T290 100" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
        <text x="36" y="24" font-family="var(--font-mono)" font-size="9" fill="var(--text-mute)">INPUT · low-dose</text>
        <text x="176" y="24" font-family="var(--font-mono)" font-size="9" fill="var(--accent)">AIMAG · 4× SR</text>
      </svg>`;
    }
    return `
      <svg class="stage" viewBox="0 0 320 200" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="g2" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stop-color="var(--accent)"/><stop offset="1" stop-color="var(--accent-2)"/>
          </linearGradient>
        </defs>
        ${[40, 75, 110, 145, 180].map((y, i) => `
          <circle cx="60" cy="${y}" r="6" fill="url(#g2)" opacity="${0.4 + i * 0.12}"/>
          <line x1="68" y1="${y}" x2="150" y2="100" stroke="var(--surface-line)"/>
        `).join("")}
        <circle cx="160" cy="100" r="14" fill="none" stroke="var(--accent)" stroke-width="1.5"/>
        <circle cx="160" cy="100" r="22" fill="none" stroke="var(--accent)" stroke-width="1" opacity=".4"/>
        <line x1="172" y1="100" x2="270" y2="100" stroke="url(#g2)" stroke-width="2"/>
        <polyline points="270,100 264,96 264,104" fill="none" stroke="var(--accent)" stroke-width="2"/>
        <text x="40" y="195" font-family="var(--font-mono)" font-size="9" fill="var(--text-mute)">3 retrieval paths · hybrid + cross-encoder</text>
      </svg>`;
  }
  function renderProjects() {
    const host = $("#projects");
    if (!host || !window.SITE_DATA) return;
    host.innerHTML = window.SITE_DATA.projects
      .map(
        (p) => `
      <a class="card reveal" href="${p.href}" target="_blank" rel="noopener">
        <span class="card__tag">${p.stars}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="chips" style="margin-top:.9rem">${p.chips.map(chip).join("")}</div>
      </a>`
      )
      .join("");
  }
  renderCases();
  renderProjects();

  /* ----------------------- Resume manifest --------------------------- */
  const resumeLinks = $$(".js-resume-link");
  const updatedEl = $("#resume-updated");
  // Try to load a manifest written by the resume repo CI. Fail silently.
  fetch("assets/resume.manifest.json", { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : null))
    .then((m) => {
      if (!m) return;
      if (resumeLinks.length && m.sha) {
        resumeLinks.forEach((resumeLink) => {
          const url = new URL(resumeLink.href, location.href);
          url.searchParams.set("v", String(m.sha).slice(0, 8));
          resumeLink.href = url.toString();
        });
      }
      if (updatedEl && m.updated) {
        const d = new Date(m.updated);
        if (!isNaN(d)) {
          updatedEl.textContent = d.toLocaleDateString("en-US", {
            year: "numeric", month: "short", day: "numeric"
          });
          updatedEl.closest("[data-updated-wrap]")?.classList.remove("is-hidden");
        }
      }
    })
    .catch(() => {});

  /* ----------------------- Footer year ------------------------------- */
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
