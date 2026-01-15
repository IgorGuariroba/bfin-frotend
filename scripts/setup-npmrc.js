#!/usr/bin/env node
import { writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Accept common env var names used by CI/CD providers.
// - Render/GitHub Actions often use NODE_AUTH_TOKEN
// - Some setups use GITHUB_TOKEN for GitHub Packages auth
const npmToken =
  process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN || process.env.GITHUB_TOKEN;

if (npmToken) {
  const npmrcContent = `@igorguariroba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${npmToken}
always-auth=true
`;
  const npmrcPath = join(projectRoot, '.npmrc');

  try {
    writeFileSync(npmrcPath, npmrcContent);
    console.log('✅ Arquivo .npmrc criado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar .npmrc:', error.message);
    process.exit(1);
  }
} else {
  console.warn(
    '⚠️  Token de autenticação não encontrado (NPM_TOKEN / NODE_AUTH_TOKEN / GITHUB_TOKEN). Pulando criação do .npmrc'
  );
  if (existsSync(join(projectRoot, '.npmrc'))) {
    console.log('ℹ️  Usando .npmrc existente');
  }
}
