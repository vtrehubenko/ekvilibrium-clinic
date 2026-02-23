export function initCertsCarousel() {
  const root = document.querySelector("[data-certs]");
  if (!root) return;

  const viewport = root.querySelector("[data-certs-viewport]");
  const track = root.querySelector("[data-certs-track]");
  const prevBtn = root.querySelector("[data-certs-prev]");
  const nextBtn = root.querySelector("[data-certs-next]");
  const dotsRoot = root.querySelector("[data-certs-dots]");

  if (!viewport || !track) return;

  const slides = Array.from(track.children);
  let index = 0;

  function slideWidth() {
    const first = slides[0];
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(track).gap || "0");
    return first.getBoundingClientRect().width + gap;
  }

  function update() {
    const w = slideWidth();
    track.style.transform = `translateX(${-index * w}px)`;

    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= slides.length - 1;

    if (dotsRoot) {
      dotsRoot.querySelectorAll(".certs__dot").forEach((d, i) => {
        d.classList.toggle("is-active", i === index);
      });
    }
  }

  function goTo(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    update();
  }

  // dots
  if (dotsRoot) {
    dotsRoot.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "certs__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", `Сертифікат ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsRoot.appendChild(dot);
    });
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  // swipe
  let startX = 0;
  let dragging = false;

  viewport.addEventListener("pointerdown", (e) => {
    dragging = true;
    startX = e.clientX;
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;

    const dx = e.clientX - startX;
    const threshold = 40;

    if (dx > threshold) goTo(index - 1);
    else if (dx < -threshold) goTo(index + 1);
  });

  viewport.addEventListener("pointercancel", () => {
    dragging = false;
  });

  window.addEventListener("resize", () => update());

  update();
}
