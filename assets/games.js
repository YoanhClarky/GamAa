/*
  Registre des jeux et des contributeurs gamAa — généré automatiquement par
  scripts/build-games.js à partir des fichiers sous games/ :
  - GAMES vient des balises <title> et <meta name="game:*"> de chaque jeu.
  - CONTRIBUTORS vient de games/<dev>/profile.json (name, bio, links).
  Ne pas modifier ce fichier à la main, il sera écrasé au prochain build.

  Pour ajouter un jeu : dépose ton fichier dans games/ton-nom/ avec les balises
  <meta name="game:type">, <meta name="game:description">, <meta name="game:dev">
  et <meta name="game:date">, ajoute un profile.json si tu veux, puis lance
  `node scripts/build-games.js` (la CI le fait aussi automatiquement après un
  merge sur main).
*/
var GAMES = [
  {
    "title": "Corporate Dodger",
    "type": "Arcade",
    "description": "Esquive les obstacles et reste concentré.",
    "dev": "Yoanh Mantele",
    "date": "11/08/2026",
    "href": "games/yoanh-mantele/corporate-dodger.html"
  },
  {
    "title": "En Route pour le Boulot",
    "type": "Course",
    "description": "Un parcours rapide à travers les contraintes du quotidien.",
    "dev": "Yoanh Mantele",
    "date": "12/08/2026",
    "href": "games/yoanh-mantele/en-route-boulot-libre.html"
  },
  {
    "title": "Le Délestage",
    "type": "Réflexe",
    "description": "Réagis vite et active les bonnes cases.",
    "dev": "Yoanh Mantele",
    "date": "11/08/2026",
    "href": "games/yoanh-mantele/le-delestage-whack.html"
  },
  {
    "title": "Reproduis la Forme",
    "type": "Mémoire",
    "description": "Reconstitue la forme à partir de la mémoire visuelle.",
    "dev": "Yoanh Mantele",
    "date": "11/08/2026",
    "href": "games/yoanh-mantele/reproduis-la-forme.html"
  },
  {
    "title": "Vise 100",
    "type": "Réflexe",
    "description": "Arrête le chrono le plus près possible de 100.",
    "dev": "Yoanh Mantele",
    "date": "12/08/2026",
    "href": "games/yoanh-mantele/vise-100.html"
  }
];

var CONTRIBUTORS = [
  {
    "slug": "yoanh-mantele",
    "name": "Yoanh Mantele",
    "bio": "Full-Stack Developer building products, SaaS and developer tools. Curious about AI, software architecture and new technologies.",
    "links": {
      "github": "https://github.com/YoanhClarky",
      "site": "https://mcd-creator.com",
      "twitter": "",
      "linkedin": "https://www.linkedin.com/in/yoanh-mantele-594a0527a/"
    },
    "games": [
      "Corporate Dodger",
      "En Route pour le Boulot",
      "Le Délestage",
      "Reproduis la Forme",
      "Vise 100"
    ]
  }
];
