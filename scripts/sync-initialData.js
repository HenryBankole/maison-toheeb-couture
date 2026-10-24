import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'server', 'data', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const initialDataPath = path.join(__dirname, '..', 'server', 'data', 'initialData.js');

const exportContent = `export const initialData = ${JSON.stringify(db, null, 2)};\n`;
fs.writeFileSync(initialDataPath, exportContent, 'utf8');

console.log('initialData.js successfully synced with offline local assets!');
