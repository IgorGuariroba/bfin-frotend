#!/usr/bin/env node
/**
 * Script para configurar o .npmrc com o token do GitHub Packages
 * Lê o NPM_TOKEN do arquivo .env ou das variáveis de ambiente
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('[setup-npmrc] Configurando acesso ao GitHub Packages...');

// Função para ler o .env manualmente
function loadEnvFile() {
  const envPath = join(projectRoot, '.env');

  if (!existsSync(envPath)) {
    return {};
  }

  try {
    const envContent = readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      // Ignora linhas vazias e comentários
      if (!line || line.trim().startsWith('#')) return;

      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        envVars[key.trim()] = value;
      }
    });

    return envVars;
  } catch (error) {
    console.warn('[setup-npmrc] ⚠️  Erro ao ler .env:', error.message);
    return {};
  }
}

// Obtém o token do ambiente ou do .env
const envVars = loadEnvFile();
const npmToken = process.env.NPM_TOKEN ||
                 process.env.NODE_AUTH_TOKEN ||
                 process.env.GITHUB_TOKEN ||
                 envVars.NPM_TOKEN ||
                 envVars.NODE_AUTH_TOKEN ||
                 envVars.GITHUB_TOKEN;

if (!npmToken) {
  console.error('[setup-npmrc] ❌ ERRO: NPM_TOKEN não encontrado!');
  console.error('[setup-npmrc] Configure o token no arquivo .env ou nas variáveis de ambiente');
  process.exit(1);
}

console.log(`[setup-npmrc] ✅ Token encontrado: ${npmToken.substring(0, 7)}...${npmToken.substring(npmToken.length - 4)}`);

// Cria o arquivo .npmrc
const npmrcContent = `@igorguariroba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${npmToken}
`;

try {
  const npmrcPath = join(projectRoot, '.npmrc');
  writeFileSync(npmrcPath, npmrcContent, 'utf8');
  console.log('[setup-npmrc] ✅ Arquivo .npmrc criado com sucesso!');
} catch (error) {
  console.error('[setup-npmrc] ❌ Erro ao criar .npmrc:', error.message);
  process.exit(1);
}
