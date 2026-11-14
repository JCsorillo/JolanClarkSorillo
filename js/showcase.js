// v2.1.0
const iconSvg = (name, size = 20) =>
  `<svg class="icon icon-${size} icon-${name}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="img/icons.svg#${name}"></use></svg>`;

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[char]));

const safeHttpUrl = (value) => {
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

export function createProjectCarousel(container) {
  if (!container) return { setProjects: () => {} };

  container.classList.add("project-carousel");
  container.innerHTML = `
    <div class="project-carousel-region" role="region" aria-roledescription="carousel" aria-label="Project previews" tabindex="0">
      <div class="project-carousel-track"></div>
    </div>
    <div class="project-carousel-controls">
      <button class="project-carousel-arrow project-carousel-prev" type="button" aria-label="Previous project">${iconSvg("arrow-up-right", 20)}</button>
      <div class="project-carousel-pagination">
        <div class="project-carousel-dots" aria-label="Choose a project"></div>
        <span class="project-carousel-count" aria-hidden="true"></span>
      </div>
      <button class="project-carousel-arrow project-carousel-next" type="button" aria-label="Next project">${iconSvg("arrow-up-right", 20)}</button>
    </div>
    <div class="project-carousel-info" aria-live="off"></div>
    <p class="project-carousel-announcement visually-hidden" aria-live="polite" aria-atomic="true"></p>`;

  const region = container.querySelector(".project-carousel-region");
  const track = container.querySelector(".project-carousel-track");
  const dots = container.querySelector(".project-carousel-dots");
  const count = container.querySelector(".project-carousel-count");
  const info = container.querySelector(".project-carousel-info");
  const announcement = container.querySelector(".project-carousel-announcement");
  let projects = [];
  let activeIndex = 0;
  let dragStart = null;
  let pointerDragging = false;
  let suppressClickUntil = 0;
  let infoTimer = 0;
  let resizeObserver;

  const clearSlideTimer = (slide) => {
    if (slide.previewTimer) window.clearTimeout(slide.previewTimer);
    slide.previewTimer = 0;
  };

  const setFrameScale = (frame, iframe) => {
    const width = frame.clientWidth;
    iframe.style.transform = `scale(${width / 390})`;
  };

  const loadPreview = (slide, project) => {
    const iframe = slide.querySelector("iframe");
    const frame = slide.querySelector(".project-preview-frame");
    const target = safeHttpUrl(project.url);
    if (!iframe || !target || iframe.dataset.requested === "true") return;
    iframe.dataset.requested = "true";
    setFrameScale(frame, iframe);
    iframe.src = target;
    slide.previewTimer = window.setTimeout(() => {
      if (!slide.classList.contains("is-loaded")) {
        slide.querySelector(".project-preview-unavailable").hidden = false;
      }
    }, 8000);
  };

  const unloadPreview = (slide) => {
    const iframe = slide.querySelector("iframe");
    if (!iframe || iframe.dataset.requested !== "true") return;
    clearSlideTimer(slide);
    iframe.src = "about:blank";
    iframe.dataset.requested = "false";
    slide.classList.remove("is-loaded");
    slide.querySelector(".project-preview-unavailable").hidden = true;
  };

  const renderInfo = (project) => {
    if (infoTimer) window.clearTimeout(infoTimer);
    info.classList.add("is-swapping");
    infoTimer = window.setTimeout(() => {
      const features = (Array.isArray(project.features) ? project.features : [])
        .slice(0, 3)
        .map((feature) => `<li>${escapeHtml(feature)}</li>`)
        .join("");
      const tech = (Array.isArray(project.techStack) ? project.techStack : [])
        .map((item) => `<span class="project-preview-chip">${escapeHtml(item)}</span>`)
        .join("");
      const title = String(project.title || "Untitled project").replace(/-/g, " ");
      const url = safeHttpUrl(project.url);
      info.innerHTML = `
        <div class="project-preview-meta">
          <span class="project-preview-category">${escapeHtml(project.category || "Project")}</span>
          <span>${escapeHtml(project.year || "")}${project.status ? ` · ${escapeHtml(project.status)}` : ""}</span>
        </div>
        <h3>${escapeHtml(title)}</h3>
        <p class="project-preview-description">${escapeHtml(project.description || "")}</p>
        ${features ? `<ul class="project-preview-features">${features}</ul>` : ""}
        ${tech ? `<div class="project-preview-chips">${tech}</div>` : ""}
        ${url ? `<a class="project-preview-open" href="${url}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.linkText || "Open live site")} <span aria-hidden="true">↗</span></a>` : ""}`;
      info.classList.remove("is-swapping");
      announcement.textContent = `${title}, project ${activeIndex + 1} of ${projects.length}`;
    }, reducedMotion.matches ? 0 : 130);
  };

  const updateSlides = () => {
    const slides = [...track.querySelectorAll(".project-preview-slide")];
    const activeFrame = slides[activeIndex]?.querySelector(".project-preview-frame");
    const mobile = window.matchMedia("(max-width: 640px)").matches;
    const step = (activeFrame?.clientWidth || 0) * (mobile ? 1 : 0.92);
    const maxVisibleDistance = mobile ? 1 : 2;
    slides.forEach((slide, index) => {
      let offset = index - activeIndex;
      if (offset > projects.length / 2) offset -= projects.length;
      if (offset < -projects.length / 2) offset += projects.length;
      const distance = Math.abs(offset);
      const scale = distance === 0 ? 1 : distance === 1 ? 0.84 : distance === 2 ? 0.7 : 0.6;
      slide.style.transform = `translate(-50%, -50%) translateX(${offset * step}px) scale(${scale})`;
      slide.style.opacity = distance === 0 ? "1" : distance === 1 ? "0.75" : distance === 2 && !mobile ? "0.45" : "0";
      slide.style.zIndex = String(projects.length - distance);
      slide.style.pointerEvents = distance > maxVisibleDistance ? "none" : "auto";
      slide.setAttribute("aria-label", `${index + 1} of ${projects.length}`);
      slide.setAttribute("aria-hidden", String(distance > maxVisibleDistance));
      slide.querySelector(".project-preview-link").tabIndex = distance > maxVisibleDistance ? -1 : 0;
      slide.classList.toggle("is-active", distance === 0);
      if (distance <= 1) loadPreview(slide, projects[index]);
      else unloadPreview(slide);
    });
    const project = projects[activeIndex];
    if (project) renderInfo(project);
    count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
    dots.innerHTML = projects.map((item, index) =>
      `<button type="button" class="project-carousel-dot${index === activeIndex ? " is-active" : ""}" data-index="${index}" aria-label="Show ${escapeHtml(item.title || `project ${index + 1}`)}" aria-current="${index === activeIndex ? "true" : "false"}"></button>`
    ).join("");
    container.querySelector(".project-carousel-prev").disabled = projects.length < 2;
    container.querySelector(".project-carousel-next").disabled = projects.length < 2;
  };

  const setActive = (index) => {
    if (!projects.length) return;
    activeIndex = (index + projects.length) % projects.length;
    updateSlides();
  };

  const moveBy = (direction) => setActive(activeIndex + direction);

  container.querySelector(".project-carousel-prev").addEventListener("click", () => moveBy(-1));
  container.querySelector(".project-carousel-next").addEventListener("click", () => moveBy(1));
  region.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveBy(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveBy(1);
    }
  });
  dots.addEventListener("click", (event) => {
    const dot = event.target.closest("[data-index]");
    if (dot) setActive(Number(dot.dataset.index));
  });
  track.addEventListener("click", (event) => {
    if (Date.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const slide = event.target.closest(".project-preview-slide");
    if (!slide) return;
    const index = Number(slide.dataset.index);
    if (index !== activeIndex) {
      event.preventDefault();
      setActive(index);
    }
  });
  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    pointerDragging = false;
  });
  track.addEventListener("pointermove", (event) => {
    if (!dragStart || event.pointerId !== dragStart.pointerId) return;
    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;
    if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
      pointerDragging = true;
      track.setPointerCapture?.(event.pointerId);
    }
  });
  track.addEventListener("pointerup", (event) => {
    if (!dragStart || event.pointerId !== dragStart.pointerId) return;
    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;
    if (pointerDragging && Math.abs(deltaX) > Math.abs(deltaY)) {
      suppressClickUntil = Date.now() + 500;
      if (Math.abs(deltaX) > 40) moveBy(deltaX < 0 ? 1 : -1);
    }
    dragStart = null;
    pointerDragging = false;
  });
  track.addEventListener("pointercancel", () => {
    dragStart = null;
    pointerDragging = false;
  });

  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(({ target }) => {
        if (target === region) updateSlides();
        else {
          const iframe = target.querySelector("iframe");
          if (iframe) setFrameScale(target, iframe);
        }
      });
    });
    resizeObserver.observe(region);
  } else {
    window.addEventListener("resize", updateSlides, { passive: true });
  }

  return {
    setProjects(nextProjects, emptyMessage = "No matching projects found.") {
      projects = nextProjects;
      activeIndex = 0;
      if (infoTimer) window.clearTimeout(infoTimer);
      track.querySelectorAll(".project-preview-frame").forEach((frame) => {
        resizeObserver?.unobserve(frame);
        const slide = frame.closest(".project-preview-slide");
        if (slide) unloadPreview(slide);
      });
      if (!projects.length) {
        track.innerHTML = "";
        dots.innerHTML = "";
        info.innerHTML = "";
        count.textContent = "";
        region.hidden = true;
        container.querySelector(".project-carousel-controls").hidden = true;
        container.insertAdjacentHTML("beforeend", `<p class="empty-results card project-carousel-empty">${escapeHtml(emptyMessage)}</p>`);
        announcement.textContent = emptyMessage;
        return;
      }
      container.querySelector(".project-carousel-empty")?.remove();
      region.hidden = false;
      container.querySelector(".project-carousel-controls").hidden = false;
      track.innerHTML = projects.map((project, index) => {
        const title = String(project.title || "Untitled project");
        const url = safeHttpUrl(project.url);
        const letter = title.charAt(0).toUpperCase();
        return `
          <div class="project-preview-slide" data-index="${index}" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${projects.length}">
            <a class="project-preview-link" href="${url || "#"}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(title)} live site">
              <span class="project-preview-frame">
                <span class="project-preview-skeleton" aria-hidden="true"><span>${escapeHtml(letter)}</span></span>
                <iframe title="Live preview of ${escapeHtml(title)}" width="390" height="780" sandbox="allow-scripts allow-same-origin" referrerpolicy="no-referrer" tabindex="-1"></iframe>
                <span class="project-preview-unavailable" hidden>Preview unavailable.<br>Open live site</span>
              </span>
            </a>
          </div>`;
      }).join("");
      track.querySelectorAll("iframe").forEach((iframe) => {
        iframe.addEventListener("load", () => {
          if (iframe.dataset.requested !== "true") return;
          const slide = iframe.closest(".project-preview-slide");
          clearSlideTimer(slide);
          slide.classList.add("is-loaded");
          slide.querySelector(".project-preview-unavailable").hidden = true;
        });
        iframe.addEventListener("error", () => {
          const slide = iframe.closest(".project-preview-slide");
          clearSlideTimer(slide);
          slide.querySelector(".project-preview-unavailable").hidden = false;
        });
      });
      track.querySelectorAll(".project-preview-frame").forEach((frame) => resizeObserver?.observe(frame));
      updateSlides();
    },
  };
}

