export function initNav() {
  const nav = document.querySelector("[data-nav]");
  const burger = document.querySelector("[data-burger]");
  if (!nav || !burger) return;

  burger.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });

  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    nav.classList.remove("is-open");
  });
}
