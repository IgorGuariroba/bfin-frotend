#!/usr/bin/env node
import { writeFileSync, existsSync } from 'fs';

const npmToken = process.env.NPM_TOKEN;

if (npmToken) {
  const npmrcContent = `@igorguariroba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${npmToken}
`;
  writeFileSync('.npmrc', npmrcContent);
  console.log('✅ Arquivo .npmrc criado com sucesso');
} else {
  console.warn('⚠️  NPM_TOKEN não encontrado. Pulando criação do .npmrc');
  if (existsSync('.npmrc')) {
    console.log('ℹ️  Usando .npmrc existente');
  }
}
