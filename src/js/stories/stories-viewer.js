import { STORIES } from "./stories-data.js";

function qs(root, sel) {
  const el = root.querySelector(sel);
  if (!el) throw new Error(`Missing element: ${sel}`);
  return el;
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export function initStoriesViewer({
  mountSelector = "[data-stories]",
  modalId = "storiesModal",
  defaultItemMs = 4500,
} = {}) {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  if (!mount.dataset.rendered) {
    mount.innerHTML = STORIES.map(
      (s) => `
      <button class="story" type="button" data-story-id="${s.id}">
        <span class="story__ring" aria-hidden="true"></span>
        <img class="story__img" src="${s.cover}" alt="${escapeHtml(s.title)}">
        <span class="story__label">${escapeHtml(s.title)}</span>
      </button>
    `,
    ).join("");
    mount.dataset.rendered = "true";
  }

  // Modal (create once)
  let modal = document.getElementById(modalId);
  if (!modal) {
    modal = document.createElement("div");
    modal.id = modalId;
    modal.className = "sv";
    modal.innerHTML = `
      <div class="sv__backdrop" data-sv-close></div>

      <div class="sv__dialog" role="dialog" aria-modal="true" aria-label="Stories viewer">
        <div class="sv__top">
          <div class="sv__bars" data-sv-bars></div>

          <div class="sv__head">
            <div class="sv__titleWrap">
              <div class="sv__title" data-sv-title>Stories</div>
              <a class="sv__link" data-sv-link href="#" target="_blank" rel="noopener">Відкрити в Instagram</a>
            </div>

            <button class="sv__close" type="button" data-sv-close aria-label="Close">✕</button>
          </div>
        </div>

        <div class="sv__body" data-sv-gesture>
          <button class="sv__nav sv__nav--left" type="button" data-sv-prev aria-label="Prev">‹</button>
          <div class="sv__stage" data-sv-stage></div>
          <button class="sv__nav sv__nav--right" type="button" data-sv-next aria-label="Next">›</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const barsEl = qs(modal, "[data-sv-bars]");
  const stageEl = qs(modal, "[data-sv-stage]");
  const titleEl = qs(modal, "[data-sv-title]");
  const linkEl = qs(modal, "[data-sv-link]");
  const gestureEl = qs(modal, "[data-sv-gesture]");

  let storyIndex = 0;
  let itemIndex = 0;
  let timer = null;
  let raf = null;
  let startTs = 0;
  let currentMs = defaultItemMs;

  function stopTimers() {
    if (timer) clearTimeout(timer);
    timer = null;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  function openModal() {
    modal.classList.add("is-open");
    document.documentElement.classList.add("no-scroll");
    document.addEventListener("keydown", onKeyDown);
  }

  function closeModal() {
    stopTimers();
    modal.classList.remove("is-open");
    document.documentElement.classList.remove("no-scroll");
    document.removeEventListener("keydown", onKeyDown);
    stageEl.innerHTML = "";
  }

  function onKeyDown(e) {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  }

  function setStoryById(id) {
    const idx = STORIES.findIndex((s) => s.id === id);
    storyIndex = idx >= 0 ? idx : 0;
    itemIndex = 0;
    renderStory();
    openModal();
    play();
  }

  function renderStory() {
    const story = STORIES[storyIndex];
    titleEl.textContent = story.title;
    linkEl.href = story.url || "#";

    // progress bars
    barsEl.innerHTML = story.items
      .map(
        (_, i) =>
          `<div class="sv__bar"><div class="sv__barFill" style="width:${i < itemIndex ? 100 : 0}%"></div></div>`,
      )
      .join("");

    renderItem();
  }

  function renderItem() {
    const story = STORIES[storyIndex];
    const item = story.items[itemIndex];

    // reset progress fills (past items full, future 0)
    [...barsEl.querySelectorAll(".sv__barFill")].forEach((fill, i) => {
      fill.style.width = i < itemIndex ? "100%" : "0%";
    });

    stageEl.innerHTML = "";

    if (item.type === "video") {
      const v = document.createElement("video");
      v.className = "sv__media";
      v.src = item.src;
      v.playsInline = true;
      v.autoplay = true;
      v.muted = true;
      v.loop = false;
      v.controls = false;

      v.addEventListener("loadedmetadata", () => {
        // cap duration to avoid too long
        const ms = clamp((v.duration || 4.5) * 1000, 2500, 9000);
        currentMs = ms;
        play();
      });

      v.addEventListener("ended", () => next());

      stageEl.appendChild(v);
      currentMs = defaultItemMs; // fallback until metadata
    } else {
      const img = document.createElement("img");
      img.className = "sv__media";
      img.src = item.src;
      img.alt = item.alt || "";
      img.loading = "eager";
      stageEl.appendChild(img);
      currentMs = defaultItemMs;
    }
  }

  function updateProgress() {
    const fill = barsEl.querySelectorAll(".sv__barFill")[itemIndex];
    if (!fill) return;

    const now = performance.now();
    const t = (now - startTs) / currentMs;
    fill.style.width = `${clamp(t * 100, 0, 100)}%`;

    if (t >= 1) {
      next();
      return;
    }
    raf = requestAnimationFrame(updateProgress);
  }

  function play() {
    stopTimers();
    startTs = performance.now();
    raf = requestAnimationFrame(updateProgress);
    // backup timer in case raf pauses
    timer = setTimeout(() => next(), currentMs + 80);
  }

  function next() {
    stopTimers();
    const story = STORIES[storyIndex];
    if (itemIndex < story.items.length - 1) {
      itemIndex++;
      renderItem();
      play();
      return;
    }
    // next story
    if (storyIndex < STORIES.length - 1) {
      storyIndex++;
      itemIndex = 0;
      renderStory();
      play();
      return;
    }

    closeModal();
  }

  function prev() {
    stopTimers();
    if (itemIndex > 0) {
      itemIndex--;
      renderItem();
      play();
      return;
    }
    if (storyIndex > 0) {
      storyIndex--;
      const story = STORIES[storyIndex];
      itemIndex = story.items.length - 1;
      renderStory();
      play();
      return;
    }
    // first item: just restart
    itemIndex = 0;
    renderItem();
    play();
  }

  // clicks on circles
  mount.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-story-id]");
    if (!btn) return;
    setStoryById(btn.dataset.storyId);
  });

  // modal close
  modal.addEventListener("click", (e) => {
    if (e.target.matches("[data-sv-close]")) closeModal();
  });

  qs(modal, "[data-sv-next]").addEventListener("click", next);
  qs(modal, "[data-sv-prev]").addEventListener("click", prev);

  // swipe (pointer events)
  let px0 = 0;
  let py0 = 0;
  let dragging = false;

  gestureEl.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true;
    px0 = e.clientX;
    py0 = e.clientY;
    gestureEl.setPointerCapture(e.pointerId);
  });

  gestureEl.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;

    const dx = e.clientX - px0;
    const dy = e.clientY - py0;

    // horizontal swipe
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
      return;
    }

    play();
  });

  return {
    openById: setStoryById,
    close: closeModal,
  };
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
