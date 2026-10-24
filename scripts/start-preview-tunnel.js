import { spawn } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLOUDFLARED_BIN = path.join(os.tmpdir(), 'node-untun', 'cloudflared.2026.7.2.exe');
const DB_PATH = path.join(__dirname, '..', 'server', 'data', 'database.json');
const PREVIEW_FILE = path.join(__dirname, '..', 'preview-url.txt');

let activeTunnelChild = null;
let currentUrl = '';
let backupUrl = '';

function updateStoredUrl(url) {
  currentUrl = url;
  try {
    fs.writeFileSync(PREVIEW_FILE, `PRIMARY: ${url}\nBACKUP: ${backupUrl}\n`, 'utf8');
    if (fs.existsSync(DB_PATH)) {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
      db.settings = db.settings || {};
      db.settings.previewUrl = url;
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    }
  } catch (e) {
    console.error('Error saving preview url:', e.message);
  }
}

async function verifyUrl(url, maxAttempts = 15) {
  console.log(`[Verification] Checking connectivity for: ${url} ...`);
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (res.status === 200) {
        console.log(`✅ [Verification] Connecté avec succès ! HTTP ${res.status} OK`);
        return true;
      }
      console.log(`[Verification] Tentative ${i}: HTTP ${res.status}, nouvel essai dans 2s...`);
    } catch (err) {
      console.log(`[Verification] Tentative ${i}: attente du serveur (${err.message})...`);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  return false;
}

async function startLocaltunnelBackup() {
  try {
    const localtunnel = (await import('localtunnel')).default;
    const lt = await localtunnel({
      port: 5000,
      subdomain: 'maison-toheeb-couture-' + Math.floor(Math.random() * 899 + 100)
    });
    backupUrl = lt.url;
    console.log('\n======================================================');
    console.log('🔗 LIEN DE SECOURS (Localtunnel) :');
    console.log(backupUrl);
    console.log('======================================================\n');
    updateStoredUrl(currentUrl || backupUrl);
    lt.on('close', () => {
      console.log('[Localtunnel] Fermé, redémarrage...');
      setTimeout(startLocaltunnelBackup, 5000);
    });
    lt.on('error', (e) => {
      console.error('[Localtunnel] Erreur:', e.message);
    });
  } catch (err) {
    console.error('[Localtunnel] Impossible de démarrer le lien de secours:', err.message);
  }
}

function startCloudflareTunnel() {
  console.log('[Cloudflare] Démarrage du tunnel avec le protocole HTTP/2 sur TCP 443...');

  if (!fs.existsSync(CLOUDFLARED_BIN)) {
    console.error('Binaire cloudflared non trouvé à:', CLOUDFLARED_BIN);
    return;
  }

  const child = spawn(
    CLOUDFLARED_BIN,
    ['tunnel', '--url', 'http://127.0.0.1:5000', '--protocol', 'http2'],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );
  activeTunnelChild = child;

  let urlDetected = false;

  const handleOutput = async (data) => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match && !urlDetected) {
      urlDetected = true;
      const detectedUrl = match[0];
      console.log('\n======================================================');
      console.log('🎉 LIEN PRINCIPAL CLOUDFLARE EN DIRECT :');
      console.log(detectedUrl);
      console.log('======================================================\n');

      updateStoredUrl(detectedUrl);

      const isWorking = await verifyUrl(detectedUrl);
      if (isWorking) {
        console.log(`\n🚀 LIEN CLIENT OPÉRATIONNEL À 100% : ${detectedUrl}\n`);
      }
    }
  };

  child.stdout.on('data', handleOutput);
  child.stderr.on('data', handleOutput);

  child.on('exit', (code, signal) => {
    console.log(`[Cloudflare] Processus arrêté (${code}, ${signal}). Redémarrage dans 5s...`);
    activeTunnelChild = null;
    setTimeout(() => {
      startCloudflareTunnel();
    }, 5000);
  });

  child.on('error', (err) => {
    console.error('[Cloudflare] Erreur d\'exécution:', err.message);
  });
}

// Keep-alive check every 25 seconds
setInterval(async () => {
  if (currentUrl) {
    try {
      const res = await fetch(currentUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (res.status !== 200) {
        console.warn(`[Keep-Alive] Statut HTTP ${res.status}`);
      }
    } catch (e) {
      console.warn('[Keep-Alive] Erreur temporaire:', e.message);
    }
  }
}, 25000);

startCloudflareTunnel();
startLocaltunnelBackup();
