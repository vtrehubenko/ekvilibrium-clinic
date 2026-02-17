const STORAGE_KEY = "ek_selected_clinic";

const CLINICS = {
  odesa: {
    key: "odesa",
    label: "Одеса",
    heroCity: "Одесі",
    address: "Люстдорфська дорога 55М, Одеса",
    hours: "Пн–Сб 10:00–19:00",
    phone: "+380991234567",
    telegram: "USERNAME1",
    viber: "+380991234567",
  },
  clinic2: {
    key: "clinic2",
    label: "Клініка №2",
    heroCity: "місті",
    address: "Адреса другої клініки",
    hours: "Пн–Сб 10:00–19:00",
    phone: "+380991112233",
    telegram: "USERNAME2",
    viber: "+380991112233",
  },
};

export function initClinicDropdown() {
  // Dropdown elements
  const root = document.querySelector("[data-clinic]"); // wrapper .clinic
  const btn = document.querySelector("[data-clinic-btn]");
  const menu = document.querySelector("[data-clinic-menu]");
  const currentEl = document.querySelector("[data-clinic-current]");
  const items = Array.from(document.querySelectorAll("[data-clinic-item]"));

  // Elements to update
  const addressEl = document.querySelector("[data-address]");
  const hoursEl = document.querySelector("[data-hours]");
  const phoneBtn = document.querySelector("[data-phone]");
  const tgBtn = document.querySelector("[data-tg]");
  const viberBtn = document.querySelector("[data-viber]");

  // (optional) hero title city placeholder
  const heroCityEl = document.querySelector("[data-hero-city]");

  // minimal validation
  if (!btn || !menu || !currentEl || items.length === 0) return;

  // wrapper for is-open class
  const wrapper = root || btn.closest(".clinic") || btn.parentElement;

  // --- dropdown controls ---
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
    if (wrapper.classList.contains("is-open")) closeMenu();
    else openMenu();
  }

  // --- apply clinic ---
  function setActiveClinic(key) {
    const clinic = CLINICS[key] || CLINICS.odesa;

    // header current label
    currentEl.textContent = clinic.label;

    // active state in menu
    items.forEach((it) => {
      it.classList.toggle("is-active", it.dataset.clinicItem === clinic.key);
    });

    // update contacts
    if (addressEl) addressEl.textContent = clinic.address;
    if (hoursEl) hoursEl.textContent = clinic.hours;

    if (phoneBtn) {
      phoneBtn.href = `tel:${clinic.phone}`;
      phoneBtn.textContent = clinic.phone;
    }

    if (tgBtn) {
      tgBtn.href = `https://t.me/${clinic.telegram}`;
    }

    if (viberBtn) {
      const enc = encodeURIComponent(clinic.viber);
      viberBtn.href = `viber://chat?number=${enc}`;
    }

    // optional: update hero city word
    if (heroCityEl) heroCityEl.textContent = clinic.heroCity;

    // save
    try {
      localStorage.setItem(STORAGE_KEY, clinic.key);
    } catch (_) {}
  }

  // --- init from storage ---
  const saved = safeGet(STORAGE_KEY);
  setActiveClinic(saved && CLINICS[saved] ? saved : "odesa");

  // --- events ---
  btn.addEventListener("click", toggleMenu);

  items.forEach((it) => {
    it.addEventListener("click", (e) => {
      e.stopPropagation();
      const key = it.dataset.clinicItem;
      setActiveClinic(key);
      closeMenu();
    });
  });

  // close on outside click
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) closeMenu();
  });

  // close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/** localStorage safe getter */
function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
