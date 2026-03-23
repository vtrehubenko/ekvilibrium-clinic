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
      const pngSrc = data.img || "";
      const webpSrc = pngSrc.replace(/\.(png|jpg|jpeg)$/i, ".webp");
      img.src = pngSrc;
      img.alt = data.name ? `${data.name}` : "";
      img.decoding = "async";
      img.width = 1024;
      img.height = 1536;

      const source = img.parentElement?.querySelector("source[type='image/webp']");
      if (source) {
        source.srcset = webpSrc;
      }
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
