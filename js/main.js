import { products } from "./products.js";
import { collections, stores } from "./stores.js";
import { createProjectCarousel } from "./showcase.js";

document.documentElement.classList.add("has-js");

const pages = [
  ["index.html", "Home", "home"],
  ["portfolio.html", "Portfolio", "portfolio"],
  ["about.html", "About", "about"],
  ["resume.html", "Resume", "resume"],
  ["entertainment.html", "Entertainment", "entertainment"],
  ["contact.html", "Contact", "contact"],
];

const iconSvg = (name, size = 20, className = "") =>
  `<svg class="icon icon-${size} icon-${name}${className ? ` ${className}` : ""}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="img/icons.svg#${name}"></use></svg>`;

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[char]));

const themeIcon = (theme) => iconSvg(theme === "dark" ? "sun" : "moon");
const homeAnchor = (id) => `${document.body?.dataset.page === "home" ? "" : "index.html"}#${id}`;

function renderHeader() {
  const currentTheme = document.documentElement.dataset.theme;
  const pageLinks = pages.map(([href, label, page]) =>
    `<a href="${href}"${document.body?.dataset.page === page ? ' aria-current="page"' : ""}>${label}</a>`
  ).join("");
  return `
    <header class="site-header">
      <div class="nav-shell">
        <a class="brand" href="index.html#home" aria-label="Jolan Clark A. Sorillo home"><span>Jolan</span></a>
        <div class="nav-actions">
          <button class="theme-toggle" type="button" aria-label="Switch to ${currentTheme === "dark" ? "light" : "dark"} theme" aria-pressed="${currentTheme === "dark"}">${themeIcon(currentTheme)}</button>
          <button class="menu-toggle" type="button" aria-label="Open page navigation" aria-expanded="false" aria-controls="primary-navigation">
            <svg class="menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>
      <nav class="nav-menu" id="primary-navigation" aria-label="Pages" inert>
        ${pageLinks}
      </nav>
    </header>`;
}

function renderQuickNavigation() {
  return "";
}

function renderFooter() {
  const links = [
    ["Home", "index.html", "house"],
    ["Portfolio", "portfolio.html", "briefcase"],
    ["Entertainment", "entertainment.html", "sparkles"],
    ["About", "about.html", "file-text"],
    ["Resume", "resume.html", "file-text"],
    ["Shop", "shop.html", "store"],
    ["CICS", "cics.html", "sparkles"],
    ["NISU", "nisu.html", "shield-check"],
    ["Contact", "contact.html", "mail"],
  ];

  const footerNav = links.map(([label, href, icon]) =>
    `<a class="footer-nav-link" href="${href}">${iconSvg(icon, 16)}<span>${label}</span></a>`
  ).join("");

  return `
    <footer class="site-footer">
      <div class="container">
        <nav class="footer-primary-nav" aria-label="Footer navigation">
          ${footerNav}
        </nav>

        <div class="footer-divider" style="height: 1px; background: var(--color-border); margin-block: 1rem;"></div>

        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
          <nav class="footer-socials" aria-label="Social links">
            <a href="https://www.facebook.com/larck.sorillo/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">${iconSvg("facebook", 18)}</a>
            <a href="https://www.instagram.com/larck.sorillo/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${iconSvg("instagram", 18)}</a>
            <a href="https://www.linkedin.com/in/jolan-clark-sorillo-011197256/?originalSubdomain=ph" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${iconSvg("linkedin", 18)}</a>
            <a href="https://github.com/JCsorillo" target="_blank" rel="noopener noreferrer" aria-label="GitHub">${iconSvg("github", 18)}</a>
            <a href="https://wa.me/639287328109" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">${iconSvg("whatsapp", 18)}</a>
            <a href="viber://chat?number=%2B639287328109" aria-label="Viber">${iconSvg("viber", 18)}</a>
          </nav>

          <nav class="footer-legal-links" aria-label="Legal links">
            <a href="privacy.html">Privacy Policy</a>
            <a href="legal.html">Legal Disclaimer</a>
            <button class="cookie-preferences-button" type="button" data-open-cookie-preferences>Cookie preferences</button>
          </nav>
        </div>

        <p class="footer-bottom" style="margin-top: 0.75rem; border-top: none; padding: 0;">© ${new Date().getFullYear()} Jolan Clark A. Sorillo. All rights reserved.</p>
      </div>
    </footer>`;
}

