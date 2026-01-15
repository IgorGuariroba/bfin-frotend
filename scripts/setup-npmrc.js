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
const npmrcPath = join(projectRoot, '.npmrc');

console.log('[setup-npmrc] Script iniciado');
console.log(`[setup-npmrc] Project root: ${projectRoot}`);
console.log(`[setup-npmrc] .npmrc path: ${npmrcPath}`);
console.log(
  `[setup-npmrc] Token disponível: ${npmToken ? 'Sim' : 'Não'} (${npmToken ? '***' + npmToken.slice(-4) : 'N/A'})`
);

if (!npmToken) {
  console.warn(
    '⚠️  Token de autenticação não encontrado (NPM_TOKEN / NODE_AUTH_TOKEN / GITHUB_TOKEN).'
  );
  if (existsSync(npmrcPath)) {
    console.log('ℹ️  Usando .npmrc existente');
    process.exit(0);
  } else {
    console.error(
      '❌ .npmrc não existe e token não foi fornecido. A autenticação falhará.'
    );
    process.exit(1);
  }
}

// Always update .npmrc with the actual token to ensure it's correct
// This is critical because the file might have been committed with a placeholder
const npmrcContent = `@igorguariroba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${npmToken}
always-auth=true
`;

try {
  writeFileSync(npmrcPath, npmrcContent, { mode: 0o600 });
  console.log('✅ Arquivo .npmrc criado/atualizado com sucesso');
  console.log(`[setup-npmrc] .npmrc criado em: ${npmrcPath}`);
  
  // Verify the file was created
  if (existsSync(npmrcPath)) {
    console.log('[setup-npmrc] Verificação: .npmrc existe após criação');
  } else {
    console.error('[setup-npmrc] ERRO: .npmrc não existe após tentativa de criação');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Erro ao criar/atualizar .npmrc:', error.message);
  console.error('[setup-npmrc] Stack:', error.stack);
  process.exit(1);
}
