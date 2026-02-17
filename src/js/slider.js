export function initSlider(rootSelector = "[data-slider]") {
  const root = document.querySelector(rootSelector);
  if (!root) return;

  const track = root.querySelector("[data-track]");
  const prevBtn = root.querySelector("[data-prev]");
  const nextBtn = root.querySelector("[data-next]");
  const dotsWrap = root.querySelector("[data-dots]");
  const slides = Array.from(track.querySelectorAll("img"));

  let index = 0;
  let startX = 0;
  let isDragging = false;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
  }

  function buildDots() {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(b);
    });
  }

  function updateDots() {
    const dots = Array.from(dotsWrap.querySelectorAll("button"));
    dots.forEach((d, i) =>
      d.setAttribute("aria-current", i === index ? "true" : "false"),
    );
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  // swipe
  root.addEventListener("pointerdown", (e) => {
    isDragging = true;
    startX = e.clientX;
    root.setPointerCapture(e.pointerId);
  });

  root.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.clientX - startX;
    const threshold = 50;
    if (dx > threshold) goTo(index - 1);
    if (dx < -threshold) goTo(index + 1);
  });

  buildDots();
  goTo(0);
}
