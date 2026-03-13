/* ==========================================================
   RAD.ISH ENGINEERING — Shared JS
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile Nav ── */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  /* ── Sidebar Topic Switching ── */
  const sideLinks = document.querySelectorAll('.sidebar-link[data-topic]');
  const sections  = document.querySelectorAll('.topic-section');
  sideLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      sideLinks.forEach(l => l.classList.remove('active','active-cars'));
      link.classList.add(link.dataset.accent === 'cars' ? 'active-cars' : 'active');
      const target = link.dataset.topic;
      sections.forEach(s => { s.classList.toggle('active', s.id === target); });
    });
  });

  /* ── URL hash support ── */
  const hash = location.hash.replace('#','');
  if (hash) { const m = document.querySelector(`.sidebar-link[data-topic="${hash}"]`); if (m) m.click(); }
});

/* ── Concept Card Toggle (called from onclick) ── */
function toggleConcept(btn) {
  const content = btn.nextElementSibling;
  const open = btn.classList.contains('open');
  btn.classList.toggle('open', !open);
  content.classList.toggle('open', !open);
  btn.querySelector('.arrow').style.transform = open ? '' : 'rotate(90deg)';
}
