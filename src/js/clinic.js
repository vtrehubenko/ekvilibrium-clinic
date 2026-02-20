const STORAGE_KEY = "ek_selected_clinic";

const CLINICS = {
  lustdorf: {
    key: "lustdorf",
    label: "Одеса",
    address: "Люстдорфська дорога 55М, Одеса",
    hours: "Пн–Сб 10:00–19:00",
    phone: "+380506820169",
    telegram: "tombri",
    viber: "+380506820169",
    mapAddress: "Люстдорфська дорога 55М, Одеса",
    heroCity: "Одесі",
  },
  bazar: {
    key: "bazar",
    label: "Одеса",
    address: "Базарна 26, Одеса",
    hours: "Пн–Сб 10:00–19:00",
    phone: "+380506820169",
    telegram: "tombri",
    viber: "+380506820169",
    mapAddress: "Базарна 26, Одеса",
    heroCity: "Одесі",
  },
};

export function initClinicDropdown() {
  const root = document.querySelector("[data-clinic]");
  const btn = document.querySelector("[data-clinic-btn]");
  const menu = document.querySelector("[data-clinic-menu]");
  const currentEl = document.querySelector("[data-clinic-current]");
  const items = Array.from(document.querySelectorAll("[data-clinic-item]"));

  const addressEl = document.querySelector("[data-address]");
  const hoursEl = document.querySelector("[data-hours]");

  const phoneBtns = document.querySelectorAll("[data-phone]");
  const tgBtns = document.querySelectorAll("[data-tg]");
  const viberBtns = document.querySelectorAll("[data-viber]");

  const mapIframe = document.querySelector("[data-map-iframe]");
  const heroCityEl = document.querySelector("[data-hero-city]");

  if (!btn || !menu || !currentEl || items.length === 0) return;

  const wrapper = root || btn.closest(".clinic") || btn.parentElement;

  function openMenu() {
    wrapper.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    wrapper.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  }

  function toggleMenu(e) {
    e?.stopPropagation();
    wrapper.classList.contains("is-open") ? closeMenu() : openMenu();
  }

  function setActiveClinic(key) {
    const clinic = CLINICS[key] || CLINICS.lustdorf;

    currentEl.textContent = clinic.label;

    items.forEach((it) => {
      it.classList.toggle("is-active", it.dataset.clinicItem === clinic.key);
    });

    if (addressEl) addressEl.textContent = clinic.address;
    if (hoursEl) hoursEl.textContent = clinic.hours;

    if (phoneBtns.length) {
      phoneBtns.forEach((el) => {
        el.href = `tel:${clinic.phone}`;
        el.textContent = clinic.phone;
      });
    }

    if (tgBtns.length) {
      tgBtns.forEach((el) => {
        el.href = `https://t.me/${clinic.telegram}`;
      });
    }

    if (viberBtns.length) {
      const enc = encodeURIComponent(clinic.viber);
      viberBtns.forEach((el) => {
        el.href = `viber://chat?number=${enc}`;
      });
    }

    if (mapIframe && clinic.mapAddress) {
      const q = encodeURIComponent(clinic.mapAddress);
      mapIframe.src = `https://www.google.com/maps?q=${q}&output=embed`;
    }

    if (heroCityEl && clinic.heroCity) heroCityEl.textContent = clinic.heroCity;

    try {
      localStorage.setItem(STORAGE_KEY, clinic.key);
    } catch (_) {}
    window.dispatchEvent(
      new CustomEvent("clinic:change", { detail: { key: clinic.key } }),
    );
  }

  const saved = safeGet(STORAGE_KEY);
  setActiveClinic(saved && CLINICS[saved] ? saved : "lustdorf");

  btn.addEventListener("click", toggleMenu);

  items.forEach((it) => {
    it.addEventListener("click", (e) => {
      e.stopPropagation();
      setActiveClinic(it.dataset.clinicItem);
      closeMenu();
    });
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
