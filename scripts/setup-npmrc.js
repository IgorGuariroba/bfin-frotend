#!/usr/bin/env node
import { writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const npmToken = process.env.NPM_TOKEN;

if (npmToken) {
  const npmrcContent = `@igorguariroba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${npmToken}
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
  console.warn('⚠️  NPM_TOKEN não encontrado. Pulando criação do .npmrc');
  if (existsSync(join(projectRoot, '.npmrc'))) {
    console.log('ℹ️  Usando .npmrc existente');
  }
}