function initStaticIcons() {
  const headingIcons = {
    "featured-title": "sparkles",
    "home-app-title": "package",
    "apps-title": "package",
    "picks-title": "tag",
    "collections-title": "sparkles",
    "skills-title": "shield-check",
    "experience-title": "briefcase",
    "projects-title": "file-text",
    "education-title": "file-text",
    "faq-title": "message-circle",
  };
  Object.entries(headingIcons).forEach(([id, icon]) => {
    const heading = document.getElementById(id);
    if (!heading) return;
    heading.classList.add("icon-heading");
    heading.insertAdjacentHTML("afterbegin", iconSvg(icon, 24));
  });
  const contactHeading = document.querySelector(".contact-form-panel .section-heading h2");
  if (contactHeading) {
    contactHeading.classList.add("icon-heading");
    contactHeading.insertAdjacentHTML("afterbegin", iconSvg("mail", 24));
  }
  const resumeIcons = {
    Profile: "file-text",
    Skills: "shield-check",
    Education: "file-text",
    Recognition: "sparkles",
    "Professional experience": "briefcase",
    "Selected projects": "briefcase",
    "Additional information": "file-text",
  };
  document.querySelectorAll(".resume-section h2").forEach((heading) => {
    const icon = resumeIcons[heading.textContent.trim()];
    if (!icon) return;
    heading.classList.add("icon-heading");
    heading.insertAdjacentHTML("afterbegin", iconSvg(icon, 24));
  });

  document.querySelectorAll(".contact-card h3").forEach((heading) => {
    const icon = {
      WhatsApp: "whatsapp",
      Viber: "viber",
      Email: "mail",
      Social: "message-circle",
    }[heading.textContent.trim()];
    if (icon) heading.insertAdjacentHTML("afterbegin", iconSvg(icon, 24));
  });

  document.querySelectorAll(".store-filter-group > .filter-label").forEach((label, index) => {
    label.insertAdjacentHTML("afterbegin", iconSvg(index === 0 ? "filter" : "tag"));
  });

  const socialIcons = {
    Facebook: "facebook",
    Instagram: "instagram",
    LinkedIn: "linkedin",
    GitHub: "github",
    WhatsApp: "whatsapp",
    Viber: "viber",
  };
  document.querySelectorAll(".social-links a").forEach((link) => {
    const label = link.textContent.replace(/[↗→]/g, "").trim();
    if (socialIcons[label]) {
      link.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace(/\s*[↗→]\s*$/, "");
      });
      link.insertAdjacentHTML("afterbegin", iconSvg(socialIcons[label]));
      link.insertAdjacentHTML("beforeend", iconSvg("arrow-up-right", 20, "icon-arrow"));
    }
  });

  document.querySelectorAll(".inline-link").forEach((link) => {
    link.querySelectorAll('[aria-hidden="true"]').forEach((element) => {
      if (/^[↗→]$/.test(element.textContent.trim())) element.remove();
    });
    link.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace(/\s*[↗→]\s*$/, "");
    });
    link.insertAdjacentHTML("beforeend", iconSvg("arrow-up-right", 20, "icon-arrow"));
  });

  document.querySelectorAll(".button").forEach((button) => {
    if (button.querySelector(".icon")) return;
    const label = button.textContent.trim();
    const icon = label.startsWith("Download") ? "download"
      : label.startsWith("View Resume") || label.startsWith("Resume") ? "file-text"
      : label.startsWith("View on") ? "external-link"
        : label.startsWith("Search") ? "search"
          : label.startsWith("Go to Shop") ? "store"
            : label.startsWith("Go to Home") ? "house"
              : label.startsWith("Portfolio and Education") ? "briefcase"
            : label.startsWith("Print") ? "file-text"
              : label.startsWith("Inquire") ? "message-circle"
                : label.includes("email") || label.includes("Email") ? "mail"
                  : /[↗→]/.test(label) || label.startsWith("Show more") ? "arrow-up-right" : "";
    if (!icon) return;
    button.querySelectorAll('[aria-hidden="true"]').forEach((element) => {
      if (/^[↗→]$/.test(element.textContent.trim())) element.remove();
    });
    button.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace(/\s*[↗→]\s*$/, "");
    });
    button.insertAdjacentHTML("beforeend", iconSvg(icon, 20, icon === "arrow-up-right" || icon === "external-link" ? "icon-arrow" : ""));
  });

  document.querySelectorAll(".footer-column h2").forEach((heading) => {
    if (heading.querySelector(".icon")) return;
    const icon = socialIcons[heading.textContent.trim()] || ({
      Shop: "store",
      Portfolio: "briefcase",
      Resume: "file-text",
      Contact: "mail",
    }[heading.textContent.trim()]);
    if (icon) heading.insertAdjacentHTML("afterbegin", iconSvg(icon));
  });
}

function initCommandPalette() {
  document.body.insertAdjacentHTML("beforeend", `
    <dialog class="modal command-palette" id="command-palette" aria-label="Quick navigation">
      <div class="modal-card">
        <label class="visually-hidden" for="command-search">Search pages, apps, and collections</label>
        <input class="command-search" id="command-search" type="search" placeholder="Search pages, apps, and collections" autocomplete="off">
        <nav class="command-list" id="command-list" aria-label="Quick results"></nav>
        <p class="palette-hint">Press Esc to close · Ctrl/Cmd + K to open</p>
      </div>
    </dialog>`);
  const dialog = document.querySelector("#command-palette");
  const input = document.querySelector("#command-search");
  const list = document.querySelector("#command-list");
  const commands = [
    ...pages.map(([href, label]) => ({ label, description: "Page", href })),
    { label: "Contact", description: "Page", href: "contact.html" },
    { label: "Bebet Mobile Kiosk", description: "Featured App Showcase", href: "index.html#featured-app" },
    { label: "Portfolio & Deployed Work", description: "Portfolio", href: "portfolio.html" },
    { label: "Resume & Background", description: "Resume", href: "resume.html" },
  ];
  const renderCommands = (query = "") => {
    const normalizedQuery = query.toLowerCase().trim();
    const matches = commands.filter((command) =>
      `${command.label} ${command.description}`.toLowerCase().includes(normalizedQuery),
    );
    list.innerHTML = matches.length
      ? matches.map((command) => `<a class="command-item" href="${escapeHtml(command.href)}"><span>${escapeHtml(command.label)}</span><small>${escapeHtml(command.description)}</small></a>`).join("")
      : '<p class="command-empty">No matching pages or items.</p>';
  };
  renderCommands();
  input.addEventListener("input", () => renderCommands(input.value));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialog.open) {
      dialog.close();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (!dialog.open) dialog.showModal();
      input.value = "";
      renderCommands();
      input.focus();
    }
  });
}

