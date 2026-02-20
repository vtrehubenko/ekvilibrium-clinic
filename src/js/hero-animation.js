import { gsap } from "gsap";

export function initHeroAnimation() {
  const mark = document.querySelector("#logoMark");
  const circle = document.querySelector("#logoCircle");
  const tooth = document.querySelector("#tooth");
  const sparkle = document.querySelector("#toothSparkle");

  if (!mark || !circle || !tooth) return;

  const length = circle.getTotalLength();
  circle.style.strokeDasharray = length;
  circle.style.strokeDashoffset = length;

  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  tl.from(mark, {
    opacity: 0,
    scale: 0.95,
    duration: 0.6,
  });

  tl.to(
    circle,
    {
      strokeDashoffset: 0,
      duration: 0.9,
    },
    "-=0.4",
  );

  tl.to(
    tooth,
    {
      scale: 1.03,
      transformOrigin: "50% 50%",
      duration: 0.25,
      yoyo: true,
      repeat: 1,
    },
    "-=0.2",
  );

  if (sparkle) {
    tl.to(sparkle, {
      opacity: 1,
      scale: 1.8,
      transformOrigin: "center",
      duration: 0.25,
      ease: "power1.out",
    }).to(sparkle, {
      opacity: 0,
      scale: 0.5,
      duration: 0.35,
      ease: "power1.in",
    });
  }
}
