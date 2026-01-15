#!/usr/bin/env node
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Accept common env var names used by CI/CD providers
const npmToken =
  process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN || process.env.GITHUB_TOKEN;

if (!npmToken) {
  console.error('❌ Token de autenticação não encontrado (NPM_TOKEN / NODE_AUTH_TOKEN / GITHUB_TOKEN)');
  process.exit(1);
}

// Create .npmrc with actual token
const npmrcPath = join(projectRoot, '.npmrc');
const npmrcContent = `@igorguariroba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${npmToken}
always-auth=true
`;

try {
  writeFileSync(npmrcPath, npmrcContent, { mode: 0o600 });
  console.log('✅ .npmrc configurado com sucesso');
} catch (error) {
  console.error('❌ Erro ao criar .npmrc:', error.message);
  process.exit(1);
}
