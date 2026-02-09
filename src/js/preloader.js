export function initPreloader() {
  const preloader = document.getElementById('preloader');
  const counter = document.getElementById('preloader-count');
  const bar = document.getElementById('preloader-bar');
  if (!preloader || !counter || !bar) return;

  let current = 0;
  const target = 100;
  const duration = 2200;        // total count-up time in ms
  const startTime = Date.now();

  function easeOutExpo(t) {
    return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function tick() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    current = Math.round(easeOutExpo(progress) * target);

    counter.textContent = current;
    bar.style.width = current + '%';

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      // Done – hold for a beat then reveal
      setTimeout(() => {
        preloader.classList.add('done');
        document.body.classList.remove('overflow-hidden');
      }, 300);
    }
  }

  requestAnimationFrame(tick);
}
