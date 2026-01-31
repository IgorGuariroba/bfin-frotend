#!/usr/bin/env node

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🔄 Atualizando @igorguariroba/bfin-sdk...')

try {
  // Configurar .npmrc
  console.log('📋 Configurando acesso ao GitHub Packages...')
  execSync('npm run setup:npmrc', { stdio: 'inherit' })

  // Verificar versão atual
  const packageJsonPath = join(__dirname, '../package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  const currentVersion = packageJson.dependencies['@igorguariroba/bfin-sdk']

  console.log(`📦 Versão atual: ${currentVersion}`)

  // Verificar última versão disponível
  const latestVersion = execSync('npm view @igorguariroba/bfin-sdk version', {
    encoding: 'utf8'
  }).trim()

  console.log(`🚀 Última versão: ${latestVersion}`)

  // Atualizar package.json se necessário
  const targetVersion = `^${latestVersion}`

  if (currentVersion !== targetVersion) {
    packageJson.dependencies['@igorguariroba/bfin-sdk'] = targetVersion
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
    console.log(`✅ package.json atualizado: ${currentVersion} → ${targetVersion}`)

    // Instalar nova versão
    console.log('📥 Instalando nova versão...')
    execSync('npm install', { stdio: 'inherit' })

    // Validar instalação
    console.log('🔍 Validando instalação...')
    execSync('npm run type-check', { stdio: 'inherit' })
    execSync('npm run lint', { stdio: 'inherit' })

    console.log('🎉 SDK atualizado com sucesso!')
  } else {
    console.log('✅ SDK já está na versão mais recente!')
  }

} catch (error) {
  console.error('❌ Erro ao atualizar SDK:', error.message)
  process.exit(1)
}