export function initReveal() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) en.target.classList.add("is-visible");
      });
    },
    { threshold: 0.12 },
  );

  els.forEach((el) => io.observe(el));
}
