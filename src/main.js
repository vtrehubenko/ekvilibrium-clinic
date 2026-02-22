import "./styles/main.css";

import { initSlider } from "./js/slider.js";
import { initNav } from "./js/nav.js";
import { initReveal } from "./js/reveal.js";
import { initClinicDropdown } from "./js/clinic.js";
import { initContactForm } from "./js/contact.js";
import { initBookingModal } from "./js/modal.js";
import { initHeroAnimation } from "./js/hero-animation.js";
import { initClinicGallery } from "./js/clinic-gallery.js";

initNav();
initReveal();
initSlider("[data-slider]");
initClinicDropdown();
initContactForm();
initBookingModal();
initHeroAnimation();
initClinicGallery();
