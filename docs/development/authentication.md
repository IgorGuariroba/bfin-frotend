# 🔐 Autenticação

O sistema de autenticação utiliza JWT (JSON Web Tokens) com fluxo de refresh token automático.

## AuthContext
A lógica de autenticação é centralizada no `AuthContext`.

### Funcionalidades:
- `signIn(email, password)`: Realiza o login e armazena os tokens.
- `signUp(email, password, full_name)`: Cria uma nova conta.
- `signOut()`: Remove os tokens e limpa o estado.
- `isAuthenticated`: Booleano que indica se o usuário está logado.
- `user`: Objeto contendo os dados do usuário logado.

## Armazenamento
Os tokens são armazenados no `localStorage`:
- `@bfin:token`: Access Token para requisições.
- `@bfin:refreshToken`: Refresh Token para renovação da sessão.

## Fluxo de Refresh
O interceptor do Axios (`src/services/api.ts`) monitora erros `401 Unauthorized`. Caso ocorra e tenhamos um refresh token, o sistema tenta renovar a sessão silenciosamente antes de falhar a requisição original.

## Proteção de Rotas
- **PrivateRoute**: Redireciona para `/login` se não autenticado.
- **PublicRoute**: Redireciona para `/dashboard` se já autenticado (evita tela de login para quem já está logado).
