#!/usr/bin/env node
import { writeFileSync, existsSync, appendFileSync, readFileSync as readFile } from 'fs';
import { cwd } from 'process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Função helper para log estruturado
const debugLog = (location, message, data, hypothesisId) => {
  const logEntry = {
    location,
    message,
    data,
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId
  };
  // Log no console (visível no Render)
  console.log(`[DEBUG] ${JSON.stringify(logEntry)}`);
  // Tentar escrever em arquivo também
  try {
    appendFileSync('/tmp/npmrc-debug.log', JSON.stringify(logEntry) + '\n');
  } catch (e) {
    // Ignorar erro se não conseguir escrever
  }
};

// #region agent log
const allEnv = Object.keys(process.env);
const relevantEnv = allEnv.filter(k => k.includes('NPM') || k.includes('TOKEN') || k.includes('GITHUB') || k.includes('RENDER'));
debugLog('setup-npmrc.js:10', 'Script iniciado', {
  cwd: cwd(),
  envKeys: relevantEnv,
  envValues: relevantEnv.reduce((acc, k) => {
    const val = process.env[k];
    acc[k] = val ? (val.length > 20 ? val.substring(0, 20) + '...' : val) : 'undefined';
    return acc;
  }, {}),
  hasNpmToken: !!process.env.NPM_TOKEN,
  nodeVersion: process.version,
  argv: process.argv
}, 'A');
// #endregion

const npmToken = process.env.NPM_TOKEN;

// #region agent log
debugLog('setup-npmrc.js:20', 'Token verificado', {
  hasToken: !!npmToken,
  tokenLength: npmToken?.length || 0,
  tokenPrefix: npmToken?.substring(0, 4) || 'none',
  cwd: cwd()
}, 'B');
// #endregion

if (npmToken) {
  const npmrcContent = `@igorguariroba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${npmToken}
`;
  // Criar .npmrc no diretório do projeto (não no diretório do script)
  const npmrcPath = join(projectRoot, '.npmrc');

  // #region agent log
  debugLog('setup-npmrc.js:30', 'Antes de escrever .npmrc', {
    path: npmrcPath,
    absolutePath: `${cwd()}/${npmrcPath}`,
    contentLength: npmrcContent.length,
    contentPreview: npmrcContent.substring(0, 50)
  }, 'C');
  // #endregion

  try {
    writeFileSync(npmrcPath, npmrcContent);

    // #region agent log
    const written = existsSync(npmrcPath);
    let writtenContent = '';
    try { writtenContent = readFileSync(npmrcPath, 'utf8'); } catch(e) {}
    debugLog('setup-npmrc.js:40', 'Depois de escrever .npmrc', {
      fileExists: written,
      fileContent: writtenContent,
      fileLength: writtenContent.length,
      cwd: cwd()
    }, 'D');
    // #endregion

    console.log('✅ Arquivo .npmrc criado com sucesso');
  } catch (error) {
    // #region agent log
    debugLog('setup-npmrc.js:48', 'Erro ao escrever .npmrc', {
      error: error.message,
      stack: error.stack,
      cwd: cwd()
    }, 'C');
    // #endregion
    console.error('❌ Erro ao criar .npmrc:', error.message);
    process.exit(1);
  }
} else {
  // #region agent log
  debugLog('setup-npmrc.js:55', 'NPM_TOKEN não encontrado', {
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('NPM') || k.includes('TOKEN') || k.includes('GITHUB')),
    hasExistingNpmrc: existsSync('.npmrc'),
    cwd: cwd()
  }, 'B');
  // #endregion
  console.warn('⚠️  NPM_TOKEN não encontrado. Pulando criação do .npmrc');
  if (existsSync('.npmrc')) {
    console.log('ℹ️  Usando .npmrc existente');
  }
}
