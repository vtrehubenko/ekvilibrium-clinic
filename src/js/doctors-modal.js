export function initDoctorsModal() {
  const modal = document.querySelector("[data-doctor-modal]");
  if (!modal) return;

  const closeButtons = modal.querySelectorAll("[data-close-doctor]");
  const img = modal.querySelector("[data-modal-img]");
  const nameEl = modal.querySelector("[data-modal-name]");
  const roleEl = modal.querySelector("[data-modal-role]");
  const expEl = modal.querySelector("[data-modal-exp]");
  const quoteEl = modal.querySelector("[data-modal-quote]");

  function open() {
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function fillFrom(card) {
    const data = card.dataset;

    if (img) {
      img.src = data.img || "";
      img.alt = data.name ? `${data.name}` : "";
    }
    if (nameEl) nameEl.textContent = data.name || "—";
    if (roleEl) roleEl.textContent = data.role || "—";
    if (expEl) expEl.textContent = data.exp || "—";
    if (quoteEl) {
      const q = data.quote || "";
      quoteEl.textContent = q ? `“${q}”` : "";
      quoteEl.style.display = q ? "" : "none";
    }
  }

  document.addEventListener("click", (e) => {
    const card = e.target.closest("[data-doctor]");
    if (!card) return;

    fillFrom(card);
    open();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();

    const active = document.activeElement;
    const isDoctor =
      active && active.matches && active.matches("[data-doctor]");
    if (!isDoctor) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fillFrom(active);
      open();
    }
  });

  closeButtons.forEach((btn) => btn.addEventListener("click", close));
}
