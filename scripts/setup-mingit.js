import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { pipeline } from 'stream/promises';

const MINGIT_URL = 'https://github.com/git-for-windows/git/releases/download/v2.56.0.windows.3/MinGit-2.56.0.3-64-bit.zip';
const targetDir = path.join(os.homedir(), 'AppData', 'Local', 'MinGit');
const zipPath = path.join(os.tmpdir(), 'MinGit.zip');

async function main() {
  if (fs.existsSync(path.join(targetDir, 'cmd', 'git.exe'))) {
    console.log('MinGit already exists at:', targetDir);
    return;
  }

  console.log('Downloading MinGit portable (official lightweight Git for Windows)...');
  const res = await fetch(MINGIT_URL);
  if (!res.ok) throw new Error(`Download failed: ${res.statusText}`);

  const fileStream = fs.createWriteStream(zipPath);
  await pipeline(res.body, fileStream);
  console.log('MinGit downloaded. Extracting...');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  execSync(`powershell -command "Expand-Archive -Path '${zipPath}' -DestinationPath '${targetDir}' -Force"`);
  console.log('Extraction complete! Git binary available at:', path.join(targetDir, 'cmd', 'git.exe'));

  try { fs.unlinkSync(zipPath); } catch {}
}

main().catch(console.error);
