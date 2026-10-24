import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, '..');

const token = process.argv[2];
let repoName = process.argv[3] || 'maison-toheeb-couture';

async function main() {
  if (!token) {
    console.error('Erreur: Aucun token fourni. Usage: node scripts/deploy-to-github.js <token> [nom-du-repo]');
    process.exit(1);
  }

  console.log('1. Vérification de l\'authentification GitHub...');
  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'Antigravity-Deployment',
      'Accept': 'application/vnd.github+json'
    }
  });

  if (!userRes.ok) {
    const errData = await userRes.json();
    console.error('❌ Échec d\'authentification GitHub:', errData.message);
    process.exit(1);
  }

  const user = await userRes.json();
  const username = user.login;
  console.log(`✅ Authentifié avec succès en tant que : ${username} (${user.name || username})`);

  console.log(`\n2. Vérification / Création du dépôt "${repoName}" sur GitHub...`);
  let repoUrl = `https://github.com/${username}/${repoName}`;

  const checkRepoRes = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'Antigravity-Deployment',
      'Accept': 'application/vnd.github+json'
    }
  });

  if (checkRepoRes.status === 404) {
    console.log(`Création du nouveau dépôt public "${repoName}"...`);
    const createRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Antigravity-Deployment',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: repoName,
        description: 'Maison Toheeb - Atelier Haute Couture & Prêt-à-Porter Web Application',
        private: false,
        auto_init: false
      })
    });

    if (!createRes.ok) {
      const createErr = await createRes.json();
      console.error('❌ Impossible de créer le dépôt:', createErr.message);
      process.exit(1);
    }
    const createdRepo = await createRes.json();
    repoUrl = createdRepo.html_url;
    console.log(`✅ Dépôt GitHub créé : ${repoUrl}`);
  } else if (checkRepoRes.ok) {
    console.log(`✅ Dépôt existant trouvé : ${repoUrl}`);
  }

  console.log('\n3. Préparation et validation des fichiers du projet...');
  // Ensure repo is committed
  const headSha = await git.resolveRef({ fs, dir, ref: 'HEAD' });
  console.log(`Dernier commit : ${headSha}`);

  console.log(`\n4. Téléversement (git push) du projet vers ${repoUrl}...`);
  try {
    const pushResult = await git.push({
      fs,
      http,
      dir,
      url: repoUrl,
      remoteRef: 'refs/heads/main',
      force: true,
      onAuth: () => ({ username: token })
    });
    console.log('======================================================');
    console.log('🎉 PROJET ENVOYÉ SUR GITHUB AVEC SUCCÈS !');
    console.log(`URL DU DÉPÔT : ${repoUrl}`);
    console.log('======================================================');
  } catch (pushErr) {
    console.error('❌ Erreur lors du push :', pushErr.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Erreur inattendue:', err);
  process.exit(1);
});
