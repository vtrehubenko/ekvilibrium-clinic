const GALLERIES = {
  lustdorf: {
    title: "Галерея — Люстдорфська дорога, 55М",
    items: [
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
        caption: "Зона очікуванн / ресепшн",
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
        src: "/img/clinics/bazar/lobby1.jpg",
        alt: "Ресепшн — Базарна",
        caption: "Зона очікування / ресепшн",
      },
    ],
  },
};

function clampIndex(i, len) {
  if (len === 0) return 0;
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

  let activeClinic = getClinicFromStorage() || "lustdorf";
  let activeIndex = 0;

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

    update();
  }

  function update() {
    const itemsLen = GALLERIES[activeClinic]?.items?.length || 0;
    activeIndex = clampIndex(activeIndex, itemsLen);

    const x = -activeIndex * 100;
    track.style.transform = `translateX(${x}%)`;

    dotsWrap.querySelectorAll(".gallery__dot").forEach((d, i) => {
      d.classList.toggle("is-active", i === activeIndex);
    });
  }

  function goTo(i) {
    activeIndex = i;
    update();
  }

  function prev() {
    activeIndex -= 1;
    update();
  }

  function next() {
    activeIndex += 1;
    update();
  }

  btnPrev?.addEventListener("click", prev);
  btnNext?.addEventListener("click", next);

  let startX = 0;
  let isDown = false;

  root.addEventListener("pointerdown", (e) => {
    isDown = true;
    startX = e.clientX;
  });

  root.addEventListener("pointerup", (e) => {
    if (!isDown) return;
    isDown = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) dx > 0 ? prev() : next();
  });

  window.addEventListener("clinic:change", (e) => {
    const clinicKey = e?.detail?.id || e?.detail?.key;
    if (!clinicKey) return;
    render(clinicKey);
  });

  render(activeClinic);
}

function getClinicFromStorage() {
  try {
    return localStorage.getItem("clinic_id");
  } catch {
    return null;
  }
}