function initShell() {
  const header = document.querySelector("#site-header");
  const footer = document.querySelector("#site-footer");
  if (header) header.innerHTML = renderHeader();
  if (footer) footer.innerHTML = renderFooter();

  const siteHeader = document.querySelector(".site-header");
  const setThemeColor = () => {
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = getComputedStyle(document.body).getPropertyValue("--color-bg").trim();
  };
  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("theme", theme); } catch {}
    setThemeColor();
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(theme === "dark"));
      btn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
      btn.innerHTML = themeIcon(theme);
    });
  };
  let themeTransitionRunning = false;
  setThemeColor();
  const updateHeader = () => siteHeader?.classList.toggle("is-condensed", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const menuToggle = siteHeader?.querySelector(".menu-toggle");
  const menu = siteHeader?.querySelector(".nav-menu");
  const setMenuOpen = (isOpen) => {
    if (!menuToggle || !menu) return;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close page navigation" : "Open page navigation");
    menu.inert = !isOpen;
    siteHeader.classList.toggle("menu-open", isOpen);
  };
  menuToggle?.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  menu?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });
  document.addEventListener("pointerdown", (event) => {
    if (menuToggle?.getAttribute("aria-expanded") !== "true") return;
    if (menu?.contains(event.target) || menuToggle?.contains(event.target)) return;
    setMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || menuToggle?.getAttribute("aria-expanded") !== "true") return;
    setMenuOpen(false);
    menuToggle.focus();
  });

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest(".theme-toggle");
    if (!toggle) return;
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof document.startViewTransition !== "function" || prefersReducedMotion || themeTransitionRunning) {
      applyTheme(nextTheme);
      return;
    }

    const bounds = toggle.getBoundingClientRect();
    const originX = bounds.left + bounds.width / 2;
    const originY = bounds.top + bounds.height / 2;
    const radius = Math.hypot(
      Math.max(originX, window.innerWidth - originX),
      Math.max(originY, window.innerHeight - originY),
    );
    root.style.setProperty("--theme-transition-x", `${originX}px`);
    root.style.setProperty("--theme-transition-y", `${originY}px`);
    root.style.setProperty("--theme-transition-radius", `${radius}px`);
    themeTransitionRunning = true;
    const clearTransitionState = () => {
      themeTransitionRunning = false;
      root.style.removeProperty("--theme-transition-x");
      root.style.removeProperty("--theme-transition-y");
      root.style.removeProperty("--theme-transition-radius");
    };
    let transition;
    try {
      transition = document.startViewTransition(() => applyTheme(nextTheme));
    } catch (error) {
      clearTransitionState();
      applyTheme(nextTheme);
      console.warn("Theme view transition failed; applying the theme without animation.", error);
      return;
    }
    transition.finished.then(clearTransitionState, clearTransitionState);
  });

  document.querySelector(".next-section-btn")?.addEventListener("click", () => {
    const sections = [...document.querySelectorAll("section.container, .section, #about-section, #workstation-specs, #portfolio-section, #faq-section, #contact-section")];
    const scrollPos = window.scrollY + 120;
    const nextSection = sections.find((sec) => sec.offsetTop > scrollPos) || sections[0];
    if (nextSection) {
      window.scrollTo({
        top: nextSection.offsetTop - 80,
        behavior: "smooth"
      });
    }
  });

  initStaticIcons();
  initCommandPalette();
  initAuroraEffects();
  initQuickNavigation();
}

function initQuickNavigation() {
  if (document.querySelector("[data-quick-navigation]")) return;
  const isHomePage = document.body?.dataset.page === "home";
  const floatingNav = document.createElement("div");
  floatingNav.className = `floating-navigation${isHomePage ? " has-section-links" : ""}`;
  floatingNav.dataset.quickNavigation = "";
  floatingNav.innerHTML = `
    <button class="back-to-top" type="button" data-back-to-top aria-label="Back to top" title="Back to top">
      <span aria-hidden="true">↑</span>
    </button>
    ${isHomePage ? renderQuickNavigation() : ""}`;
  document.body.append(floatingNav);
  const button = floatingNav.querySelector("[data-back-to-top]");

  const updateConsentOffset = () => {
    const consent = document.querySelector(".cookie-consent-banner");
    if (!consent) {
      floatingNav.style.removeProperty("--quick-navigation-bottom");
      return;
    }
    const consentBounds = consent.getBoundingClientRect();
    const consentIsFixed = getComputedStyle(consent).position === "fixed";
    if (!consentIsFixed && (consentBounds.top >= window.innerHeight || consentBounds.bottom <= 0)) {
      floatingNav.style.removeProperty("--quick-navigation-bottom");
      return;
    }
    const offset = window.innerHeight - consentBounds.top + 16;
    floatingNav.style.setProperty("--quick-navigation-bottom", `${Math.ceil(offset)}px`);
  };
  const consentResizeObserver = typeof ResizeObserver !== "undefined"
    ? new ResizeObserver(updateConsentOffset)
    : null;
  const syncConsentOffset = () => {
    const consent = document.querySelector(".cookie-consent-banner");
    consentResizeObserver?.disconnect();
    if (consent) consentResizeObserver?.observe(consent);
    updateConsentOffset();
  };
  new MutationObserver(syncConsentOffset).observe(document.body, { childList: true });
  window.addEventListener("resize", updateConsentOffset, { passive: true });
  window.addEventListener("scroll", updateConsentOffset, { passive: true });
  syncConsentOffset();

  button.addEventListener("click", () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) window.scrollTo(0, 0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function alignLocationHash() {
  if (!window.location.hash) return;
  const target = document.getElementById(window.location.hash.slice(1));
  if (!target) return;
  const headingId = target.getAttribute("aria-labelledby");
  const scrollTarget = (headingId && document.getElementById(headingId)) || target.querySelector("h1, h2, h3") || target;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom || 0;
    const top = window.scrollY + scrollTarget.getBoundingClientRect().top - headerBottom - 16;
    window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  }));
}

