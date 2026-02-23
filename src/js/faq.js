export function initFaq() {
  const root = document.querySelector("[data-faq]");
  if (!root) return;

  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-faq-btn]");
    if (!btn) return;

    const item = btn.closest(".faq__item");
    if (!item) return;

    root.querySelectorAll(".faq__item").forEach((el) => {
      if (el !== item) {
        el.classList.remove("is-open");
        const b = el.querySelector("[data-faq-btn]");
        const p = el.querySelector("[data-faq-panel]");
        if (b) b.setAttribute("aria-expanded", "false");
        if (p) p.setAttribute("aria-hidden", "true");
      }
    });

    const isOpen = item.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(isOpen));

    const panel = item.querySelector("[data-faq-panel]");
    if (panel) panel.setAttribute("aria-hidden", String(!isOpen));
  });
}
