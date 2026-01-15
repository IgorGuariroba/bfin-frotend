#!/usr/bin/env node
/**
 * Script para testar e validar o NPM_TOKEN
 * Verifica se o token está configurado, tem as permissões corretas e consegue acessar o GitHub Packages
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('=== Teste de Validação do NPM_TOKEN ===\n');

// 1. Verificar se o token está disponível
const npmToken = process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN || process.env.GITHUB_TOKEN;

console.log('1. Verificando variáveis de ambiente:');
console.log(`   NPM_TOKEN: ${process.env.NPM_TOKEN ? '✅ Configurado' : '❌ Não configurado'}`);
console.log(`   NODE_AUTH_TOKEN: ${process.env.NODE_AUTH_TOKEN ? '✅ Configurado' : '❌ Não configurado'}`);
console.log(`   GITHUB_TOKEN: ${process.env.GITHUB_TOKEN ? '✅ Configurado' : '❌ Não configurado'}`);
console.log(`   Token usado: ${npmToken ? `✅ Sim (${npmToken.substring(0, 7)}...${npmToken.substring(npmToken.length - 4)})` : '❌ Nenhum token encontrado'}\n`);

if (!npmToken) {
  console.error('❌ ERRO: Nenhum token encontrado nas variáveis de ambiente!');
  console.error('   Configure NPM_TOKEN, NODE_AUTH_TOKEN ou GITHUB_TOKEN');
  process.exit(1);
}

// 2. Verificar formato do token
console.log('2. Verificando formato do token:');
const isGitHubToken = npmToken.startsWith('ghp_') || npmToken.startsWith('github_pat_');
console.log(`   Formato GitHub: ${isGitHubToken ? '✅ Correto' : '⚠️  Formato não reconhecido'}`);
console.log(`   Tamanho: ${npmToken.length} caracteres ${npmToken.length >= 40 ? '✅' : '⚠️  Muito curto'}\n`);

// 3. Testar acesso ao GitHub Packages via API
console.log('3. Testando acesso ao GitHub Packages:');
try {
  const response = await fetch('https://npm.pkg.github.com/@igorguariroba/bfin-sdk', {
    headers: {
      'Authorization': `Bearer ${npmToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'bfin-frontend-setup'
    }
  });

  console.log(`   Status HTTP: ${response.status} ${response.statusText}`);
  
  if (response.status === 200) {
    console.log('   ✅ Token tem acesso ao pacote @igorguariroba/bfin-sdk');
    const data = await response.json();
    console.log(`   Versões disponíveis: ${data.versions ? Object.keys(data.versions).join(', ') : 'N/A'}`);
  } else if (response.status === 401) {
    console.error('   ❌ Token inválido ou sem permissão');
    console.error('   Verifique se o token tem a permissão "read:packages"');
  } else if (response.status === 404) {
    console.warn('   ⚠️  Pacote não encontrado (pode ser privado ou não existir)');
  } else {
    console.warn(`   ⚠️  Resposta inesperada: ${response.status}`);
  }
} catch (error) {
  console.error(`   ❌ Erro ao testar acesso: ${error.message}`);
}

console.log('\n4. Verificando .npmrc gerado:');
const npmrcPath = join(projectRoot, '.npmrc');
try {
  const npmrcContent = readFileSync(npmrcPath, 'utf8');
  const hasToken = npmrcContent.includes(npmToken);
  const hasRegistry = npmrcContent.includes('@igorguariroba:registry');
  const hasAuth = npmrcContent.includes('_authToken');
  
  console.log(`   Arquivo existe: ✅`);
  console.log(`   Tem registry: ${hasRegistry ? '✅' : '❌'}`);
  console.log(`   Tem authToken: ${hasAuth ? '✅' : '❌'}`);
  console.log(`   Token no arquivo: ${hasToken ? '✅' : '❌'}`);
  
  if (hasToken) {
    console.log('   ✅ .npmrc está configurado corretamente com o token');
  } else {
    console.warn('   ⚠️  .npmrc existe mas não contém o token atual');
  }
} catch (error) {
  console.warn(`   ⚠️  .npmrc não existe ou não pode ser lido: ${error.message}`);
}

console.log('\n=== Resumo ===');
if (npmToken && isGitHubToken) {
  console.log('✅ Token está configurado e tem formato correto');
  console.log('✅ Execute "node scripts/setup-npmrc.js" para criar o .npmrc');
  console.log('✅ Depois execute "npm install" para testar');
} else {
  console.error('❌ Token não está configurado corretamente');
  process.exit(1);
}
