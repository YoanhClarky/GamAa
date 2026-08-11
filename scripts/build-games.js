#!/usr/bin/env node
/*
  Scanne games/<dev>/<jeu>.html, lit <title> et les balises
  <meta name="game:*"> de chaque fichier, et régénère assets/games.js.

  Usage : node scripts/build-games.js
*/
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const gamesDir = path.join(rootDir, 'games');
const outputFile = path.join(rootDir, 'assets', 'games.js');

function getAttr(tag, name) {
  const match = tag.match(new RegExp(name + '\\s*=\\s*["\']([^"\']*)["\']', 'i'));
  return match ? match[1] : null;
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

function main() {
  // Les dossiers préfixés par "_" (ex. _template) sont ignorés : ce ne sont
  // pas de vrais développeurs, juste des modèles à dupliquer.
  const devFolders = fs.readdirSync(gamesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => entry.name)
    .sort();

  const games = [];
  devFolders.forEach((devSlug) => {
    const files = fs.readdirSync(path.join(gamesDir, devSlug))
      .filter((name) => name.endsWith('.html'))
      .sort();
    files.forEach((fileName) => games.push(readGame(devSlug, fileName)));
  });

  const banner =
    '/*\n' +
    '  Registre des jeux gamAa — généré automatiquement par scripts/build-games.js\n' +
    '  à partir des balises <title> et <meta name="game:*"> de chaque fichier sous games/.\n' +
    '  Ne pas modifier ce fichier à la main, il sera écrasé au prochain build.\n' +
    '\n' +
    '  Pour ajouter un jeu : dépose ton fichier dans games/ton-nom/ avec les balises\n' +
    '  <meta name="game:type">, <meta name="game:description">, <meta name="game:dev">\n' +
    '  et <meta name="game:date">, puis lance `node scripts/build-games.js`\n' +
    '  (la CI le fait aussi automatiquement après un merge sur main).\n' +
    '*/\n';

  const output = banner + 'var GAMES = ' + JSON.stringify(games, null, 2) + ';\n';
  fs.writeFileSync(outputFile, output, 'utf8');
  console.log(`assets/games.js régénéré avec ${games.length} jeu(x).`);
}

main();
