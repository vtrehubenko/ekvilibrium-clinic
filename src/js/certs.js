export function initCertsCarousel() {
  const root = document.querySelector("[data-certs]");
  if (!root) return;

  const viewport = root.querySelector("[data-certs-viewport]");
  const track = root.querySelector("[data-certs-track]");
  const prevBtn = root.querySelector("[data-certs-prev]");
  const nextBtn = root.querySelector("[data-certs-next]");
  const dotsRoot = root.querySelector("[data-certs-dots]");

  if (!viewport || !track) return;

  const TRANSITION = "transform 360ms ease";

  const realSlides = Array.from(track.children);
  const realCount = realSlides.length;
  if (realCount === 0) return;

  track.innerHTML = "";

  const firstClone = realSlides[0].cloneNode(true);
  const lastClone = realSlides[realCount - 1].cloneNode(true);

  firstClone.setAttribute("data-clone", "first");
  lastClone.setAttribute("data-clone", "last");

  track.appendChild(lastClone);
  realSlides.forEach((s) => track.appendChild(s));
  track.appendChild(firstClone);

  track.querySelectorAll("img").forEach((img) => {
    img.loading = "eager";
    img.decoding = "async";
  });

  const slides = Array.from(track.children);

  let index = 1;
  let isAnimating = false;

  function slideWidth() {
    const first = slides[0];
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(track).gap || "0");
    return first.getBoundingClientRect().width + gap;
  }

  function setTransform(withTransition = true) {
    const w = slideWidth();
    track.style.transition = withTransition ? TRANSITION : "none";
    track.style.transform = `translateX(${-index * w}px)`;
  }

  function updateDots() {
    if (!dotsRoot) return;
    const realIndex = (((index - 1) % realCount) + realCount) % realCount;
    dotsRoot.querySelectorAll(".certs__dot").forEach((d, i) => {
      d.classList.toggle("is-active", i === realIndex);
    });
  }

  function lockUI(lock) {
    isAnimating = lock;
    if (prevBtn) prevBtn.disabled = lock;
    if (nextBtn) nextBtn.disabled = lock;
  }

  function goTo(nextIndex) {
    if (isAnimating) return;

    lockUI(true);
    index = nextIndex;

    setTransform(true);

    window.clearTimeout(goTo._t);
    goTo._t = window.setTimeout(() => {
      lockUI(false);
    }, 450);
  }

  if (dotsRoot) {
    dotsRoot.innerHTML = "";
    for (let i = 0; i < realCount; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "certs__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", `Сертифікат ${i + 1}`);
      dot.addEventListener("click", () => {
        if (isAnimating) return;

        goTo(i + 1);
      });
      dotsRoot.appendChild(dot);
    }
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  let startX = 0;
  let dragging = false;

  viewport.addEventListener("pointerdown", (e) => {
    if (isAnimating) return;
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

  track.addEventListener("transitionend", () => {
    if (index === realCount + 1) {
      index = 1;
      setTransform(false);
    }

    if (index === 0) {
      index = realCount;
      setTransform(false);
    }

    updateDots();
    lockUI(false);

    requestAnimationFrame(() => {
      track.style.transition = TRANSITION;
    });
  });

  window.addEventListener("resize", () => {
    setTransform(false);
  });

  setTransform(false);
  updateDots();
}
