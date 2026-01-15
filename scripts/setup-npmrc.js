#!/usr/bin/env node
import { writeFileSync, existsSync, readFileSync } from 'fs';
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
const npmrcPath = join(projectRoot, '.npmrc');
const npmrcExists = existsSync(npmrcPath);

if (!npmToken) {
  console.warn(
    '⚠️  Token de autenticação não encontrado (NPM_TOKEN / NODE_AUTH_TOKEN / GITHUB_TOKEN).'
  );
  if (npmrcExists) {
    console.log('ℹ️  Usando .npmrc existente');
  }
  process.exit(0);
}

// Check if .npmrc exists and contains placeholder that needs replacement
let needsUpdate = true;
if (npmrcExists) {
  try {
    const existingContent = readFileSync(npmrcPath, 'utf8');
    // Check if file contains placeholder or if token is different
    if (
      existingContent.includes('${NPM_TOKEN}') ||
      existingContent.includes('${NODE_AUTH_TOKEN}') ||
      existingContent.includes('${GITHUB_TOKEN}') ||
      !existingContent.includes(npmToken)
    ) {
      needsUpdate = true;
    } else {
      needsUpdate = false;
      console.log('ℹ️  .npmrc já existe e está atualizado');
    }
  } catch (error) {
    // If we can't read it, we'll recreate it
    needsUpdate = true;
  }
}

if (needsUpdate) {
  const npmrcContent = `@igorguariroba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${npmToken}
always-auth=true
`;

  try {
    writeFileSync(npmrcPath, npmrcContent);
    console.log('✅ Arquivo .npmrc criado/atualizado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar/atualizar .npmrc:', error.message);
    process.exit(1);
  }
}
