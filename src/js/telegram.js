const STORAGE_KEY = "ek_selected_clinic";

import { CLINICS } from "./clinicDropdown.js";

export function initTelegramForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const TG_USERNAME = "tombri";

  form.addEventListener(
    "submit",
    (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      const fd = new FormData(form);
      const name = (fd.get("name") || "").toString().trim();
      const phone = (fd.get("phone") || "").toString().trim();
      const msg = (fd.get("msg") || "").toString().trim();

      const clinicKey = localStorage.getItem(STORAGE_KEY) || "lustdorf";
      const clinic = CLINICS[clinicKey] || CLINICS.lustdorf;

      const text =
        `Заявка з сайту EKvilibrium Clinic\n` +
        `Адреса: ${clinic.address}\n` +
        `Імʼя: ${name || "-"}\n` +
        `Телефон: ${phone || "-"}\n` +
        `Повідомлення: ${msg || "-"}\n`;

      const url = `https://t.me/${TG_USERNAME}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    },
    true,
  );
}
