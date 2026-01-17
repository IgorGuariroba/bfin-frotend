# 🌐 API e Services

Nossa comunicação com o backend é dividida em duas camadas: o SDK gerado e os services customizados.

## 1. BFIN SDK
Utilizamos o `@igorguariroba/bfin-sdk`, um SDK privado hospedado no GitHub Packages.

- **Configuração**: Localizada em `src/config/sdk.ts`.
- **Uso**: Fornece métodos tipados para todos os endpoints da API.

```tsx
import { getTransactions } from '@igorguariroba/bfin-sdk'
const data = await getTransactions().getApiV1Transactions()
```

## 2. Axios (Instância API)
Para chamadas que requerem customização fina ou interceptores, utilizamos a instância definida em `src/services/api.ts`.

### Interceptores:
- **Request**: Adiciona automaticamente o `Authorization: Bearer <token>` em todas as chamadas.
- **Response**: Lida com erros globais e refresh tokens.

## 3. Services
Localizados em `src/services/`, eles encapsulam as chamadas para domínios específicos:
- `accountMemberService.ts`: Gestão de membros da conta.
- `transactionService.ts`: Gestão de transações.
- `api.ts`: Configuração base e interceptores.
