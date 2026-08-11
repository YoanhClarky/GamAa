# gamAa

Plateforme communautaire de mini-jeux HTML. Une seule page d'accueil, plusieurs jeux, et n'importe qui peut ajouter le sien.

Toutes les explications détaillées sont sur le site lui-même : [Documentation](documentation.html) et [Contribuer](contribuer.html). Ce README résume juste l'essentiel.

## Ouvrir le site en local

Aucune installation nécessaire : ouvre `index.html` dans un navigateur, ou lance un petit serveur local (ex. `python -m http.server`) pour naviguer plus confortablement.

## Ajouter un jeu (en 4 étapes)

1. **Duplique le dossier modèle** [games/_template/](games/_template/) et renomme la copie avec ton nom, par exemple `games/ton-nom/`.
2. **Renomme le fichier** `mon-jeu.html` dedans avec le nom de ton jeu, puis ouvre-le et modifie :
   - le `<title>` (le nom affiché de ton jeu),
   - les balises `<meta name="game:type">`, `game:description`, `game:dev` et `game:date`,
   - le code du jeu (CSS et JS sont dans le même fichier).
3. **Régénère la liste des jeux** avec :
   ```
   node scripts/build-games.js
   ```
   Ça met à jour `assets/games.js`, qui fait apparaître ton jeu sur l'accueil et sur la page Communauté. Si tu oublies cette étape, la CI GitHub Actions s'en charge automatiquement après le merge de ta pull request.
4. **Ouvre une pull request** avec une courte description de ton jeu.

Le dossier `games/_template/` (et tout dossier commençant par `_`) est ignoré par le script : ce n'est qu'un modèle, jamais un vrai jeu affiché.

## Structure du repo

```
gamAa/
├── index.html, apropos.html, ...   pages du site
├── assets/
│   ├── site.css                    design système commun (header, boutons, cartes)
│   ├── header.js                   composant d'en-tête, une seule copie pour tout le site
│   └── games.js                    registre des jeux, généré — ne pas éditer à la main
├── scripts/build-games.js          lit games/ et régénère assets/games.js
├── .github/workflows/build-games.yml   relance le script après chaque push sur main
└── games/
    ├── _template/                  modèle à dupliquer
    └── ton-nom/                    un dossier par développeur, un fichier HTML par jeu
```

## Règles de style

- Palette : navy `#1c2b39` et ambre `#f4b400`.
- Design flat, pas d'emoji, pas de framework.
- Un jeu = un fichier HTML autonome (CSS et JS inclus), adapté au mobile.

Voir [Documentation](documentation.html) pour le détail complet.
