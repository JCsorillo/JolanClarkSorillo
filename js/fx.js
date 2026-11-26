const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const observedReveals = new WeakSet();
let revealObserver;
let motionInitialized = false;

const formatManilaTime = (options) => new Intl.DateTimeFormat("en-PH", {
  timeZone: "Asia/Manila",
  ...options,
}).format(new Date());

export function initScrollReveals() {
  const elements = [...document.querySelectorAll(".reveal:not(.is-visible)")];
  if (!elements.length) return;

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("reveal-tile", "is-visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
  }

  const sectionCounts = new Map();
  elements.forEach((element) => {
    if (observedReveals.has(element)) return;
    observedReveals.add(element);
    element.classList.add("reveal-tile");
    const section = element.closest("section") || document.body;
    const count = sectionCounts.get(section) || 0;
    element.style.setProperty("--reveal-delay", count < 5 ? `${count * 35}ms` : "0ms");
    sectionCounts.set(section, count + 1);
    revealObserver.observe(element);
  });
}

function initPointerAccents() {
  if (reducedMotion.matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const cards = document.querySelectorAll(
    ".page-home .skill-card, .page-home .playlist-card, .page-home .interest-card, .page-home .cctv-card, .page-home .home-gear-card",
  );
  cards.forEach((card) => {
    if (card.dataset.motionAccent === "true") return;
    card.dataset.motionAccent = "true";
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
      card.classList.add("is-pointer-active");
    });
    card.addEventListener("pointerleave", () => card.classList.remove("is-pointer-active"));
  });
}

function initLocalTime() {
  const time = document.querySelector("[data-live-local-time]");
  if (!time) return;
  const update = () => {
    const now = new Date();
    time.dateTime = now.toISOString();
    time.textContent = formatManilaTime({ hour: "numeric", minute: "2-digit", hour12: true });
  };
  update();
  window.setInterval(update, 30000);
}

function initCctvDemo() {
  const demo = document.querySelector("[data-cctv-demo]");
  if (!demo) return;

  const time = demo.querySelector("[data-cctv-time]");
  const feed = demo.querySelector("[data-camera-feed]");
  const position = demo.querySelector("[data-cctv-position]");
  const telemetry = demo.querySelector("[data-ptz-telemetry]");
  const nightVision = demo.querySelector("[data-night-vision]");
  let pan = 0;
  let tilt = 0;

  const updateTime = () => {
    const now = new Date();
    time.dateTime = now.toISOString();
    time.textContent = formatManilaTime({
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const updatePosition = () => {
    const panText = `${pan}°`;
    const tiltText = `${tilt}°`;
    position.textContent = `PTZ · PAN ${panText} / TILT ${tiltText}`;
    telemetry.textContent = `${pan === 0 && tilt === 0 ? "Center" : "Adjusted"} · ${panText} / ${tiltText}`;
    feed.style.setProperty("--camera-pan", `${pan / 3}%`);
    feed.style.setProperty("--camera-tilt", `${tilt / 4}%`);
  };

  demo.addEventListener("click", (event) => {
    const control = event.target.closest("[data-ptz]");
    if (!control) return;

    switch (control.dataset.ptz) {
      case "up": tilt = Math.max(-20, tilt - 5); break;
      case "down": tilt = Math.min(20, tilt + 5); break;
      case "left": pan = Math.max(-30, pan - 5); break;
      case "right": pan = Math.min(30, pan + 5); break;
      case "center": pan = 0; tilt = 0; break;
      default: return;
    }
    updatePosition();
  });

  nightVision.addEventListener("click", () => {
    const enabled = nightVision.getAttribute("aria-pressed") !== "true";
    nightVision.setAttribute("aria-pressed", String(enabled));
    demo.classList.toggle("is-night-vision", enabled);
    demo.querySelector("[data-night-vision-state]").textContent = enabled ? "On" : "Off";
  });

  updateTime();
  updatePosition();
  window.setInterval(updateTime, 1000);
}

function safeProjectUrl(value) {
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

function appendProjectDetails(container, project) {
  const description = document.createElement("p");
  description.className = "project-preview-description";
  description.textContent = project.description || "Project details are not available.";
  container.append(description);

  const features = Array.isArray(project.features) ? project.features : [];
  if (features.length) {
    const list = document.createElement("ul");
    list.className = "project-preview-features";
    features.slice(0, 5).forEach((feature) => {
      const item = document.createElement("li");
      item.textContent = feature;
      list.append(item);
    });
    container.append(list);
  }

  const techStack = [...new Set(Array.isArray(project.techStack) ? project.techStack : [])];
  if (techStack.length) {
    const chips = document.createElement("div");
    chips.className = "project-preview-chips";
    techStack.forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "project-preview-chip";
      chip.textContent = item;
      chips.append(chip);
    });
    container.append(chips);
  }

  const url = safeProjectUrl(project.url);
  if (url) {
    const link = document.createElement("a");
    link.className = "project-preview-open";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `${project.linkText || "Open live site"} ↗`;
    container.append(link);
  }
}

export function initProjectPreview(projects, carousel) {
  const resultCount = document.getElementById("project-result-count");
  const previewButton = document.getElementById("project-quick-view");
  const dialog = document.getElementById("project-preview-dialog");
  const dialogTitle = document.getElementById("project-preview-title");
  const dialogContent = document.getElementById("project-preview-content");
  const closeButton = document.getElementById("project-preview-close");
  if (!resultCount || !previewButton || !dialog || !carousel) return;

  resultCount.textContent = `${projects.length} ${projects.length === 1 ? "project" : "projects"}`;
  previewButton.disabled = projects.length === 0;
  previewButton.addEventListener("click", () => {
    const project = carousel.getActiveProject();
    if (!project) return;
    dialogTitle.textContent = String(project.title || "Project preview").replace(/-/g, " ");
    dialogContent.replaceChildren();
    appendProjectDetails(dialogContent, project);
    if (typeof dialog.showModal === "function") dialog.showModal();
  });
  closeButton?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => previewButton.focus());
}

export function initMotion() {
  initScrollReveals();
  if (motionInitialized) return;
  motionInitialized = true;
  initPointerAccents();
  initLocalTime();
  initCctvDemo();
}
