import { products } from "./products.js";
import { collections, stores } from "./stores.js";

document.documentElement.classList.add("has-js");

const pages = [
  ["index.html", "Home", "home", "house"],
  ["resume.html", "Resume", "resume", "file-text"],
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

function renderHeader() {
  const currentTheme = document.documentElement.dataset.theme || "light";
  return `
    <header class="site-header">
      <div class="nav-shell">
        <a class="brand" href="index.html#home" aria-label="Larck home"><span class="brand-mark" aria-hidden="true">L</span><span>Larck.</span></a>
        <div class="nav-actions">
          <a class="button button-secondary nav-home" href="index.html#home">${iconSvg("house")}<span>Home</span></a>
          <button class="theme-toggle" type="button" aria-pressed="${currentTheme === "dark"}" aria-label="Switch to ${currentTheme === "dark" ? "light" : "dark"} theme">${themeIcon(currentTheme)}
          </button>
          <a class="button nav-contact" href="contact.html">${iconSvg("mail")}<span>Contact</span></a>
        </div>
      </div>
    </header>`;
}
}

function renderFooter() {
  const links = [
    ["Home", "index.html", "house"],
    ["Portfolio", "portfolio.html", "briefcase"],
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
          </nav>
        </div>

        <p class="footer-bottom" style="margin-top: 0.75rem; border-top: none; padding: 0;">© ${new Date().getFullYear()} Jolan Clark Sorillo (Larck). All rights reserved.</p>
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
    if (themeColor) themeColor.content = getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim();
  };
  setThemeColor();
  const updateHeader = () => siteHeader?.classList.toggle("is-condensed", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  document.querySelector(".theme-toggle")?.addEventListener("click", (event) => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try { localStorage.setItem("theme", nextTheme); } catch {}
    setThemeColor();
    const toggle = event.currentTarget;
    toggle.setAttribute("aria-pressed", String(nextTheme === "dark"));
    toggle.setAttribute("aria-label", `Switch to ${nextTheme === "dark" ? "light" : "dark"} theme`);
    toggle.innerHTML = themeIcon(nextTheme);
    const icon = toggle.querySelector(".icon");
    void icon.offsetWidth;
    icon.classList.add("is-swapping");
  });

  initStaticIcons();
  initCommandPalette();
  initAuroraEffects();
}

function initAuroraEffects() {
  if (!document.querySelector(".aurora-background")) return;
  document.documentElement.classList.toggle("page-hidden", document.hidden);
  document.addEventListener("visibilitychange", () => {
    document.documentElement.classList.toggle("page-hidden", document.hidden);
  });
}

function initReveals() {
  const revealTileSelector = ".card, .glass-card, .project-card, .product-card, .product-detail, .store-card, .collection-card, .contact-card, .resume-section, .timeline-entry, .hero-tile, .hero-note-tile, .feature-card";
  const revealTargets = [...document.querySelectorAll(".reveal")].filter((element) => element.matches(revealTileSelector));
  const sectionCounts = new Map();
  revealTargets.forEach((element) => {
    element.classList.add("reveal-tile");
    const section = element.closest("section") || document.body;
    const count = sectionCounts.get(section) || 0;
    element.style.setProperty("--reveal-delay", count < 6 ? `${count * 10}ms` : "0ms");
    sectionCounts.set(section, count + 1);
  });
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.filter((element) => !element.classList.contains("is-visible")).forEach((element) => observer.observe(element));
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
      const message = `Hello Larck, I'm interested in ${product.name}. Please send me the details.`;
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

    // Re-run reveals so IntersectionObserver picks up new elements
    initReveals();
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

function renderProjectCard(project) {
  const categoryTag = project.category || (project.tags && project.tags[0]) || "Project";
  const year = project.year || "2025";
  const status = project.status || "Live Deployment";

  const features = (project.features || []).map((f) =>
    `<li>${escapeHtml(f)}</li>`
  ).join("");

  const techList = (project.techStack || project.tags || []).map((tech) =>
    `<span class="tag">${escapeHtml(tech)}</span>`
  ).join("");

  const targetUrl = project.url || project.repoUrl || "#";
  const linkLabel = project.linkText || "Visit Live Site";

  return `
    <article class="project-card glass-card reveal is-visible" style="display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.5rem;">
        <span class="category-tag">${iconSvg("package", 16)} ${escapeHtml(categoryTag)}</span>
        <span style="font-size: 0.78rem; color: var(--color-muted); font-weight: 500;">${escapeHtml(year)} · <span style="color: #4aae58;">● ${escapeHtml(status)}</span></span>
      </div>
      <h3 style="font-size: 1.2rem; margin-block: 0.35rem 0.5rem;">${iconSvg("external-link", 20)}<span>${escapeHtml(project.title)}</span></h3>
      <p style="color: var(--color-muted); font-size: 0.9rem; line-height: 1.5; margin-bottom: 0.75rem;">${escapeHtml(project.description)}</p>

      ${features ? `<ul class="project-features-list" style="padding-left: 1.1rem; margin: 0 0 0.85rem; font-size: 0.82rem; color: var(--color-muted);">${features}</ul>` : ""}

      <div class="tags" style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; margin-top: auto;">${techList}</div>

      <div class="card-actions" style="margin-top: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--color-border);">
        <a class="button button-secondary" href="${escapeHtml(targetUrl)}" target="_blank" rel="noopener noreferrer">${iconSvg("external-link")}${escapeHtml(linkLabel)}</a>
      </div>
    </article>`;
}

async function loadDynamicProjectsGrid() {
  const container = document.getElementById("dynamic-projects-grid");
  if (!container) return;

  try {
    const res = await fetch("projects.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to fetch projects.json");
    const projects = await res.json();
    projects.sort((a, b) => String(a.title || "").localeCompare(String(b.title || ""), undefined, { sensitivity: "base" }));

    container.innerHTML = projects.map(renderProjectCard).join("");

    initReveals();
    initCursorSpotlightAndTilt();
    initInteractiveProjectFilters(projects);
  } catch (err) {
    container.innerHTML = `<p class="empty-results">Could not load projects.</p>`;
    console.warn("loadDynamicProjectsGrid:", err);
  }
}

/* --- AWWWARDS INTERACTIVE & DYNAMIC UI EFFECTS --- */

function initCursorSpotlightAndTilt() {
  const cards = document.querySelectorAll(".glass-card, .project-card, .skill-card, .hero-tile");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function initLiveClockAndStatus() {
  const statusEl = document.querySelector("#live-clock-text");
  if (!statusEl) return;

  const updateClock = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
    statusEl.textContent = `📍 Iloilo City, PH (PST) · ${timeStr}`;
  };

  updateClock();
  setInterval(updateClock, 1000);
}

function initAnimatedCounters() {
  const counters = document.querySelectorAll("[data-counter-target]");
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counterTarget, 10);
        const suffix = el.dataset.counterSuffix || "";
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 25));
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = `${current}${suffix}`;
        }, 30);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

