# gamAa

Plateforme communautaire de mini-jeux HTML. Une seule page d'accueil, plusieurs jeux, et n'importe qui peut ajouter le sien.

Toutes les explications détaillées sont sur le site lui-même : [Documentation](documentation.html) et [Contribuer](contribuer.html). Ce README résume juste l'essentiel.

## Ouvrir le site en local

Aucune installation nécessaire : ouvre `index.html` dans un navigateur, ou lance un petit serveur local (ex. `python -m http.server`) pour naviguer plus confortablement.

## Ajouter un jeu (en 5 étapes)

1. **Duplique le dossier modèle** [games/_template/](games/_template/) et renomme la copie avec ton nom, par exemple `games/ton-nom/`.
2. **Renomme le fichier** `mon-jeu.html` dedans avec le nom de ton jeu, puis ouvre-le et modifie :
   - le `<title>` (le nom affiché de ton jeu),
   - les balises `<meta name="game:type">`, `game:description`, `game:dev` et `game:date`,
   - le code du jeu (CSS et JS sont dans le même fichier).
3. **Remplis `profile.json`** dans ce même dossier : ton nom, une courte bio, tes liens (GitHub, site, réseaux). C'est ce qui alimente ta fiche sur la page Communauté du site. Laisse vide ce que tu ne veux pas partager — un champ vide n'est simplement pas affiché.
4. **(Optionnel) Prévisualise en local** avec :
   ```
   node scripts/build-games.js
   ```
   Ça régénère `assets/games.js` sur ta machine pour vérifier que ton jeu et ta fiche apparaissent bien. **Ne commite pas ce fichier** : c'est un registre partagé par tout le monde, généré automatiquement par la CI après le merge — le commiter toi-même provoquerait un conflit avec les autres contributions.
5. **Ouvre une pull request qui ne touche que `games/ton-nom/`**, avec une courte description de ton jeu.

Le dossier `games/_template/` (et tout dossier commençant par `_`) est ignoré par le script : ce n'est qu'un modèle, jamais un vrai jeu affiché.

> Pourquoi c'est important à grande échelle : si des centaines de contributeurs committaient chacun `assets/games.js`, ce fichier deviendrait un point de conflit permanent. En le laissant uniquement à la CI, chaque PR ne touche que son propre dossier et ne peut jamais entrer en conflit avec une autre.

## Structure du repo

```
gamAa/
├── index.html, apropos.html, ...   pages du site
├── assets/
│   ├── site.css                    design système commun (header, boutons, cartes)
│   ├── header.js                   composant d'en-tête, une seule copie pour tout le site
│   └── games.js                    registre des jeux, généré — ne pas éditer à la main
├── scripts/build-games.js          lit games/ et régénère assets/games.js
├── .github/workflows/
│   ├── build-games.yml             régénère assets/games.js après chaque push sur main
│   └── no-games-js-in-pr.yml       rejette une PR qui toucherait assets/games.js
└── games/
    ├── _template/                  modèle à dupliquer (mon-jeu.html + profile.json)
    └── ton-nom/                    un dossier par développeur : ton/tes jeu(x) + profile.json
```

## Règles de style

- Palette : navy `#1c2b39` et ambre `#f4b400`.
- Design flat, pas d'emoji, pas de framework.
- Un jeu = un fichier HTML autonome (CSS et JS inclus), adapté au mobile.

Voir [Documentation](documentation.html) pour le détail complet.

## Licence

Ce projet est sous licence [GPL-3.0](LICENSE). Concrètement : n'importe qui peut utiliser, copier et modifier le code, mais toute version redistribuée (modifiée ou non) doit rester open-source sous cette même licence — personne ne peut forker gamAa pour en faire un produit fermé ou propriétaire. En ouvrant une pull request, tu acceptes que ta contribution (jeu, code, documentation) soit publiée sous cette même licence.
