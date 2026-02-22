export function initBookingModal() {
  const modal = document.querySelector("[data-modal]");
  if (!modal) return;

  const openBtns = document.querySelectorAll("[data-open-booking]");
  const closeBtns = modal.querySelectorAll("[data-close-modal]");

  const clinicEl = modal.querySelector("[data-modal-clinic]");
  const addrEl = modal.querySelector("[data-modal-address]");

  function open() {
    if (clinicEl) clinicEl.textContent = "Одеса";

    const address = document
      .querySelector("[data-address]")
      ?.textContent?.trim();

    if (addrEl && address) addrEl.textContent = address;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  close();

  openBtns.forEach((b) => b.addEventListener("click", open));
  closeBtns.forEach((b) => b.addEventListener("click", close));

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });
}
