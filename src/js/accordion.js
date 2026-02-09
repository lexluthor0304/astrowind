export function initAccordion() {
  // Desktop: hover to switch panels
  const items = document.querySelectorAll('.service-item');
  const panels = document.querySelectorAll('.service-panel');

  if (!items.length) return;

  // Desktop hover
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth < 1280) return; // xl breakpoint
      const target = item.dataset.target;
      items.forEach(i => i.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      item.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  // Mobile: click to toggle accordion
  items.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth >= 1280) return;
      const content = item.querySelector('.accordion-content');
      if (!content) return;

      const isExpanded = content.classList.contains('expanded');

      // Close all
      items.forEach(i => {
        i.classList.remove('active');
        const c = i.querySelector('.accordion-content');
        if (c) c.classList.remove('expanded');
      });

      // Toggle current
      if (!isExpanded) {
        item.classList.add('active');
        content.classList.add('expanded');
      }
    });
  });
}