function scheduleHashAlignment() {
  const alignAfterLoad = () => window.setTimeout(alignLocationHash, 200);
  if (document.readyState === "complete") alignAfterLoad();
  else window.addEventListener("load", alignAfterLoad, { once: true });
}

function initAuroraEffects() {
  if (!document.querySelector(".aurora-background")) return;
  document.documentElement.classList.toggle("page-hidden", document.hidden);
  document.addEventListener("visibilitychange", () => {
    document.documentElement.classList.toggle("page-hidden", document.hidden);
  });
}

function initGameFilters() {
  const library = document.querySelector(".game-library-content");
  const filters = document.querySelector(".game-filter-list");
  if (!library || !filters) return;

  const applyFilter = (button) => {
    const selected = button.dataset.gameFilter;
    library.dataset.filter = selected;
    filters.querySelectorAll("[data-game-filter]").forEach((filter) => {
      const isActive = filter === button;
      filter.classList.toggle("is-active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });
    library.querySelectorAll("[data-game-group]").forEach((group) => {
      const platform = group.dataset.gameGroup;
      group.hidden = selected !== "All" && platform !== selected;
    });
  };

  const defaultFilter = filters.querySelector('[data-game-filter="All"]');
  if (defaultFilter) applyFilter(defaultFilter);
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-game-filter]");
    if (button) applyFilter(button);
  });
}

function renderStoreCard(store, visible = false) {
  const imagePath = String(store.image || "").trim();
  const image = imagePath && !/^(?:[a-z][a-z\\d+.-]*:|[/\\\\]{2})/i.test(imagePath)
    ? `<img class="store-image" src="${escapeHtml(imagePath)}" alt="${escapeHtml(store.name)}" loading="lazy" decoding="async">`
    : `<div class="store-image-placeholder" aria-hidden="true">${iconSvg("package", 24)}<span>Product image placeholder</span></div>`;
  const url = /^https?:\/\//i.test(String(store.url || "").trim()) ? String(store.url).trim() : "";
  const platform = escapeHtml(store.platform);
  const storeLink = url
    ? `<a class="button button-secondary" href="${escapeHtml(url)}" target="_blank" rel="sponsored noopener noreferrer">View on ${platform} ${iconSvg("external-link")}</a>`
    : `<span class="button button-secondary button-disabled">View on ${platform} ${iconSvg("external-link")}</span>`;
  return `
    <article class="store-card${store.featured ? " store-card-featured" : ""} reveal reveal-tile${visible ? " is-visible" : ""}" id="store-${escapeHtml(store.id)}" data-store-id="${escapeHtml(store.id)}">
      <span class="sponsored-tag">${iconSvg("shield-check")}<span>Sponsored link</span></span>
      ${image}
      <span class="platform-badge">${platform}</span>
      <span class="category-tag">${escapeHtml(store.category)}</span>
      <h3>${iconSvg("tag", 24)}<span>${escapeHtml(store.name)}</span></h3>
      <p>${escapeHtml(store.reason)}</p>
      <p class="price">Check current price</p>
      ${storeLink}
    </article>`;
}

function renderProductCard(product, index, mode) {
  const screenshotCards = (product.screenshots || []).map((screenshot) => screenshot.src
    ? `<img class="screenshot-placeholder" src="${escapeHtml(screenshot.src)}" alt="${escapeHtml(screenshot.label)}" loading="lazy" decoding="async">`
    : `<div class="screenshot-placeholder">${escapeHtml(screenshot.label)}</div>`).join("");
  const features = (product.features || []).map((feature) => `<li>${escapeHtml(feature)}</li>`).join("");
  const heading = `<div><span class="category-tag">${iconSvg("package", 24)}${escapeHtml(product.category || "")}</span><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description || "")}</p></div>`;
  const demo = `<a class="button button-secondary" href="${escapeHtml(product.demoUrl || "#")}" target="_blank" rel="noopener noreferrer">${iconSvg("download")}Download Demo</a>`;
  const buy = `<button class="button buy-button" type="button" data-product-id="${escapeHtml(product.id)}">${iconSvg("message-circle")}Inquire / Buy</button>`;
  if (mode === "shop") {
    return `
      <article class="product-detail reveal" id="${index === 0 ? "featured-app" : `product-${escapeHtml(product.id)}`}" >
        <div class="product-detail-main">
          ${heading}
          <ul class="feature-list">${features}</ul>
          <p class="price">${escapeHtml(product.price || "")}</p>
          <p class="placeholder-label">${escapeHtml(product.demoNote || "")}</p>
          <p class="terms-note">${escapeHtml(product.terms || "")}</p>
          <div class="card-actions">${demo}${buy}</div>
        </div>
        <div class="product-detail-aside">
          <p class="filter-label">Screenshots</p>
          <div class="product-screenshots">${screenshotCards}</div>
          <p class="payment-note">${escapeHtml(product.paymentDetails || "")}</p>
        </div>
      </article>`;
  }
  return `
    <article class="product-card card reveal">
      ${heading}
      <p class="price">${escapeHtml(product.price || "")}</p>
      <p class="placeholder-label">${escapeHtml(product.demoNote || "")}</p>
      <div class="card-actions">${demo}${buy}</div>
    </article>`;
}

