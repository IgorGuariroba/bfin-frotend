# 👥 Guia de Contribuição

Ficamos felizes que você queira contribuir com o BFIN!

## Como contribuir?

1. **Fork** o repositório.
2. Crie uma **Branch** para sua funcionalidade: `git checkout -b feature/minha-feature`.
3. Siga os **Padrões de Desenvolvimento** descritos na documentação.
4. Garanta que o código passa no **Lint** e nos **Testes**: `npm run lint && npm test`.
5. Faça o **Commit** seguindo os Conventional Commits.
6. Envie o **Push** para sua branch.
7. Abra um **Pull Request** detalhando as mudanças.

## Requisitos para PRs
- O build deve passar no CI (`npm run build`).
- Novos componentes devem ter histórias no Storybook.
- Lógica de negócio complexa deve ser coberta por testes unitários.
- A tipagem TypeScript deve estar correta (sem `any`).
