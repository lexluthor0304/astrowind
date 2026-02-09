export function initNav() {
  const burger = document.getElementById('burger');
  const closeBtn = document.getElementById('closeMenu');
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');

  if (!burger || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    overlay?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    overlay?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1280) closeMenu();
  });
}
