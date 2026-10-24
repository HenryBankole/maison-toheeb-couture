import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, '..');

async function initRepo() {
  console.log('Initializing git repository...');
  await git.init({ fs, dir });

  console.log('Adding files...');
  // We can add all tracked files
  const files = [
    'package.json',
    'package-lock.json',
    'render.yaml',
    '.gitignore',
    'vite.config.js',
    'index.html',
    'tailwind.config.js',
    'postcss.config.js'
  ];

  // Helper to walk dir
  function getFiles(currentDir, relativePrefix = '') {
    const list = fs.readdirSync(currentDir);
    let results = [];
    for (const item of list) {
      if (item === 'node_modules' || item === '.git' || item === 'dist') continue;
      const fullPath = path.join(currentDir, item);
      const relPath = path.join(relativePrefix, item).replace(/\\/g, '/');
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        results = results.concat(getFiles(fullPath, relPath));
      } else {
        results.push(relPath);
      }
    }
    return results;
  }

  const allFiles = getFiles(dir);
  console.log(`Found ${allFiles.length} files to commit.`);

  for (const f of allFiles) {
    await git.add({ fs, dir, filepath: f });
  }

  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Maison Toheeb',
      email: 'contact@toheeb-couture.com'
    },
    message: 'Initial commit: Maison Toheeb Bespoke Atelier web app'
  });

  console.log('Commit created successfully! SHA:', sha);
}

initRepo().catch(console.error);
