import { execSync } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const gitCmd = path.join(os.homedir(), 'AppData', 'Local', 'MinGit', 'cmd', 'git.exe');
const token = process.argv[2];

if (!token) {
  console.error('Usage: node scripts/git-push.js <token>');
  process.exit(1);
}

const remoteUrl = `https://x-access-token:${token}@github.com/HenryBankole/maison-toheeb-couture.git`;

function runGit(args) {
  console.log(`> git ${args}`);
  return execSync(`"${gitCmd}" ${args}`, {
    cwd: rootDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      PATH: `${path.dirname(gitCmd)};${process.env.PATH}`
    }
  });
}

try {
  runGit('config user.name "HenryBankole"');
  runGit('config user.email "contact@toheeb-couture.com"');

  // Check remote
  try {
    runGit('remote remove origin');
  } catch {}

  runGit(`remote add origin "${remoteUrl}"`);
  runGit('add -A');

  try {
    runGit('commit -m "Initial release: Maison Toheeb Bespoke Atelier complete application"');
  } catch (e) {
    console.log('No new changes to commit or commit already exists.');
  }

  runGit('branch -M main');
  console.log('Pushing to GitHub repository...');
  runGit('push -u origin main --force');

  console.log('\n======================================================');
  console.log('🎉 TOUS LES FICHIERS ONT ÉTÉ ENVOYÉS AVEC SUCCÈS SUR GITHUB !');
  console.log('URL: https://github.com/HenryBankole/maison-toheeb-couture');
  console.log('======================================================\n');
} catch (err) {
  console.error('Git error:', err.message);
  process.exit(1);
}
