#!/usr/bin/env node
import { writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Accept common env var names used by CI/CD providers
const npmToken =
  process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN || process.env.GITHUB_TOKEN;

const npmrcPath = join(projectRoot, '.npmrc');
const npmrcExists = existsSync(npmrcPath);

// Detect CI/CD environment
const isCI = !!(
  process.env.CI ||
  process.env.RENDER ||
  process.env.GITHUB_ACTIONS ||
  process.env.GITLAB_CI ||
  process.env.JENKINS_URL ||
  process.env.TRAVIS
);

// Always log for debugging (especially important in CI/CD)
console.log('[setup-npmrc] Script iniciado');
if (isCI) {
  console.log('[setup-npmrc] Ambiente CI/CD detectado');
}
console.log(`[setup-npmrc] Token disponível: ${npmToken ? 'Sim' : 'Não'}`);
console.log(`[setup-npmrc] .npmrc existe: ${npmrcExists ? 'Sim' : 'Não'}`);
console.log(`[setup-npmrc] Project root: ${projectRoot}`);
console.log(`[setup-npmrc] .npmrc path: ${npmrcPath}`);

if (npmToken) {
  // Always use token when available (dev or CI/CD)
  const npmrcContent = `@igorguariroba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${npmToken}
always-auth=true
`;

  try {
    writeFileSync(npmrcPath, npmrcContent, { mode: 0o600 });
    console.log('✅ .npmrc configurado com sucesso');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar .npmrc:', error.message);
    process.exit(1);
  }
}

// No token available
if (npmrcExists) {
  // Use existing .npmrc for local development
  console.log('ℹ️  Token não encontrado, usando .npmrc existente');
  process.exit(0);
} else if (isCI) {
  // Fail in CI/CD if no token and no .npmrc
  console.error(
    '❌ Token de autenticação não encontrado (NPM_TOKEN / NODE_AUTH_TOKEN / GITHUB_TOKEN)'
  );
  console.error('❌ Ambiente CI/CD detectado e .npmrc não existe. Build abortado.');
  console.error('❌ Configure NPM_TOKEN como variável de ambiente no Render.');
  process.exit(1);
} else {
  // Warn in local development but don't fail
  console.warn(
    '⚠️  Token de autenticação não encontrado e .npmrc não existe.'
  );
  console.warn(
    '⚠️  Se precisar instalar @igorguariroba/bfin-sdk, configure NPM_TOKEN ou crie .npmrc manualmente.'
  );
  process.exit(0);
}