const contactCards = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "whatsapp",
    className: "is-whatsapp",
    detail: `<p class="contact-card-number">+63 9** *** ****</p><div class="contact-typing" aria-hidden="true"><i></i><i></i><i></i></div><p class="contact-typing-copy">Larck is typing... say hi first.</p>`,
    link: "https://wa.me/639287328109",
    linkText: "Message",
    newTab: true,
  },
  {
    id: "gmail",
    name: "Gmail",
    icon: "mail",
    className: "is-gmail",
    detail: `<div class="gmail-compose"><p><span>To:</span> Jolan Clark</p><p>Remote work inquiry</p><p>Hi Larck, are you open<span class="gmail-caret" aria-hidden="true"></span></p></div>`,
    link: "mailto:sorillojolanclark@gmail.com?subject=Remote%20work%20inquiry",
    linkText: "Write",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "linkedin",
    className: "is-linkedin",
    detail: `<p class="contact-card-person">Jolan Clark Sorillo</p><p>IT Support and Web Developer</p>`,
    link: "https://www.linkedin.com/in/jolan-clark-sorillo-011197256/?originalSubdomain=ph",
    linkText: "View profile",
    newTab: true,
  },
  {
    id: "viber",
    name: "Viber",
    icon: "viber",
    className: "is-viber",
    detail: `<p class="contact-card-number">+63 9** *** ****</p><p>Open a chat</p>`,
    link: "viber://chat?number=%2B639287328109",
    linkText: "Open Viber",
  },
];

