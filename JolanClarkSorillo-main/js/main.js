import { products } from "./products.js";
import { collections, stores } from "./stores.js";

document.documentElement.classList.add("has-js");

const pages = [
  ["index.html", "Home", "home", "house"],
  ["shop.html", "Shop", "shop", "store"],
  ["portfolio.html", "Portfolio", "portfolio", "briefcase"],
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
  const currentPage = document.body.dataset.page;
  const currentTheme = document.documentElement.dataset.theme || "light";
  const navigation = pages.map(([href, label, key, icon]) =>
    `<a href="${href}"${currentPage === key ? ' aria-current="page"' : ""}>${iconSvg(icon)}<span>${label}</span></a>`,
  ).join("");
  return `
    <header class="site-header">
      <div class="nav-shell">
        <a class="brand" href="index.html" aria-label="Larck home"><span class="brand-mark" aria-hidden="true">L</span><span>Larck.</span></a>
        <nav class="nav-links" aria-label="Main navigation">${navigation}</nav>
        <div class="nav-actions">
          <button class="theme-toggle" type="button" aria-pressed="${currentTheme === "dark"}" aria-label="Switch to ${currentTheme === "dark" ? "light" : "dark"} theme">${themeIcon(currentTheme)}</button>
          <a class="button nav-contact" href="contact.html"${currentPage === "contact" ? ' aria-current="page"' : ""}>${iconSvg("mail")}<span>Contact</span></a>
        </div>
      </div>
    </header>`;
}

function renderFooter() {
  const columns = [
    ["Shop", "shop.html", "store"],
    ["Portfolio", "portfolio.html", "briefcase"],
    ["Resume", "resume.html", "file-text"],
    ["Contact", "contact.html", "mail"],
  ];
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-inner">
          ${columns.map(([label, href, icon]) => `<section class="footer-column"><h2>${iconSvg(icon)}<span>${label}</span></h2><ul><li><a href="${href}">Open ${label}</a></li></ul></section>`).join("")}
        </div>
        <nav class="footer-socials" aria-label="Social links">
          <a href="https://www.facebook.com/larck.sorillo/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">${iconSvg("facebook", 20)}</a>
          <a href="https://www.instagram.com/larck.sorillo/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${iconSvg("instagram", 20)}</a>
          <a href="https://www.linkedin.com/in/jolan-clark-sorillo-011197256/?originalSubdomain=ph" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${iconSvg("linkedin", 20)}</a>
          <a href="https://github.com/JCsorillo" target="_blank" rel="noopener noreferrer" aria-label="GitHub">${iconSvg("github", 20)}</a>
          <a href="https://wa.me/639287328109" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">${iconSvg("whatsapp", 20)}</a>
          <a href="viber://chat?number=%2B639287328109" aria-label="Viber">${iconSvg("viber", 20)}</a>
        </nav>
        <p class="footer-disclosure">Affiliate disclosure: some links may earn a commission at no extra cost to you.</p>
        <p class="footer-bottom">© ${new Date().getFullYear()} Larck. Product information and availability are subject to change.</p>
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
    ...products.map((product) => ({
      label: product.name,
      description: "App",
      href: "shop.html#my-apps",
    })),
    ...collections.map((collection) => ({
      label: collection.name,
      description: "Collection",
      href: "shop.html#collections",
    })),
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
  const revealTileSelector = ".card, .glass-card, .project-card, .product-card, .product-detail, .store-card, .collection-card, .contact-card, .resume-section, .timeline-entry, .hero-tile, .hero-note-tile, .home-shop-banner";
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
  const image = imagePath && !/^(?:[a-z][a-z\d+.-]*:|[/\\]{2})/i.test(imagePath)
    ? `<img class="store-image" src="${escapeHtml(imagePath)}" alt="${escapeHtml(store.name)}" loading="lazy" decoding="async">`
    : `<div class="store-image-placeholder" aria-hidden="true">${iconSvg("package", 24)}<span>Product image placeholder</span></div>`;
  const url = /^https?:\/\//i.test(String(store.url || "").trim()) ? String(store.url).trim() : "";
  const platform = escapeHtml(store.platform);
  const storeLink = url
    ? `<a class="button button-secondary" href="${escapeHtml(url)}" target="_blank" rel="sponsored noopener noreferrer">View on ${platform} ${iconSvg("external-link")}</a>`
    : `<span class="button button-secondary button-disabled">View on ${platform} ${iconSvg("external-link")}</span>`;
  return `
    <article class="store-card${store.featured ? " store-card-featured" : ""} reveal reveal-tile${visible ? " is-visible" : ""}" id="store-${escapeHtml(store.id)}" data-store-id="${escapeHtml(store.id)}" data-platform="${platform}" data-category="${escapeHtml(store.category)}" data-featured="${Boolean(store.featured)}" data-added-at="${escapeHtml(store.addedAt || "")}">
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
  const screenshotCards = product.screenshots.map((screenshot) => screenshot.src
    ? `<img class="screenshot-placeholder" src="${escapeHtml(screenshot.src)}" alt="${escapeHtml(screenshot.label)}" loading="lazy" decoding="async">`
    : `<div class="screenshot-placeholder">${escapeHtml(screenshot.label)}</div>`).join("");
  const features = product.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("");
  const heading = `<div><span class="category-tag">${iconSvg("package", 24)}${escapeHtml(product.category)}</span><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description)}</p></div>`;
  const demo = `<a class="button button-secondary" href="${escapeHtml(product.demoUrl)}" target="_blank" rel="noopener noreferrer">${iconSvg("download")}Download Demo</a>`;
  const buy = `<button class="button buy-button" type="button" data-product-id="${escapeHtml(product.id)}">${iconSvg("message-circle")}Inquire / Buy</button>`;
  if (mode === "shop") {
    return `
      <article class="product-detail reveal" id="${index === 0 ? "featured-app" : `product-${escapeHtml(product.id)}`}">
        <div class="product-detail-main">
          ${heading}
          <ul class="feature-list">${features}</ul>
          <p class="price">${escapeHtml(product.price)}</p>
          <p class="placeholder-label">${escapeHtml(product.demoNote)}</p>
          <p class="terms-note">${escapeHtml(product.terms)}</p>
          <div class="card-actions">${demo}${buy}</div>
        </div>
        <div class="product-detail-aside">
          <p class="filter-label">Screenshots</p>
          <div class="product-screenshots">${screenshotCards}</div>
          <p class="payment-note">${escapeHtml(product.paymentDetails)}</p>
        </div>
      </article>`;
  }
  return `
    <article class="product-card card reveal">
      ${heading}
      <p class="price">${escapeHtml(product.price)}</p>
      <p class="placeholder-label">${escapeHtml(product.demoNote)}</p>
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
        <div class="button-row"><a class="button" id="buy-whatsapp" href="#">${iconSvg("whatsapp")}WhatsApp</a><a class="button button-secondary" id="buy-viber" href="#">${iconSvg("viber")}Viber</a><a class="inline-link" id="buy-email" href="#">Email instead ${iconSvg("arrow-up-right", 20, "icon-arrow")}</a><a class="inline-link" id="buy-contact" href="contact.html">Continue on Contact page ${iconSvg("arrow-up-right", 20, "icon-arrow")}</a></div>
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

document.addEventListener("DOMContentLoaded", () => {
  initShell();
  initProducts();
  initStoreCatalog();
  renderCollections();
  initContactForm();
  initReveals();
});
