#!/usr/bin/env node
import { writeFileSync, existsSync } from 'fs';
import { cwd } from 'process';
import { readFileSync } from 'fs';

// #region agent log
fetch('http://127.0.0.1:7247/ingest/949e8d38-8003-4b12-8b91-c99d4dd928e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup-npmrc.js:8',message:'Script iniciado',data:{cwd:cwd(),envKeys:Object.keys(process.env).filter(k=>k.includes('NPM')||k.includes('TOKEN')),hasNpmToken:!!process.env.NPM_TOKEN},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

const npmToken = process.env.NPM_TOKEN;

// #region agent log
fetch('http://127.0.0.1:7247/ingest/949e8d38-8003-4b12-8b91-c99d4dd928e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup-npmrc.js:12',message:'Token verificado',data:{hasToken:!!npmToken,tokenLength:npmToken?.length||0,tokenPrefix:npmToken?.substring(0,4)||'none',cwd:cwd()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
// #endregion

if (npmToken) {
  const npmrcContent = `@igorguariroba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${npmToken}
`;
  const npmrcPath = '.npmrc';
  
  // #region agent log
  fetch('http://127.0.0.1:7247/ingest/949e8d38-8003-4b12-8b91-c99d4dd928e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup-npmrc.js:20',message:'Antes de escrever .npmrc',data:{path:npmrcPath,absolutePath:`${cwd()}/${npmrcPath}`,contentLength:npmrcContent.length,contentPreview:npmrcContent.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  try {
    writeFileSync(npmrcPath, npmrcContent);
    
    // #region agent log
    const written = existsSync(npmrcPath);
    let writtenContent = '';
    try { writtenContent = readFileSync(npmrcPath, 'utf8'); } catch(e) {}
    fetch('http://127.0.0.1:7247/ingest/949e8d38-8003-4b12-8b91-c99d4dd928e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup-npmrc.js:28',message:'Depois de escrever .npmrc',data:{fileExists:written,fileContent:writtenContent,fileLength:writtenContent.length,cwd:cwd()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    console.log('✅ Arquivo .npmrc criado com sucesso');
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/949e8d38-8003-4b12-8b91-c99d4dd928e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup-npmrc.js:33',message:'Erro ao escrever .npmrc',data:{error:error.message,stack:error.stack,cwd:cwd()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    console.error('❌ Erro ao criar .npmrc:', error.message);
    process.exit(1);
  }
} else {
  // #region agent log
  fetch('http://127.0.0.1:7247/ingest/949e8d38-8003-4b12-8b91-c99d4dd928e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'setup-npmrc.js:40',message:'NPM_TOKEN não encontrado',data:{allEnvKeys:Object.keys(process.env).filter(k=>k.includes('NPM')||k.includes('TOKEN')||k.includes('GITHUB')),hasExistingNpmrc:existsSync('.npmrc'),cwd:cwd()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  console.warn('⚠️  NPM_TOKEN não encontrado. Pulando criação do .npmrc');
  if (existsSync('.npmrc')) {
    console.log('ℹ️  Usando .npmrc existente');
  }
}