function renderBuyDialog() {
  return `
    <dialog class="modal" id="buy-modal" aria-labelledby="buy-title">
      <section class="modal-card">
        <div class="modal-heading"><div><p class="eyebrow">Purchase enquiry</p><h2 id="buy-title">Buy product</h2></div><button class="modal-close" type="button" aria-label="Close purchase details">×</button></div>
        <p id="buy-description"></p>
        <ol class="buy-steps">
          <li>Message me on Viber, WhatsApp, or email and name the app.</li>
          <li>Confirm the device, license, current price, and delivery details.</li>
          <li>Arrange payment using the confirmed method.</li>
          <li>Receive the full copy and license information.</li>
        </ol>
        <div class="button-row"><a class="button" id="buy-whatsapp" href="#">${iconSvg("whatsapp")}WhatsApp</a><a class="button button-secondary" id="buy-viber" href="#">${iconSvg("viber")}Viber</a><a class="button button-secondary" id="buy-email" href="#">${iconSvg("mail")}Email</a><a class="button button-secondary" id="buy-contact" href="#">Contact page</a></div>
        <p class="payment-note" id="payment-note"></p><p class="terms-note" id="terms-note"></p>
      </section>
    </dialog>`;
}

function initProducts() {
  const productLists = document.querySelectorAll("[data-product-list]");
  if (!productLists.length) return;
  productLists.forEach((productList) => {
    const mode = productList.dataset.productList;
    productList.innerHTML = (mode === "home" ? products.slice(0, 1) : products)
      .map((product, index) => renderProductCard(product, index, mode)).join("");
  });
  document.body.insertAdjacentHTML("beforeend", renderBuyDialog());
  const modal = document.querySelector("#buy-modal");
  const closeButton = modal.querySelector(".modal-close");
  document.querySelectorAll(".buy-button").forEach((button) => {
    button.addEventListener("click", () => {
      const product = products.find((item) => item.id === button.dataset.productId);
      if (!product) return;
      const message = `Hello Jolan, I'm interested in ${product.name}. Please send me the details.`;
      const encodedMessage = encodeURIComponent(message);
      modal.querySelector("#buy-title").textContent = `Buy ${product.name}`;
      modal.querySelector("#buy-description").textContent = `Current listed price: ${product.price}.`;
      modal.querySelector("#buy-whatsapp").href = `https://wa.me/639287328109?text=${encodedMessage}`;
      modal.querySelector("#buy-viber").href = "viber://chat?number=%2B639287328109";
      modal.querySelector("#buy-email").href = `mailto:sorillojolanclark@gmail.com?subject=${encodeURIComponent(`Product enquiry: ${product.name}`)}&body=${encodedMessage}`;
      modal.querySelector("#buy-contact").href = `contact.html?product=${encodeURIComponent(product.id)}`;
      modal.querySelector("#payment-note").textContent = `Payment: ${product.paymentDetails}`;
      modal.querySelector("#terms-note").textContent = `Terms: ${product.terms}`;
      modal.showModal();
      closeButton.focus();
    });
  });
  closeButton.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
}

function renderCollections() {
  const collectionGrid = document.querySelector("#collection-grid");
  if (!collectionGrid) return;
  const storeById = new Map(stores.map((store) => [store.id, store]));
  collectionGrid.innerHTML = collections.map((collection) => {
    const itemNames = collection.itemIds.map((id) => {
      const store = storeById.get(id);
      return store ? `<li><a href="shop.html#store-${escapeHtml(store.id)}">${escapeHtml(store.name)}</a></li>` : "";
    }).join("");
    return `
      <article class="collection-card reveal" id="collection-${escapeHtml(collection.id)}">
        <span class="category-tag">${iconSvg("sparkles", 24)}Collection</span><h3>${escapeHtml(collection.name)}</h3>
        <p>${escapeHtml(collection.description)}</p><ul class="collection-items">${itemNames}</ul>
        <a class="inline-link" href="shop.html#recommended-picks">Browse related picks ${iconSvg("arrow-up-right", 20, "icon-arrow")}</a>
      </article>`;
  }).join("");
}

