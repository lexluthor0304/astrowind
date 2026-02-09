import './style.css';
import AOS from 'aos';
import { initParticles } from './js/particles.js';
import { initCounters } from './js/counter.js';
import { initAccordion } from './js/accordion.js';
import { initNav } from './js/nav.js';
import { initPreloader } from './js/preloader.js';

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  AOS.init({ duration: 800, once: true });
  initParticles();
  initCounters();
  initAccordion();
  initNav();
});