function initInteractiveProjectFilters(projectsData = []) {
  const searchInput = document.getElementById("project-search");
  const filterChipsContainer = document.getElementById("category-filter-chips");
  const gridContainer = document.getElementById("dynamic-projects-grid");

  if (!gridContainer || !projectsData.length) return;

  let currentCategory = "All";
  let searchQuery = "";

  const renderFilteredProjects = () => {
    const query = searchQuery.toLowerCase().trim();

    const filtered = projectsData.filter((project) => {
      const matchCategory = currentCategory === "All" ||
        (project.tags || []).some((tag) => tag.toLowerCase().includes(currentCategory.toLowerCase())) ||
        project.title.toLowerCase().includes(currentCategory.toLowerCase()) ||
        project.description.toLowerCase().includes(currentCategory.toLowerCase());

      const searchableText = `${project.title} ${project.description} ${(project.tags || []).join(" ")}`.toLowerCase();
      const matchSearch = !query || searchableText.includes(query);

      return matchCategory && matchSearch;
    });

    if (!filtered.length) {
      gridContainer.innerHTML = `<p class="empty-results card" style="grid-column: 1 / -1; padding: 2rem; text-align: center;">No matching projects found for "${escapeHtml(searchQuery)}".</p>`;
      return;
    }

    gridContainer.innerHTML = filtered.map(renderProjectCard).join("");

    initReveals();
    initCursorSpotlightAndTilt();
  };

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderFilteredProjects();
    });
  }

  if (filterChipsContainer) {
    filterChipsContainer.addEventListener("click", (e) => {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;

      filterChipsContainer.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");

      currentCategory = chip.dataset.filter || "All";
      renderFilteredProjects();
    });
  }
}

function initFloatingDock() {
  if (document.querySelector(".floating-dock")) return;

  const dockHtml = `
    <aside class="floating-dock" aria-label="Quick action dock">
      <button class="dock-item" type="button" onclick="document.querySelector('#command-palette')?.showModal()">${iconSvg("search", 18)} <span>Cmd + K</span></button>
      <span class="dock-item" id="live-clock-text" style="cursor: default;">📍 Iloilo City, PH</span>
    </aside>
  `;
  document.body.insertAdjacentHTML("beforeend", dockHtml);
  initLiveClockAndStatus();
}

function initCursorGlow() {
  if (document.querySelector(".cursor-glow") || window.innerWidth < 900) return;
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animateGlow = () => {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
    requestAnimationFrame(animateGlow);
  };
  requestAnimationFrame(animateGlow);
}

document.addEventListener("DOMContentLoaded", () => {
  initShell();
  initContactForm();
  initReveals();
  loadDynamicProjectsGrid();
  initCursorSpotlightAndTilt();
  initAnimatedCounters();
  initFloatingDock();
  initCursorGlow();
});
