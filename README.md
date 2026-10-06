# CRUD-TCC Full Stack

Aplicação experimental Full Stack para gerenciamento de usuários, com backend em Clean Architecture e frontend React responsivo.

## Estrutura

```text
CRUD-TCC/
├── use-api/              # Node.js, Express, Prisma e PostgreSQL
├── use-web/              # React, Vite, Tailwind e interface do CRUD
├── e2e/                  # Fluxos Playwright contra a aplicação real
├── .github/workflows/    # Integração contínua
├── package.json          # npm workspaces e comandos integrados
└── playwright.config.ts
```

## Arquitetura

```text
Browser → React → users.api.ts → fetch → HTTP
        → Express → Zod → UsersController → Use Case
        → UserRepository ← PrismaUserRepository
        → Prisma → adapter-pg → pg → PostgreSQL
```

O frontend compartilha apenas o contrato HTTP com o backend. Ele não importa Domain, Prisma ou schemas internos da API. O DBeaver é usado somente para inspeção do PostgreSQL.

## Stack

### Backend

- Node.js 24, TypeScript, Express, Zod
- Prisma ORM com `@prisma/adapter-pg` e PostgreSQL 18
- Vitest, Supertest, ESLint e Prettier
- CORS restrito e Helmet

### Frontend

- React 19, TypeScript e Vite
- React Router, React Hook Form e Zod
- Tailwind CSS e componentes no padrão shadcn/ui
- Lucide React e Sonner
- Vitest, Testing Library, ESLint e Prettier

### Integração

- npm workspaces
- Concurrently
- Playwright
- GitHub Actions com PostgreSQL service

## Pré-requisitos

- Node.js 24
- npm
- PostgreSQL 18 em `127.0.0.1:5432`
- usuário `use_api_user`
- bancos `use_api_dev`, `use_api_test` e `use_api_shadow`
- Chrome local para E2E local, ou Chromium instalado pelo Playwright

## Instalação

Na raiz:

```bash
npm install
```

Configure `use-api/.env` a partir de `use-api/.env.example` e `use-web/.env` a partir de `use-web/.env.example`.

Backend:

```env
DATABASE_URL="postgresql://use_api_user:CHANGE_ME@127.0.0.1:5432/use_api_dev"
SHADOW_DATABASE_URL="postgresql://use_api_user:CHANGE_ME@127.0.0.1:5432/use_api_shadow"
TEST_DATABASE_URL="postgresql://use_api_user:CHANGE_ME@127.0.0.1:5432/use_api_test"
FRONTEND_URL="http://localhost:5173"
PORT="3333"
```

Frontend:

```env
VITE_API_URL=http://localhost:3333
```

Nunca exponha as URLs do banco no frontend.

## Banco e migrations

```bash
npm exec --workspace use-api -- prisma generate
npm exec --workspace use-api -- prisma migrate dev
npm exec --workspace use-api -- prisma migrate status
```

No DBeaver, use host `127.0.0.1`, porta `5432`, banco `use_api_dev` e usuário `use_api_user`.

## Desenvolvimento integrado

```bash
npm run dev
```

- API: `http://localhost:3333`
- Interface: `http://localhost:5173`

Comandos individuais:

```bash
npm run dev:api
npm run dev:web
```

## Rotas da interface

- `/` redireciona para `/users`;
- `/users` lista usuários;
- `/users/new` cria um usuário;
- `/users/:id` exibe detalhes;
- `/users/:id/edit` edita um usuário.

## Endpoints da API

| Método | Endpoint | Sucesso |
|---|---|---:|
| POST | `/users` | 201 |
| GET | `/users` | 200 |
| GET | `/users/:id` | 200 |
| PATCH | `/users/:id` | 200 |
| DELETE | `/users/:id` | 204 |

Erros previstos: 400 para dados inválidos, 404 para usuário inexistente, 409 para e-mail duplicado e 500 para erro inesperado sanitizado.

## Qualidade e testes

```bash
npm test
npm run lint
npm run format:check
npm run build
npm run test:e2e
```

O E2E inicia API e frontend reais, utiliza `use_api_test`, limpa somente registros com prefixo `e2e-` e valida CRUD, conflito e persistência após refresh.

## Segurança

- `.env` e artefatos são ignorados pelo Git;
- CORS permite somente `FRONTEND_URL`;
- Helmet adiciona headers defensivos;
- validação existe no frontend para UX e no backend como autoridade;
- Prisma usa queries parametrizadas;
- erros internos não chegam ao browser;
- não há autenticação, por decisão explícita de escopo.

## CI

O workflow `.github/workflows/ci.yml` usa Node.js 24 e PostgreSQL 18, cria bancos de desenvolvimento/teste/shadow, aplica migrations e executa formatação, lint, TypeScript, testes, builds e Playwright.

## Limitações

- sem autenticação ou autorização;
- sem paginação e rate limiting;
- bundle inicial do frontend possui aviso de tamanho e pode futuramente receber code splitting;
- o tooling Prisma 7.10.0 mantém vulnerabilidades transitivas documentadas; não foi usado `npm audit fix --force` porque ele propõe downgrade incompatível.

## Estabilização pós-experimento

Consulte docs/tcc/architecture-contract-v2.md para as quatro camadas e a semântica de role, docs/tcc/reproducibility.md para setup seguro e resultados, e docs/tcc/baseline.md para a lacuna histórica registrada. Use npm run typecheck --workspaces e npm run test:architecture. Testes com banco exigem NODE_ENV=test e URLs distintas para desenvolvimento e use_api_test; nunca apontar cleanup ao banco de desenvolvimento.

