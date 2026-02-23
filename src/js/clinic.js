const STORAGE_KEY = "ek_selected_clinic";

const CLINICS = {
  lustdorf: {
    key: "lustdorf",
    label: "Люстдорфська Дорога",
    address: "Люстдорфська дорога 55М, Одеса",
    shortAddress: "Люстдорфська дорога, 55М",
    hours: "Пн–Сб 10:00–19:00",
    phone: "+380506820169",
    telegram: "tombri",
    viber: "+380506820169",
    mapAddress: "Люстдорфська дорога 55М, Одеса",
    heroCity: "Одесі",
    gallery: [
      "/img/clinics/lustdorf/cab1.jpg",
      "/img/clinics/lustdorf/cab2.jpg",
      "/img/clinics/lustdorf/lobby1.jpg",
    ],
  },

  bazar: {
    key: "bazar",
    label: "Базарна",
    address: "Базарна 26, Одеса",
    shortAddress: "Базарна 26",
    hours: "Пн–Сб 10:00–19:00",
    phone: "+380506820169",
    telegram: "tombri",
    viber: "+380506820169",
    mapAddress: "Базарна 26, Одеса",
    heroCity: "Одесі",
    gallery: ["/img/clinics/bazar/cab1.jpg", "/img/clinics/bazar/lobby1.jpg"],
  },
};

