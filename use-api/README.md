# User API — CRUD TCC

API REST para gerenciamento de usuários, implementada em TypeScript com Clean Architecture como referência. Oferece criação, listagem, consulta, atualização parcial e exclusão física de usuários.

## Stack

- Node.js 24.14.1 e TypeScript 5.9.3
- Express 5.2.1 e Zod 4.6.5
- PostgreSQL 18.6
- Prisma ORM, Prisma Client e adapter PostgreSQL 7.10.0
- Vitest 5.0.1 e Supertest 7.3.0
- ESLint 10.11.0 e `tsx`

## Arquitetura

As dependências apontam para as políticas internas:

```text
Domain
  ↑
Application
  ↑
Infrastructure / Presentation
  ↑
Main (composition root)
```

- `domain`: entidade `User`, normalização e regras invariantes.
- `application`: casos de uso, erros e contrato `UserRepository`.
- `infrastructure`: Prisma Client, adapter PostgreSQL e repositório concreto.
- `presentation`: validação HTTP, controller, rotas e tratamento de erros.
- `main`: composição das dependências, aplicação Express e servidor.

```text
src/
├── domain/entities/
├── application/{errors,repositories,use-cases}/
├── infrastructure/database/prisma/
├── adapters/http/{controllers,middlewares,routes,schemas}/
├── adapters/persistence/prisma/ # implementação de UserRepository
├── main/
└── infrastructure/generated/prisma/             # gerado, não versionado
prisma/
├── migrations/
└── schema.prisma
tests/
├── doubles/
├── unit/
├── integration/
└── http/
```

## Pré-requisitos

- Node.js 24
- PostgreSQL 18 ativo em `127.0.0.1:5432`
- Usuário PostgreSQL `use_api_user`
- Bancos `use_api_dev`, `use_api_test` e `use_api_shadow`

## Instalação e ambiente

```bash
npm install
```

Copie `.env.example` para `.env` e substitua `CHANGE_ME`. Nunca versione `.env`.

```env
DATABASE_URL="postgresql://use_api_user:CHANGE_ME@127.0.0.1:5432/use_api_dev"
SHADOW_DATABASE_URL="postgresql://use_api_user:CHANGE_ME@127.0.0.1:5432/use_api_shadow"
TEST_DATABASE_URL="postgresql://use_api_user:CHANGE_ME@127.0.0.1:5432/use_api_test"
```

Os testes automatizados de integração e HTTP usam exclusivamente `use_api_test` e limpam a tabela entre casos.

### DBeaver Community

Crie uma conexão PostgreSQL com host `127.0.0.1`, porta `5432`, banco `use_api_dev` e usuário `use_api_user`. Informe a senha local e valide com:

```sql
SELECT current_database(), current_user;
```

O resultado esperado é `use_api_dev` e `use_api_user`. O DBeaver é apenas ferramenta de inspeção e não é dependência da aplicação.

## Migrations e Prisma

```bash
npx prisma format
npx prisma validate
npx prisma migrate dev
npx prisma migrate status
npx prisma generate
```

A migration inicial cria o enum `UserRole`, a tabela `users`, chave primária textual em `id` e índice único em `email`. UUID e timestamps são definidos pela aplicação, sem defaults automáticos no banco.

## Execução

```bash
npm run dev
```

Para compilar e executar o JavaScript em `dist`:

```bash
npm run build
npm start
```

O servidor usa a porta `3000` por padrão; `PORT` pode sobrescrevê-la.

## Testes e qualidade

```bash
npm test
npm run test:unit
npm run test:integration
npm run test:http
npx tsc --noEmit
npm run lint
```

Os testes cobrem entidade e casos de uso, todo o contrato do `PrismaUserRepository`, unicidade no PostgreSQL e comportamentos HTTP com Supertest.

## Endpoints

| Método | Rota | Sucesso | Erros esperados |
|---|---|---:|---|
| POST | `/users` | 201 | 400, 409 |
| GET | `/users` | 200 | 500 |
| GET | `/users/:id` | 200 | 400, 404 |
| PATCH | `/users/:id` | 200 | 400, 404, 409 |
| DELETE | `/users/:id` | 204 | 400, 404 |

Exemplo de criação:

```json
{ "name": "Ana Silva", "email": "ana@example.com", "role": "USER" }
```

PATCH aceita qualquer subconjunto não vazio de `name`, `email` e `role`. Roles válidas são `USER` e `ADMIN`. Erros não expõem stack trace, SQL ou detalhes internos do Prisma.

## Decisões

- Nome recebe `trim()`; e-mail recebe `trim().toLowerCase()`.
- UUID é criado no caso de uso com `crypto.randomUUID()`.
- Atualização é parcial, preserva `createdAt` e renova `updatedAt`.
- Exclusão é física.
- Unicidade é verificada na Application e garantida pelo índice PostgreSQL.
- Violações concorrentes da constraint (`P2002`) são traduzidas para `EmailAlreadyExistsError`.
- Models Prisma são convertidos explicitamente em entidades de domínio.

## Segurança e limitações

- Este experimento não possui autenticação ou autorização.
- Não há paginação, rate limiting ou observabilidade estruturada.
- A validação de e-mail é simples e não tenta implementar integralmente o RFC.
- Credenciais ficam somente no ambiente local.
- Em 30/09/2026, `npm audit` reportou quatro vulnerabilidades transitivas de severidade alta em `deepmerge-ts` e `mysql2`, trazidas pelo tooling do Prisma 7.10.0. `npm audit fix --force` não foi executado porque propõe downgrade incompatível para Prisma 6.19.3.