function initStoreCatalog() {
  const storeGrid = document.querySelector("#store-grid");
  const featuredGrid = document.querySelector("#featured-store-grid");
  if (featuredGrid) featuredGrid.innerHTML = stores.filter((store) => store.featured).slice(0, 6).map(renderStoreCard).join("");
  if (!storeGrid) return;
  const platformFilters = document.querySelector('[data-filter-group="platform"]');
  const categoryFilters = document.querySelector('[data-filter-group="category"]');
  const showMoreButton = document.querySelector("#show-more-stores");
  if (!platformFilters || !categoryFilters || !showMoreButton) return;
  const params = new URLSearchParams(window.location.search);
  const platforms = ["All", "Shopee", "Lazada", "TikTok Shop", "Amazon", "Other"];
  const categories = ["All", "PC parts", "Networking", "Phone accessories", "Tools", "Home", "Other"];
  let selectedPlatform = platforms.includes(params.get("platform")) ? params.get("platform") : "All";
  let selectedCategory = "All";
  let searchText = params.get("q") || "";
  let sortMode = "featured";
  let visibleStoreCount = 12;
  let hasFilteredResults = false;
  const searchInput = document.querySelector("#store-search");
  const sortSelect = document.querySelector("#store-sort");
  const emptyMessage = document.querySelector("#empty-results");
  const renderFilters = (container, options, selected) => {
    container.innerHTML = options.map((option) =>
      `<button class="filter-button" type="button" data-filter="${escapeHtml(option)}" aria-pressed="${option === selected}">${escapeHtml(option)}</button>`,
    ).join("");
  };
  renderFilters(platformFilters, platforms, selectedPlatform);
  renderFilters(categoryFilters, categories, selectedCategory);
  if (searchInput) searchInput.value = searchText;

  const renderResults = () => {
    const filtered = stores.filter((store) => {
      const matchesPlatform = selectedPlatform === "All" || store.platform === selectedPlatform;
      const matchesCategory = selectedCategory === "All" || store.category === selectedCategory;
      const searchable = `${store.name} ${store.reason} ${store.category} ${store.platform}`.toLowerCase();
      return matchesPlatform && matchesCategory && searchable.includes(searchText.toLowerCase());
    });
    const sorted = [...filtered].sort((a, b) => {
      if (sortMode === "newest") return String(b.addedAt || "").localeCompare(String(a.addedAt || "")) || a.name.localeCompare(b.name);
      if (sortMode === "az") return a.name.localeCompare(b.name);
      return Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name);
    });
    storeGrid.innerHTML = sorted.slice(0, visibleStoreCount).map((store) => renderStoreCard(store, hasFilteredResults)).join("");
    showMoreButton.hidden = sorted.length <= visibleStoreCount;
    if (emptyMessage) emptyMessage.hidden = sorted.length !== 0;
    const hashTarget = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    hashTarget?.scrollIntoView({ block: "start" });
  };
  const bindFilterGroup = (container, group) => {
    container.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      if (group === "platform") selectedPlatform = button.dataset.filter;
      else selectedCategory = button.dataset.filter;
      hasFilteredResults = true;
      container.querySelectorAll("button[data-filter]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      visibleStoreCount = 12;
      renderResults();
    });
  };
  bindFilterGroup(platformFilters, "platform");
  bindFilterGroup(categoryFilters, "category");
  searchInput?.addEventListener("input", () => {
    searchText = searchInput.value.trim();
    hasFilteredResults = true;
    visibleStoreCount = 12;
    renderResults();
  });
  sortSelect?.addEventListener("change", () => {
    sortMode = sortSelect.value;
    hasFilteredResults = true;
    visibleStoreCount = 12;
    renderResults();
  });
  showMoreButton.addEventListener("click", () => {
    visibleStoreCount += 12;
    hasFilteredResults = true;
    renderResults();
  });
  renderResults();
}

function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  const productId = new URLSearchParams(window.location.search).get("product");
  const product = products.find((item) => item.id === productId);
  if (product) {
    const subject = form.querySelector('[name="subject"]');
    const message = form.querySelector('[name="message"]');
    if (subject) subject.value = "Buy an app";
    if (message) message.value = `I'm interested in ${product.name}. Please send me the purchase details.`;
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const subject = `Website enquiry: ${formData.get("subject")}`;
    const body = [
      `Name: ${formData.get("name")}`,
      `Email: ${formData.get("email")}`,
      "",
      formData.get("message"),
    ].join("\n");
    window.location.href = `mailto:sorillojolanclark@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

/* --- Dynamic products.json loader & demo modal handling --- */

async function loadDynamicProductsGrid() {
  // Ensure there's a container; create one if missing
  let container = document.getElementById("dynamic-shop-grid");
  if (!container) {
    const picksSection = document.getElementById("recommended-picks") || document.querySelector("section[aria-labelledby='picks-title']");
    if (picksSection) {
      container = document.createElement("div");
      container.id = "dynamic-shop-grid";
      container.className = "store-grid catalog-grid";
      container.setAttribute("aria-live", "polite");
      // insert before the existing static store grid if present
      const staticGrid = document.getElementById("store-grid");
      if (staticGrid) picksSection.insertBefore(container, staticGrid);
      else picksSection.appendChild(container);
    }
  }
  if (!container) return;

  try {
    const res = await fetch("products.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to fetch products.json");
    const items = await res.json();

    container.innerHTML = items.map((item) => {
      // Parse colSpan from various formats: 6, "6", "span-6", "col-span-6"
      let colSpan = 6;
      if (item.colSpan !== undefined && item.colSpan !== null) {
        const spanStr = String(item.colSpan).toLowerCase().replace(/^(span-|col-span-)/, '');
        const spanNum = parseInt(spanStr, 10);
        if ([4, 6, 8, 12].includes(spanNum)) colSpan = spanNum;
      }
      const spanClass = ` span-${colSpan}`;
      
      const badge = item.badge ? `<span class="category-tag">${escapeHtml(item.badge)}</span>` : "";
      
      // Case-insensitive category check for affiliate handling
      const isAffiliate = item.category && String(item.category).toLowerCase() === 'affiliate' || String(item.category).toLowerCase() === 'curated';
      
      const imagePath = String(item.image || "").trim();
      const imageAlt = item.imageAlt || item.title || "";
      const image = imagePath && !/^(?:[a-z][a-z\\d+.-]*:|[/\\\\]{2})/i.test(imagePath)
        ? `<img class="store-image" src="${escapeHtml(imagePath)}" alt="${escapeHtml(imageAlt)}" loading="lazy" decoding="async" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';"><div class="store-image-placeholder" aria-hidden="true" style="display:none">${iconSvg("package", 24)}<span>Image not available</span></div>`
        : `<div class="store-image-placeholder" aria-hidden="true">${iconSvg("package", 24)}<span>Product image placeholder</span></div>`;
      
      const heading = `
        <div>
          <h3>${iconSvg("tag", 24)}<span>${escapeHtml(item.title)}</span></h3>
        </div>`;

      const action = item.isDemo
        ? `<button class="button button-secondary demo-launch" type="button" data-demo-id="${escapeHtml(item.id)}" aria-controls="demo-modal">${iconSvg("arrow-up-right", 20)} ${escapeHtml(item.linkText || "Launch Demo")}</button>`
        : (item.linkUrl && /^https?:\/\//i.test(String(item.linkUrl))
            ? `<a class="button button-secondary" href="${escapeHtml(item.linkUrl)}" target="_blank" rel="${isAffiliate ? 'sponsored ' : ''}noopener noreferrer">${iconSvg("arrow-up-right", 20)} ${escapeHtml(item.linkText || "View")}</a>`
            : `<span class="button button-secondary button-disabled">${iconSvg("arrow-up-right", 20)} ${escapeHtml(item.linkText || "View")}</span>`
          );

      return `
        <article id="dynamic-${escapeHtml(item.id)}" class="store-card${spanClass} reveal">
          ${badge}
          ${image}
          ${heading}
          <p class="card-description">${escapeHtml(item.description)}</p>
          <div class="card-actions">${action}</div>
        </article>`;
    }).join("");

    initMotion();
  } catch (err) {
    container.innerHTML = `<p class="empty-results">Could not load dynamic products.</p>`;
    // eslint-disable-next-line no-console
    console.warn("loadDynamicProductsGrid:", err);
  }
}

