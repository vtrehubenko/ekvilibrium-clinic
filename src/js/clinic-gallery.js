const GALLERIES = {
  lustdorf: {
    title: "Галерея — Люстдорфська дорога, 55М",
    items: [
      {
        src: "/img/clinics/lustdorf/reg.jpg",
        alt: "Кабінет 1 — Люстдорфська",
        caption: "Кабінет — сучасне обладнання",
      },
      {
        src: "/img/clinics/lustdorf/cab1.jpg",
        alt: "Кабінет 1 — Люстдорфська",
        caption: "Кабінет — сучасне обладнання",
      },
      {
        src: "/img/clinics/lustdorf/cab2.jpg",
        alt: "Кабінет 2 — Люстдорфська",
        caption: "Кабінет — зона лікування",
      },
      {
        src: "/img/clinics/lustdorf/lobby1.jpg",
        alt: "Ресепшн — Люстдорфська",
        caption: "Зона очікування / ресепшн",
      },
      {
        src: "/img/clinics/lustdorf/corr.jpg",
        alt: "Ресепшн — Люстдорфська",
        caption: "Зона очікування / ресепшн",
      },
    ],
  },

  bazar: {
    title: "Галерея — Базарна, 26",
    items: [
      {
        src: "/img/clinics/bazar/cab1.jpg",
        alt: "Кабінет — Базарна",
        caption: "Кабінет — комфорт та стерильність",
      },
      {
        src: "/img/clinics/bazar/cab1.jpg",
        alt: "Кабінет — Базарна",
        caption: "Кабінет — комфорт та стерильність",
      },
      {
        src: "/img/clinics/bazar/cab1.jpg",
        alt: "Кабінет — Базарна",
        caption: "Кабінет — комфорт та стерильність",
      },
      {
        src: "/img/clinics/bazar/lobby1.jpg",
        alt: "Ресепшн — Базарна",
        caption: "Зона очікування / ресепшн",
      },
      {
        src: "/img/clinics/bazar/lobby2.jpg",
        alt: "Ресепшн — Базарна",
        caption: "Зона очікування / ресепшн",
      },
    ],
  },
};

function clampIndex(i, len) {
  if (len <= 0) return 0;
  return (i + len) % len;
}

export function initClinicGallery() {
  const root = document.querySelector("[data-clinic-gallery]");
  if (!root) return;

  const track = root.querySelector("[data-gallery-track]");
  const dotsWrap = root.querySelector("[data-gallery-dots]");
  const btnPrev = root.querySelector(".gallery__nav--prev");
  const btnNext = root.querySelector(".gallery__nav--next");
  const titleEl = document.querySelector(".clinic-gallery__title");
  const viewport = root.querySelector("[data-gallery-viewport]") || root;

  if (!track || !dotsWrap) return;

  let activeClinic = getClinicFromStorage() || "lustdorf";
  let activeIndex = 0;

  function getItemsLen() {
    return (GALLERIES[activeClinic]?.items || []).length;
  }

  function update() {
    const gallery = GALLERIES[activeClinic] || GALLERIES.lustdorf;
    const itemsLen = gallery.items.length;

    activeIndex = clampIndex(activeIndex, itemsLen);

    const slideW = viewport.getBoundingClientRect().width;
    track.style.transform = `translateX(${-activeIndex * slideW}px)`;

    dotsWrap.querySelectorAll(".gallery__dot").forEach((d, i) => {
      d.classList.toggle("is-active", i === activeIndex);
    });
  }

  function goTo(i) {
    activeIndex = i;
    update();
  }

  function next() {
    const itemsLen = getItemsLen();
    if (itemsLen <= 1) return;
    activeIndex = clampIndex(activeIndex + 1, itemsLen);
    update();
  }

  function prev() {
    const itemsLen = getItemsLen();
    if (itemsLen <= 1) return;
    activeIndex = clampIndex(activeIndex - 1, itemsLen);
    update();
  }

  function render(clinicKey) {
    const gallery = GALLERIES[clinicKey] || GALLERIES.lustdorf;
    activeClinic = clinicKey in GALLERIES ? clinicKey : "lustdorf";
    activeIndex = 0;

    if (titleEl) titleEl.textContent = gallery.title;

    track.innerHTML = gallery.items
      .map(
        (it) => `
          <div class="gallery__slide">
            <img src="${it.src}" alt="${it.alt}" loading="lazy" />
            ${it.caption ? `<div class="gallery__caption">${it.caption}</div>` : ""}
          </div>
        `,
      )
      .join("");

    dotsWrap.innerHTML = gallery.items
      .map(
        (_, i) =>
          `<button class="gallery__dot ${i === 0 ? "is-active" : ""}" type="button" aria-label="Фото ${i + 1}"></button>`,
      )
      .join("");

    dotsWrap.querySelectorAll(".gallery__dot").forEach((dot, i) => {
      dot.addEventListener("click", () => goTo(i));
    });

    requestAnimationFrame(update);
  }

  btnPrev?.addEventListener("click", prev);
  btnNext?.addEventListener("click", next);

  let startX = 0;
  let lastX = 0;
  let isDown = false;

  function onMove(e) {
    if (!isDown) return;
    lastX = e.clientX;
  }

  viewport.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, a")) return;

    isDown = true;
    startX = lastX = e.clientX;

    viewport.setPointerCapture?.(e.pointerId);
    viewport.addEventListener("pointermove", onMove);
  });

  viewport.addEventListener("pointerup", () => {
    if (!isDown) return;
    isDown = false;

    viewport.removeEventListener("pointermove", onMove);

    const itemsLen = getItemsLen();
    if (itemsLen <= 1) return;

    const dx = lastX - startX;
    const threshold = 35;

    if (dx > threshold) activeIndex = clampIndex(activeIndex - 1, itemsLen);
    else if (dx < -threshold)
      activeIndex = clampIndex(activeIndex + 1, itemsLen);

    update();
  });

  viewport.addEventListener("pointercancel", () => {
    isDown = false;
    viewport.removeEventListener("pointermove", onMove);
  });

  window.addEventListener("clinic:change", (e) => {
    const clinicKey = e?.detail?.id || e?.detail?.key;
    if (!clinicKey) return;
    render(clinicKey);
  });

  window.addEventListener("resize", () => requestAnimationFrame(update));

  render(activeClinic);
}

function getClinicFromStorage() {
  try {
    return localStorage.getItem("ek_selected_clinic");
  } catch {
    return null;
  }
}
