# 🗺 Rotas e Navegação

Utilizamos o **React Router DOM v6** para gerenciar a navegação da SPA.

## Estrutura de Rotas

As rotas são definidas no `App.tsx`:

- `/login`: Tela de acesso.
- `/register`: Cadastro de novos usuários.
- `/dashboard`: Visão geral financeira.
- `/transactions`: Listagem completa de transações.
- `/add-income`: Formulário de nova receita.
- `/add-fixed-expense`: Formulário de despesa fixa.
- `/add-variable-expense`: Formulário de despesa variável.
- `/daily-limit`: Configuração de limites.

## Proteção
Utilizamos componentes de alta ordem para proteger as rotas:

### PrivateRoute
Garante que apenas usuários autenticados acessem a rota. Caso contrário, redireciona para `/login`.

### PublicRoute
Garante que usuários já logados não acessem páginas como Login ou Cadastro, redirecionando-os para o `/dashboard`.
