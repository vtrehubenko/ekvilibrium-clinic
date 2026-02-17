import "./styles/main.css";
import { initSlider } from "./js/slider.js";
import { initNav } from "./js/nav.js";
import { initReveal } from "./js/reveal.js";
import { initTelegramForm } from "./js/telegram.js";
import { initClinicDropdown } from "./js/clinic.js";

initNav();
initReveal();
initSlider("[data-slider]");
initTelegramForm();
initClinicDropdown();
