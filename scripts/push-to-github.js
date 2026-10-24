import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, '..');

const repoUrl = process.argv[2];
const token = process.argv[3];

async function push() {
  if (!repoUrl || !token) {
    console.log('Usage: node scripts/push-to-github.js <github-repo-url> <personal-access-token>');
    console.log('Exemple: node scripts/push-to-github.js https://github.com/mon-compte/maison-toheeb ghp_xxxxxxxxxxxx');
    return;
  }

  console.log(`Pushing to ${repoUrl}...`);
  try {
    const res = await git.push({
      fs,
      http,
      dir,
      url: repoUrl,
      remoteRef: 'refs/heads/main',
      force: true,
      onAuth: () => ({ username: token })
    });
    console.log('✅ Push réussi avec succès !', res);
  } catch (err) {
    console.error('❌ Erreur lors du push :', err.message);
  }
}

push();
