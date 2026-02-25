export function initSlider(rootSelector = "[data-slider]") {
  const roots = Array.from(document.querySelectorAll(rootSelector));
  if (!roots.length) return;

  roots.forEach((root) => {
    const track = root.querySelector("[data-track]");
    const prevBtn = root.querySelector("[data-prev]");
    const nextBtn = root.querySelector("[data-next]");
    const dotsWrap = root.querySelector("[data-dots]");
    if (!track || !dotsWrap) return;

    let slides = [];
    let index = 0;

    let startX = 0;
    let lastX = 0;
    let isDragging = false;

    function updateDots() {
      const dots = Array.from(dotsWrap.querySelectorAll("button"));
      dots.forEach((d, i) =>
        d.setAttribute("aria-current", i === index ? "true" : "false"),
      );
    }

    function goTo(i) {
      if (!slides.length) return;
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

    function refresh() {
      slides = Array.from(track.querySelectorAll("img"));
      index = 0;
      track.style.transform = `translateX(0%)`;
      buildDots();
      updateDots();
    }

    root._sliderRefresh = refresh;

    prevBtn?.addEventListener("click", () => goTo(index - 1));
    nextBtn?.addEventListener("click", () => goTo(index + 1));

    root.addEventListener("pointerdown", (e) => {
      isDragging = true;
      startX = lastX = e.clientX;
      root.setPointerCapture(e.pointerId);
    });

    root.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      lastX = e.clientX;
    });

    root.addEventListener("pointerup", () => {
      if (!isDragging) return;
      isDragging = false;

      const dx = lastX - startX;
      const threshold = 50;
      if (dx > threshold) goTo(index - 1);
      if (dx < -threshold) goTo(index + 1);
    });

    root.addEventListener("pointercancel", () => {
      isDragging = false;
    });

    refresh();
  });
}
