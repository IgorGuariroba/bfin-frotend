## 📝 Descrição

<!-- Descreva suas mudanças em detalhes -->

## 🎯 Tipo de Mudança

<!-- Marque com um x as opções que se aplicam -->

- [ ] 🐛 Bug fix (mudança que corrige um problema)
- [ ] ✨ Nova feature (mudança que adiciona funcionalidade)
- [ ] 💥 Breaking change (mudança que quebra compatibilidade)
- [ ] 📝 Documentação (mudanças apenas em documentação)
- [ ] 🎨 Estilo (formatação, ponto e vírgula, etc; sem mudança de código)
- [ ] ♻️ Refatoração (nem adiciona feature nem corrige bug)
- [ ] ⚡ Performance (mudança que melhora performance)
- [ ] ✅ Testes (adiciona ou corrige testes)
- [ ] 🔧 Chore (mudanças em build, CI, dependências, etc)

## 🔗 Issue Relacionada

<!-- Link para a issue no GitHub, se houver -->

Closes #(issue)

## 🧪 Como Testar

<!-- Descreva os passos para testar suas mudanças -->

1. Clone a branch: `git checkout feature/minha-feature`
2. Instale dependências: `npm install`
3. Execute: `npm run dev`
4. Navegue para: ...
5. Verifique que...

## 📸 Screenshots / Vídeos

<!-- Se aplicável, adicione screenshots ou vídeos das mudanças visuais -->

| Antes | Depois |
|-------|--------|
| ...   | ...    |

## ✅ Checklist

### Código

- [ ] Meu código segue o style guide do projeto
- [ ] Executei lint e corrigi todos os warnings: `npm run lint`
- [ ] TypeScript está sem erros: `npm run type-check`
- [ ] Build está funcionando: `npm run build`
- [ ] Todos os componentes seguem Atomic Design
- [ ] Usei Chakra UI v3 syntax corretamente

### Testes

- [ ] Adicionei testes que provam que meu fix/feature funciona
- [ ] Todos os testes estão passando: `npm test`
- [ ] Testes novos e existentes estão passando localmente

### Documentação

- [ ] Atualizei a documentação (se necessário)
- [ ] Adicionei/atualizei comentários JSDoc em funções complexas
- [ ] Criei/atualizei stories do Storybook para novos componentes
- [ ] Atualizei CHANGELOG.md (se aplicável)

### Chakra UI v3

- [ ] Não usei sintaxe do Chakra UI v2
- [ ] Props estão corretas (ex: `open` ao invés de `isOpen`)
- [ ] Componentes compostos usam pattern Root/Content/Item
- [ ] Ícones em botões estão como children
- [ ] Toaster usa `toaster.create()` ao invés de `useToast()`

### Performance

- [ ] Não há re-renders desnecessários
- [ ] Usei `memo`/`useMemo`/`useCallback` quando necessário
- [ ] Imagens estão otimizadas
- [ ] Não há imports desnecessários

### Segurança

- [ ] Não há secrets hardcoded
- [ ] Validei inputs do usuário
- [ ] Não há vulnerabilidades conhecidas
- [ ] Executei `npm audit` e resolvi problemas críticos

## 🔍 Revisão de Código

<!-- Para os revisores -->

### Áreas de Atenção

<!-- Liste áreas específicas onde você gostaria de feedback -->

-
-

### Perguntas para Revisores

<!-- Perguntas específicas para os revisores -->

-
-

## 📚 Referências

<!-- Links para documentação, designs, etc -->

- [Design no Figma](link)
- [Documentação relacionada](link)
- [Issue/Epic](link)

## 🚀 Deploy

<!-- Informações sobre deploy, se relevante -->

- [ ] Esta mudança requer deploy manual
- [ ] Esta mudança requer migração de dados
- [ ] Esta mudança requer atualização de variáveis de ambiente
- [ ] Esta mudança é compatível com versão anterior

## 💬 Notas Adicionais

<!-- Qualquer informação adicional que os revisores devam saber -->