function demoModalMarkup() {
  return `
  <div id="demo-modal" class="demo-modal" hidden role="dialog" aria-modal="true" aria-label="Webview demo overlay">
    <div class="demo-modal-backdrop" aria-hidden="true"></div>
    <div class="demo-modal-card">
      <header class="demo-frame-header">
        <div class="window-controls" aria-hidden="true"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span></div>
        <div class="demo-url">bebet-kiosk.app/live-preview</div>
        <button class="demo-modal-close button" type="button" aria-label="Close demo">Close</button>
      </header>
      <section class="demo-frame" role="region" aria-label="Device preview frame">
        <div class="device-shell">
          <div class="device-topbar">
            <span class="demo-live-badge">Live</span>
            <ul class="demo-telemetry">
              <li>Active sessions: <strong>3</strong></li>
              <li>Uptime: <strong>00:12:34</strong></li>
              <li>Network: <strong>Online</strong></li>
            </ul>
          </div>
          <div class="device-viewport" aria-hidden="true">
            <div class="kiosk-mock">
              <h4>Bebet Kiosk</h4>
              <p class="kiosk-note">This is an in-browser preview of the kiosk shell. Interaction is simulated for demo purposes.</p>
              <div class="kiosk-actions">
                <button class="button">Start session</button>
                <button class="button button-secondary">End session</button>
                <button class="button button-secondary">Reset kiosk</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>`;
}

function initDemoModalBehavior() {
  if (!document.getElementById("demo-modal")) {
    document.body.insertAdjacentHTML("beforeend", demoModalMarkup());
  }
  const modal = document.getElementById("demo-modal");
  const closeBtnSelector = ".demo-modal-close";

  // Delegated open handler
  document.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".demo-launch");
    if (!btn) return;
    const demoId = btn.dataset.demoId;
    showDemoModal(demoId);
  });

  function showDemoModal(demoId) {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.removeAttribute("hidden");
    // Update content if needed per demoId
    const titleEl = modal.querySelector(".demo-url");
    const liveBadge = modal.querySelector(".demo-live-badge");
    if (demoId === "bebet-mobile-kiosk") {
      titleEl.textContent = "bebet-kiosk.app/live-preview";
      liveBadge.textContent = "Live";
      liveBadge.classList.remove("badge-offline");
    } else {
      titleEl.textContent = "preview";
      liveBadge.textContent = "Preview";
    }
    // focus management
    const closeButton = modal.querySelector(closeBtnSelector);
    closeButton?.focus();
  }

  function hideDemoModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("hidden", "");
  }

  // Close on close button or backdrop
  modal.addEventListener("click", (ev) => {
    if (ev.target.closest(closeBtnSelector) || ev.target === modal) hideDemoModal();
  });

  // Close on Escape
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && modal && !modal.hasAttribute("hidden")) hideDemoModal();
  });
}

function initDynamicShopAndDemo() {
  loadDynamicProductsGrid();
  initDemoModalBehavior();
}

/* --- Dynamic projects.json loader for portfolio showcase --- */

async function loadDynamicProjectsGrid() {
  const container = document.getElementById("dynamic-projects-grid");
  if (!container) return;

  try {
    const res = await fetch("projects.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to fetch projects.json");
    const projects = await res.json();
    const featured = projects.find((project) => project.title === "SK-Bangkal");
    const remaining = projects
      .filter((project) => project !== featured)
      .sort((a, b) => String(a.title || "").localeCompare(String(b.title || ""), undefined, { sensitivity: "base" }));
    const orderedProjects = featured ? [featured, ...remaining] : remaining;

    const carousel = createProjectCarousel(container);
    carousel.setProjects(orderedProjects);
    import("./fx.js").then(({ initProjectPreview }) => {
      initProjectPreview(orderedProjects, carousel);
    }).catch(() => {
      console.warn("Project preview module could not be loaded.");
    });
  } catch (err) {
    container.innerHTML = `<p class="empty-results">Could not load projects.</p>`;
    console.warn("loadDynamicProjectsGrid:", err);
  }
}

/* --- Live status and portfolio effects --- */

function initLiveClockAndStatus() {
  const timeEl = document.querySelector("#dock-live-time");
  if (!timeEl) return;

  const updateClock = () => {
    const now = new Date();
    const timeParts = now.toLocaleTimeString("en-US", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).split(" ");
    if (timeParts.length === 2) {
      timeEl.innerHTML = `${timeParts[0]}<br>${timeParts[1]}`;
    }
  };

  updateClock();
  setInterval(updateClock, 1000);
}

function initAnimatedCounters() {
  const counters = document.querySelectorAll("[data-counter-target]");
  if (!counters.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    counters.forEach((el) => {
      el.textContent = el.dataset.counterTarget || "0";
    });
    return;
  }

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.counterTarget, 10) || 0;
    const suffix = el.dataset.counterSuffix || "";
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 20));
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = `${current}${suffix}`;
    }, 30);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  counters.forEach((counter) => observer.observe(counter));
}