export function initClinicDropdown() {
  const roots = Array.from(document.querySelectorAll("[data-clinic]"));
  if (!roots.length) return;

  const addressEl = document.querySelector("[data-address]");
  const hoursEl = document.querySelector("[data-hours]");
  const heroCityEl = document.querySelector("[data-hero-city]");

  const phoneBtns = document.querySelectorAll("[data-phone]");
  const tgBtns = document.querySelectorAll("[data-tg]");
  const viberBtns = document.querySelectorAll("[data-viber]");

  const mapIframe = document.querySelector("[data-map-iframe]");

  const modalClinicEl = document.querySelector("[data-modal-clinic]");
  const modalAddressEl = document.querySelector("[data-modal-address]");

  const galleryTitleEl = document.querySelector("[data-gallery-title]");

  function closeAll(exceptRoot = null) {
    roots.forEach((r) => {
      if (exceptRoot && r === exceptRoot) return;

      const b = r.querySelector("[data-clinic-btn]");
      const m = r.querySelector("[data-clinic-menu]");

      if (m) m.style.display = "none";
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }

  // -----------------------
  // Clinic gallery renderer
  // -----------------------
  let galleryIndex = 0;

  function renderClinicGallery(images, clinicLabel) {
    const galleryRoot = document.querySelector("[data-clinic-gallery]");
    if (!galleryRoot) return;

    const track = galleryRoot.querySelector("[data-gallery-track]");
    const dots = galleryRoot.querySelector("[data-gallery-dots]");
    const prev = galleryRoot.querySelector(".gallery__nav--prev");
    const next = galleryRoot.querySelector(".gallery__nav--next");

    if (!track || !dots) return;

    const imgs = Array.isArray(images) ? images : [];
    if (!imgs.length) {
      track.innerHTML = "";
      dots.innerHTML = "";
      return;
    }

    galleryIndex = 0;

    // rebuild slides (important: keep .gallery__slide wrapper for aspect-ratio)
    track.innerHTML = imgs
      .map(
        (src, i) => `
          <div class="gallery__slide">
            <img
              src="${src}"
              alt="Галерея — ${clinicLabel} — ${i + 1}"
              loading="lazy"
            />
          </div>
        `,
      )
      .join("");

    // rebuild dots
    dots.innerHTML = "";
    imgs.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "gallery__dot";
      b.setAttribute("aria-label", `Фото ${i + 1}`);
      b.addEventListener("click", () => goTo(i));
      dots.appendChild(b);
    });

    function updateDots() {
      const ds = Array.from(dots.querySelectorAll("button"));
      ds.forEach((d, i) =>
        d.setAttribute("aria-current", i === galleryIndex ? "true" : "false"),
      );
    }

    function goTo(i) {
      galleryIndex = (i + imgs.length) % imgs.length;
      track.style.transform = `translateX(-${galleryIndex * 100}%)`;
      updateDots();
    }

    // replace nav buttons to wipe old handlers
    if (prev) {
      const prevClone = prev.cloneNode(true);
      prev.parentNode.replaceChild(prevClone, prev);
    }
    if (next) {
      const nextClone = next.cloneNode(true);
      next.parentNode.replaceChild(nextClone, next);
    }

    const prevBtn = galleryRoot.querySelector(".gallery__nav--prev");
    const nextBtn = galleryRoot.querySelector(".gallery__nav--next");

    prevBtn?.addEventListener("click", () => goTo(galleryIndex - 1));
    nextBtn?.addEventListener("click", () => goTo(galleryIndex + 1));

    // avoid visual artifacts after re-render
    track.style.transition = "none";
    track.style.transform = "translateX(0%)";
    void track.offsetHeight;
    track.style.transition = "";

    goTo(0);
  }

  // -----------------------
  // Apply clinic
  // -----------------------
  function applyClinic(clinicKey) {
    const clinic = CLINICS[clinicKey];
    if (!clinic) return;

    if (addressEl) addressEl.textContent = clinic.address;
    if (hoursEl) hoursEl.textContent = clinic.hours;
    if (heroCityEl) heroCityEl.textContent = clinic.heroCity;

    if (galleryTitleEl) {
      galleryTitleEl.textContent = `Галерея — ${clinic.shortAddress}`;
    }

    if (modalClinicEl) modalClinicEl.textContent = "Одеса";
    if (modalAddressEl) modalAddressEl.textContent = clinic.address;

    roots.forEach((r) => {
      const currentEl = r.querySelector("[data-clinic-current]");
      if (currentEl) currentEl.textContent = clinic.label;
    });

    phoneBtns.forEach((a) => {
      a.href = `tel:${clinic.phone}`;

      if (a.tagName === "A" && a.textContent.trim().startsWith("+")) {
        a.textContent = clinic.phone;
      }
    });

    tgBtns.forEach((a) => {
      a.href = `https://t.me/${clinic.telegram}`;
    });

    viberBtns.forEach((a) => {
      const n = clinic.viber.replace("+", "");
      a.href = `viber://chat?number=%2B${n}`;
    });

    if (mapIframe) {
      const q = encodeURIComponent(clinic.mapAddress);
      mapIframe.src = `https://www.google.com/maps?q=${q}&output=embed`;
    }

    // other sliders (certs etc.)
    document.querySelectorAll("[data-slider]").forEach((root) => {
      if (typeof root._sliderRefresh === "function") root._sliderRefresh();
    });

    // clinic gallery
    renderClinicGallery(clinic.gallery, clinic.label);

    localStorage.setItem(STORAGE_KEY, clinicKey);
  }

  // init
  const saved = localStorage.getItem(STORAGE_KEY);
  const initialKey = saved && CLINICS[saved] ? saved : "lustdorf";
  applyClinic(initialKey);

  // dropdown events for each root
  roots.forEach((root) => {
    const btn = root.querySelector("[data-clinic-btn]");
    const menu = root.querySelector("[data-clinic-menu]");
    const items = Array.from(root.querySelectorAll("[data-clinic-item]"));

    if (!btn || !menu) return;

    menu.style.display = "none";

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const expanded = btn.getAttribute("aria-expanded") === "true";
      closeAll(root);
      btn.setAttribute("aria-expanded", String(!expanded));
      menu.style.display = expanded ? "none" : "block";
    });

    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = item.getAttribute("data-clinic-item");
        applyClinic(key);
        closeAll();
      });
    });
  });

  document.addEventListener("click", () => closeAll());
}
