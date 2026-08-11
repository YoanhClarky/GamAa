/*
  Composant d'en-tête unique du site gamAa.
  Chaque page pose un <div id="site-header"></div> à l'endroit voulu et
  inclut ce script juste après : le lien actif est déterminé automatiquement,
  aucune duplication de markup entre les pages.
*/
(function () {
  var NAV_LINKS = [
    { href: 'index.html', label: 'Accueil' },
    { href: 'apropos.html', label: 'À propos' },
    { href: 'contribuer.html', label: 'Contribuer' },
    { href: 'documentation.html', label: 'Documentation' },
    { href: 'roadmap.html', label: 'Roadmap' },
    { href: 'communaute.html', label: 'Communauté' }
  ];

  function currentPage() {
    var path = window.location.pathname.split('/').pop();
    return path === '' ? 'index.html' : path;
  }

  var mount = document.getElementById('site-header');
  if (!mount) return;

  var page = currentPage();
  var navHtml = NAV_LINKS.map(function (link) {
    var activeClass = link.href === page ? ' class="active"' : '';
    return '<a' + activeClass + ' href="' + link.href + '">' + link.label + '</a>';
  }).join('');

  mount.innerHTML =
    '<div class="topbar">' +
      '<header>' +
        '<div class="brand-row">' +
          '<div class="brand-logo"><img src="assets/logo.png" alt="gamAa logo" /></div>' +
        '</div>' +
        '<nav>' + navHtml + '</nav>' +
      '</header>' +
    '</div>';
})();