function initFloatingDock() {
  if (document.querySelector(".floating-dock")) return;
  const currentTheme = document.documentElement.dataset.theme || "light";

  const dockHtml = `
    <aside class="floating-dock" aria-label="Theme toggle and live clock">
      <button class="theme-toggle dock-dot-btn" type="button" aria-pressed="${currentTheme === "dark"}" aria-label="Switch to ${currentTheme === "dark" ? "light" : "dark"} theme" title="Toggle dark/light mode">
        ${themeIcon(currentTheme)}
      </button>
      <div class="dock-clock-pill-vertical">
        <span class="dock-pin">📍</span>
        <span class="dock-city">Ilo<br>ilo<br><br>Ci<br>ty<br>-<br>PH</span>
        <span class="dock-time-val" id="dock-live-time">07:25<br>PM</span>
      </div>
    </aside>
  `;
  document.body.insertAdjacentHTML("beforeend", dockHtml);
  initLiveClockAndStatus();
}

// v2.2.0
function initConsent(forceOpen = false) {
  if (!document.querySelector("[data-spotify-facade]")) return;
  let consent = null;
  try { consent = localStorage.getItem("jcs_cookie_consent"); } catch {}

  if (forceOpen) document.querySelector(".cookie-consent-banner")?.remove();
  if (!consent || forceOpen) {
    document.body.insertAdjacentHTML("beforeend", `
      <aside class="cookie-consent-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-consent-title">
        <div>
          <strong id="cookie-consent-title">Cookie preferences</strong>
          <p>Choose essential storage only or allow Spotify playback.</p>
        </div>
        <div class="cookie-consent-actions">
          <button type="button" class="button button-secondary" data-cookie-choice="essential">Essential only</button>
          <button type="button" class="button" data-cookie-choice="all">Accept all</button>
        </div>
      </aside>`);
  }

  const choose = (value) => {
    try { localStorage.setItem("jcs_cookie_consent", value); } catch {}
    document.querySelector(".cookie-consent-banner")?.remove();
    if (value === "all") {
      loadSpotifyEmbeds();
    } else {
      document.querySelectorAll("[data-spotify-facade] iframe").forEach((frame) => {
        const facade = frame.parentElement;
        frame.remove();
        facade.textContent = "Spotify players appear automatically after you accept media cookies.";
      });
    }
  };

  document.addEventListener("click", (event) => {
    const choice = event.target.closest("[data-cookie-choice]");
    if (choice) choose(choice.dataset.cookieChoice);
    if (event.target.closest("[data-open-cookie-preferences]")) {
      const existing = document.querySelector(".cookie-consent-banner");
      if (!existing) {
        initConsent(true);
      } else {
        existing.querySelector("[data-cookie-choice]")?.focus();
      }
    }
  });
}

function loadSpotifyEmbeds() {
  document.querySelectorAll("[data-spotify-facade]").forEach((facade, index) => {
    if (facade.querySelector("iframe")) return;
    const src = facade.dataset.spotifySrc;
    if (!src) return;
    const iframe = document.createElement("iframe");
    iframe.className = "spotify-player";
    iframe.title = `Spotify Playlist ${index + 1}`;
    iframe.width = "100%";
    iframe.height = "352";
    iframe.loading = "lazy";
    iframe.setAttribute("allow", "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture");
    iframe.setAttribute("allowfullscreen", "");
    iframe.src = src;
    facade.replaceChildren(iframe);
  });
}

function initSpotifyFacades() {
  let consent = "essential";
  try { consent = localStorage.getItem("jcs_cookie_consent") || "essential"; } catch {}
  if (consent === "all") loadSpotifyEmbeds();
}

function initGlobalMediaCoordinator() {
  let currentActiveMedia = null;

  // Global capture listener for audio and video play events
  document.addEventListener("play", (event) => {
    const activeMedia = event.target;
    if (activeMedia && (activeMedia.tagName === "AUDIO" || activeMedia.tagName === "VIDEO")) {
      document.querySelectorAll("audio, video").forEach((media) => {
        if (media !== activeMedia && !media.paused) {
          media.pause();
        }
      });
      currentActiveMedia = activeMedia;
    }
  }, true);

  // Pause playback when leaving or hiding the browser tab
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && currentActiveMedia && !currentActiveMedia.paused) {
      currentActiveMedia.pause();
    }
  });
}

const runModule = () => {
  window.addEventListener("hashchange", alignLocationHash);
  try { initShell(); } catch (e) { console.error("initShell error:", e); }
  try { initContactForm(); } catch (e) { console.error("initContactForm error:", e); }
  try { initGameFilters(); } catch (e) { console.error("initGameFilters error:", e); }
  let projectLoad = Promise.resolve();
  try { projectLoad = loadDynamicProjectsGrid(); } catch (e) { console.error("loadDynamicProjectsGrid error:", e); }
  try { initAnimatedCounters(); } catch (e) { console.error("initAnimatedCounters error:", e); }
  try { initConsent(); } catch (e) { console.error("initConsent error:", e); }
  try { initSpotifyFacades(); } catch (e) { console.error("initSpotifyFacades error:", e); }
  try { initGlobalMediaCoordinator(); } catch (e) { console.error("initGlobalMediaCoordinator error:", e); }
  Promise.all([projectLoad, document.fonts?.ready].filter(Boolean)).then(scheduleHashAlignment);
  import("./fx.js").then(({ initMotion }) => initMotion()).catch(() => {
    console.warn("Motion module could not be loaded.");
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runModule);
} else {
  runModule();
}
