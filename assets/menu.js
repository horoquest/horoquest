// HOROQUEST | menu mobile (burger)
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  var burger = header.querySelector('.burger');
  var menu = header.querySelector('.mobile-menu');
  if (!burger || !menu) return;

  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-controls', menu.id || 'mobileMenu');

  function close() {
    header.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
  }
  function toggle() {
    var open = header.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  burger.addEventListener('click', function (e) {
    e.stopPropagation();
    toggle();
  });
  // fermer en cliquant un lien du menu
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) close();
  });
  // fermer en cliquant en dehors
  document.addEventListener('click', function (e) {
    if (header.classList.contains('menu-open') && !header.contains(e.target)) close();
  });
  // fermer avec Echap
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