function renderContactStack(mount) {
  mount.innerHTML = `
    <div class="contact-stack-profile">
      <img src="img/intro-bg.webp" alt="" width="56" height="56">
      <div class="contact-stack-profile-copy">
        <strong>Jolan Clark Sorillo</strong>
        <span>IT Support and Web Developer</span>
        <time class="contact-local-time"></time>
      </div>
    </div>
    <div class="contact-stack" role="group" aria-label="Choose how to contact Jolan">
      ${contactCards.map((card, index) => `
        <article class="contact-stack-card ${card.className}" data-card-id="${card.id}">
          <button class="contact-stack-card-header" type="button" aria-label="Show ${card.name} card" aria-expanded="${index === 0}" ${index === 0 ? "hidden" : ""}>
            ${iconSvg(card.icon)}<span>${card.name}</span>
          </button>
          <div class="contact-stack-card-content" ${index === 0 ? "" : "inert"}>
            <div class="contact-stack-card-brand">${iconSvg(card.icon)}<span>${card.name}</span></div>
            <div class="contact-stack-card-detail">${card.detail}</div>
            <a class="contact-stack-card-action" href="${card.link}" ${card.newTab ? 'target="_blank" rel="noopener noreferrer"' : ""}>${card.linkText} <span aria-hidden="true">↗</span></a>
          </div>
        </article>`).join("")}
    </div>`;

  const stack = mount.querySelector(".contact-stack");
  let order = contactCards.map((card) => card.id);

  const updateOrder = () => {
    order.forEach((id, position) => {
      const card = stack.querySelector(`[data-card-id="${id}"]`);
      const header = card.querySelector(".contact-stack-card-header");
      const front = position === 0;
      card.style.setProperty("--stack-y", `${(order.length - 1 - position) * 56}px`);
      card.style.zIndex = String(order.length - position);
      card.classList.toggle("is-front", front);
      header.hidden = front;
      header.setAttribute("aria-expanded", String(front));
      card.querySelector(".contact-stack-card-content").inert = !front;
    });
    const front = stack.querySelector(`[data-card-id="${order[0]}"]`);
    stack.style.setProperty("--stack-height", `${front.offsetHeight + (order.length - 1) * 56}px`);
  };

  stack.addEventListener("click", (event) => {
    const button = event.target.closest(".contact-stack-card-header");
    if (!button) return;
    const clickedId = button.closest(".contact-stack-card").dataset.cardId;
    const index = order.indexOf(clickedId);
    if (index <= 0) return;
    order = [...order.slice(index), ...order.slice(0, index)];
    updateOrder();
  });

  const updateLocalTime = () => {
    const time = mount.querySelector(".contact-local-time");
    if (!time) return;
    const value = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());
    time.textContent = `Iloilo City, local time ${value}`;
  };
  updateLocalTime();
  window.setInterval(updateLocalTime, 30000);
  updateOrder();
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(updateOrder);
    observer.observe(stack);
  } else {
    window.addEventListener("resize", updateOrder, { passive: true });
  }
}

document.querySelectorAll(".contact-stack-mount").forEach(renderContactStack);
