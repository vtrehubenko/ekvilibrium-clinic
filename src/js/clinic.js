const STORAGE_KEY = "ek_selected_clinic";

const CLINICS = {
  lustdorf: {
    key: "lustdorf",
    label: "Люстдорфська Дорога",
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
    label: "Базарна",
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
  const roots = Array.from(document.querySelectorAll("[data-clinic]"));
  if (!roots.length) return;

  const addressEl = document.querySelector("[data-address]");
  const hoursEl = document.querySelector("[data-hours]");

  const phoneBtns = document.querySelectorAll("[data-phone]");
  const tgBtns = document.querySelectorAll("[data-tg]");
  const viberBtns = document.querySelectorAll("[data-viber]");

  const mapIframe = document.querySelector("[data-map-iframe]");
  const heroCityEl = document.querySelector("[data-hero-city]");

  const modalClinicEl = document.querySelector("[data-modal-clinic]");
  const modalAddressEl = document.querySelector("[data-modal-address]");

  function closeAll(exceptRoot = null) {
    roots.forEach((r) => {
      if (exceptRoot && r === exceptRoot) return;
      const b = r.querySelector("[data-clinic-btn]");
      const m = r.querySelector("[data-clinic-menu]");
      if (m) m.style.display = "none";
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }

  function applyClinic(clinicKey) {
    const clinic = CLINICS[clinicKey];
    if (!clinic) return;

    if (addressEl) addressEl.textContent = clinic.address;
    if (hoursEl) hoursEl.textContent = clinic.hours;
    if (heroCityEl) heroCityEl.textContent = clinic.heroCity;

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

    localStorage.setItem(STORAGE_KEY, clinicKey);
  }

  const saved = localStorage.getItem("ek_selected_clinic");
  const initialKey = saved && CLINICS[saved] ? saved : "lustdorf";
  applyClinic(initialKey);

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

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
