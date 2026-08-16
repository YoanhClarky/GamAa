#!/usr/bin/env node
/*
  Scanne games/<dev>/<jeu>.html, lit <title> et les balises <meta name="game:*">
  de chaque fichier, lit aussi games/<dev>/profile.json si présent, et régénère
  assets/games.js (GAMES + CONTRIBUTORS).

  Usage : node scripts/build-games.js
*/
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const gamesDir = path.join(rootDir, 'games');
const outputFile = path.join(rootDir, 'assets', 'games.js');

function getAttr(tag, name) {
  // On capture séparément la variante entre guillemets doubles et celle entre
  // apostrophes, pour qu'une apostrophe (fréquente en français, ex. "l'écran")
  // ne soit pas prise à tort pour la fin d'une valeur entre guillemets doubles.
  const match = tag.match(new RegExp(name + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\')', 'i'));
  if (!match) return null;
  return match[1] !== undefined ? match[1] : match[2];
}

function readGame(devSlug, fileName) {
  const filePath = path.join(gamesDir, devSlug, fileName);
  const html = fs.readFileSync(filePath, 'utf8');

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : fileName;

  const meta = {};
  const metaTags = html.match(/<meta\s+[^>]*>/gi) || [];
  metaTags.forEach((tag) => {
    const name = getAttr(tag, 'name');
    if (!name || !name.startsWith('game:')) return;
    const key = name.slice('game:'.length);
    meta[key] = getAttr(tag, 'content') || '';
  });

  return {
    title,
    type: meta.type || '',
    description: meta.description || '',
    dev: meta.dev || '',
    date: meta.date || '',
    href: `games/${devSlug}/${fileName}`.replace(/\\/g, '/')
  };
}

function normalizeUrl(url) {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function readProfile(devSlug) {
  const profilePath = path.join(gamesDir, devSlug, 'profile.json');
  if (!fs.existsSync(profilePath)) return null;

  try {
    const data = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    const links = data.links || {};
    return {
      name: data.name || '',
      bio: data.bio || '',
      links: {
        github: normalizeUrl(links.github),
        site: normalizeUrl(links.site),
        twitter: normalizeUrl(links.twitter),
        linkedin: normalizeUrl(links.linkedin)
      }
    };
  } catch (err) {
    console.warn(`profile.json invalide pour games/${devSlug}/ : ${err.message}`);
    return null;
  }
}

function main() {
  // Les dossiers préfixés par "_" (ex. _template) sont ignorés : ce ne sont
  // pas de vrais développeurs, juste des modèles à dupliquer.
  const devFolders = fs.readdirSync(gamesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => entry.name)
    .sort();

  const games = [];
  const contributors = [];

  devFolders.forEach((devSlug) => {
    const files = fs.readdirSync(path.join(gamesDir, devSlug))
      .filter((name) => name.endsWith('.html'))
      .sort();
    if (files.length === 0) return;

    const devGames = files.map((fileName) => readGame(devSlug, fileName));
    games.push(...devGames);

    const profile = readProfile(devSlug);
    contributors.push({
      slug: devSlug,
      name: (profile && profile.name) || devGames[0].dev || devSlug,
      bio: (profile && profile.bio) || '',
      links: (profile && profile.links) || { github: '', site: '', twitter: '', linkedin: '' },
      games: devGames.map((g) => g.title)
    });
  });

  const banner =
    '/*\n' +
    '  Registre des jeux et des contributeurs gamAa — généré automatiquement par\n' +
    '  scripts/build-games.js à partir des fichiers sous games/ :\n' +
    '  - GAMES vient des balises <title> et <meta name="game:*"> de chaque jeu.\n' +
    '  - CONTRIBUTORS vient de games/<dev>/profile.json (name, bio, links).\n' +
    '  Ne pas modifier ce fichier à la main, il sera écrasé au prochain build.\n' +
    '\n' +
    '  Pour ajouter un jeu : dépose ton fichier dans games/ton-nom/ avec les balises\n' +
    '  <meta name="game:type">, <meta name="game:description">, <meta name="game:dev">\n' +
    '  et <meta name="game:date">, ajoute un profile.json si tu veux, puis lance\n' +
    '  `node scripts/build-games.js` (la CI le fait aussi automatiquement après un\n' +
    '  merge sur main).\n' +
    '*/\n';

  const output =
    banner +
    'var GAMES = ' + JSON.stringify(games, null, 2) + ';\n\n' +
    'var CONTRIBUTORS = ' + JSON.stringify(contributors, null, 2) + ';\n';

  fs.writeFileSync(outputFile, output, 'utf8');
  console.log(`assets/games.js régénéré avec ${games.length} jeu(x) et ${contributors.length} contributeur(s).`);
}

main();
