# Relatório Técnico — User API / CRUD TCC

## 1. Identificação

- **Projeto:** User API / CRUD TCC
- **Objetivo:** implementar uma API REST completa para gerenciamento de usuários.
- **Arquitetura de referência:** Clean Architecture.
- **Data da conclusão desta etapa:** 30 de setembro de 2026.
- **Banco de dados:** PostgreSQL local.

Este documento registra o estado inicial encontrado, as atividades realizadas, as decisões adotadas, os arquivos criados ou modificados, as validações executadas e as limitações conhecidas.

## 2. Objetivo funcional

A API implementada oferece as cinco operações obrigatórias do CRUD:

| Operação | Método | Endpoint |
|---|---|---|
| Criar usuário | POST | `/users` |
| Listar usuários | GET | `/users` |
| Consultar usuário | GET | `/users/:id` |
| Atualizar parcialmente | PATCH | `/users/:id` |
| Excluir usuário | DELETE | `/users/:id` |

## 3. Stack utilizada

- Node.js 24.14.1
- TypeScript 5.9.3
- Express 5.2.1
- Zod 4.6.5
- PostgreSQL 18.6
- Prisma ORM 7.10.0
- `@prisma/client` 7.10.0
- `@prisma/adapter-pg` 7.10.0
- `pg` 8.23.0
- Vitest 5.0.1
- Supertest 7.3.0
- ESLint 10.11.0
- `tsx`
- `dotenv`

## 4. Estado inicial encontrado

O projeto já possuía as camadas Domain e Application, incluindo:

- entidade `User`;
- erros `EmailAlreadyExistsError` e `UserNotFoundError`;
- contrato `UserRepository`;
- casos de uso `CreateUser`, `GetUser`, `ListUsers`, `UpdateUser` e `DeleteUser`;
- repositório em memória utilizado como test double;
- seis arquivos de testes unitários.

Antes de qualquer implementação, foram executadas as validações de linha de base:

- `npm test`: 6 arquivos e 21 testes passaram;
- `npx tsc --noEmit`: passou sem erros;
- `npm run lint`: passou sem erros.

Nenhum código funcional de Domain ou Application foi reescrito, pois os testes confirmaram que as regras existentes estavam corretas.

## 5. Regras de negócio preservadas

A entidade e os casos de uso mantêm as seguintes regras:

- todo usuário deve possuir nome;
- todo usuário deve possuir e-mail;
- o e-mail deve possuir formato válido;
- o e-mail deve ser único;
- a role deve ser `USER` ou `ADMIN`;
- o nome é normalizado com `trim()`;
- o e-mail é normalizado com `trim().toLowerCase()`;
- o UUID é gerado na Application com `crypto.randomUUID()`;
- a atualização é parcial;
- `createdAt` é preservado durante atualizações;
- `updatedAt` é renovado pela aplicação;
- a exclusão é física;
- a unicidade do e-mail é protegida pela Application e pelo PostgreSQL.

## 6. Configuração de ambiente e PostgreSQL

O servidor PostgreSQL foi validado em `127.0.0.1:5432`. Foram confirmadas conexões independentes com:

- `use_api_dev` para desenvolvimento;
- `use_api_test` para testes automatizados;
- `use_api_shadow` para o Prisma Migrate.

Todas as conexões utilizam o usuário específico `use_api_user`. O superusuário `postgres` não é utilizado pela aplicação.

O `.env` foi configurado localmente com:

- `DATABASE_URL`;
- `SHADOW_DATABASE_URL`;
- `TEST_DATABASE_URL`.

A senha não foi incluída neste relatório, no README ou no código-fonte. O arquivo `.env` permanece ignorado pelo Git.

Também foi criado `.env.example`, contendo valores `CHANGE_ME`, para documentar a configuração sem expor segredos.

### DBeaver

Os parâmetros documentados para inspeção no DBeaver Community são:

- host: `127.0.0.1`;
- porta: `5432`;
- database: `use_api_dev`;
- username: `use_api_user`.

A consulta de validação é:

```sql
SELECT current_database(), current_user;
```

O DBeaver permanece apenas como ferramenta de inspeção e não é uma dependência da aplicação.

## 7. Prisma

### 7.1 Configuração

O arquivo `prisma7.config.ts` foi atualizado para carregar:

- o schema em `prisma/schema.prisma`;
- migrations em `prisma/migrations`;
- `DATABASE_URL` como datasource principal;
- `SHADOW_DATABASE_URL` como shadow database.

Foi utilizada a função `env()` de `prisma/config`, compatível com `exactOptionalPropertyTypes`.

### 7.2 Schema

O schema foi revisado e validado com:

```prisma
enum UserRole {
  USER
  ADMIN
}

model User {
  id        String   @id
  name      String
  email     String   @unique
  role      UserRole
  createdAt DateTime
  updatedAt DateTime

  @@map("users")
}
```

Não foram adicionados `default(uuid())`, `default(now())` ou `@updatedAt`, pois UUID e datas são controlados pela Application.

### 7.3 Migration

A migration inicial foi criada primeiro em modo de revisão:

```bash
npx prisma migrate dev --name init_users --create-only
```

O SQL gerado foi inspecionado antes da aplicação. Ele contém:

- enum PostgreSQL `UserRole`;
- tabela `users`;
- chave primária `users_pkey` em `id`;
- índice único `users_email_key` em `email`;
- colunas obrigatórias `createdAt` e `updatedAt`.

A migration foi então aplicada em `use_api_dev` e `use_api_test`. O status final confirmou que ambos estavam atualizados.

Arquivo criado:

```text
prisma/migrations/20261001020614_init_users/migration.sql
```

## 8. Infraestrutura de persistência

### 8.1 Prisma Client

Foi criado `src/infrastructure/database/prisma/client.ts`.

Suas responsabilidades são:

- carregar o ambiente;
- validar a presença de `DATABASE_URL`;
- criar o adapter `PrismaPg`;
- instanciar e centralizar o `PrismaClient`;
- permitir a criação de clients com outra connection string, usada nos testes.

O Prisma Client não foi espalhado pelos casos de uso.

### 8.2 PrismaUserRepository

Foi criado `src/infrastructure/database/prisma/PrismaUserRepository.ts`, implementando integralmente `UserRepository`:

- `create`;
- `findById`;
- `findByEmail`;
- `findAll`;
- `update`;
- `deleteById`.

O repositório converte explicitamente registros Prisma em instâncias da entidade `User`. O model gerado pelo Prisma não é tratado como entidade de domínio.

Erros de constraint única `P2002` são interceptados e convertidos em `EmailAlreadyExistsError`. Dessa forma, códigos Prisma, SQL e stack traces não chegam à camada HTTP.

## 9. Camada HTTP

Foi criada a estrutura:

```text
src/presentation/http/
├── controllers/
│   └── UsersController.ts
├── middlewares/
│   └── errorHandler.ts
├── routes/
│   └── users.routes.ts
└── schemas/
    └── user.schemas.ts
```

### 9.1 Schemas Zod

Os schemas validam a estrutura recebida por HTTP:

- parâmetros `id` devem ser UUIDs;
- POST exige `name`, `email` e `role` como strings;
- PATCH aceita `name`, `email` e `role` opcionais;
- PATCH com corpo vazio é rejeitado.

Regras centrais, como normalização, formato do e-mail e roles permitidas, continuam no Domain.

### 9.2 Controller

O `UsersController`:

- valida parâmetros e corpo;
- chama os casos de uso;
- apresenta a entidade em formato público;
- não contém regras centrais de negócio;
- encaminha erros ao middleware.

Durante os testes foi identificado que a serialização direta da classe `User` expunha campos internos como `_id` e `_email`. O problema foi corrigido com um presenter explícito no controller, que retorna somente:

- `id`;
- `name`;
- `email`;
- `role`;
- `createdAt`;
- `updatedAt`.

### 9.3 Tratamento de erros

O middleware mapeia:

| Erro | Status | Código público |
|---|---:|---|
| `ZodError` | 400 | `INVALID_REQUEST` |
| `DomainValidationError` | 400 | `DOMAIN_VALIDATION_ERROR` |
| `UserNotFoundError` | 404 | `USER_NOT_FOUND` |
| `EmailAlreadyExistsError` | 409 | `EMAIL_ALREADY_EXISTS` |
| erro inesperado | 500 | `INTERNAL_SERVER_ERROR` |

Respostas inesperadas não incluem stack trace, SQL ou detalhes Prisma.

## 10. Composition root e servidor

Foi criado `src/main/composition-root.ts`, responsável por conectar:

```text
PrismaUserRepository
        ↓
CreateUser / GetUser / ListUsers / UpdateUser / DeleteUser
        ↓
UsersController
        ↓
Rotas Express
```

Também foram criados:

- `src/main/app.ts`: configura Express, JSON, rotas e middleware de erros; exporta a aplicação para testes;
- `src/main/server.ts`: inicia o listener HTTP sem duplicar a configuração da aplicação.

A função `createApp` aceita injeção de um repositório. Isso permite que os testes HTTP utilizem `use_api_test`, sem acessar `use_api_dev`.

## 11. Endpoints e códigos HTTP

| Método | Endpoint | Resultado |
|---|---|---|
| POST | `/users` | 201 ao criar; 400 para entrada inválida; 409 para e-mail duplicado |
| GET | `/users` | 200 com uma lista, inclusive vazia |
| GET | `/users/:id` | 200 quando encontrado; 400 para ID inválido; 404 quando inexistente |
| PATCH | `/users/:id` | 200 ao atualizar; 400 para entrada inválida; 404 quando inexistente; 409 para e-mail duplicado |
| DELETE | `/users/:id` | 204 ao excluir; 400 para ID inválido; 404 quando inexistente |

## 12. Testes implementados

### 12.1 Testes unitários existentes

Os 21 testes originais foram preservados:

- `User.spec.ts`: 8 testes;
- `CreateUser.spec.ts`: 2 testes;
- `GetUser.spec.ts`: 2 testes;
- `ListUsers.spec.ts`: 2 testes;
- `UpdateUser.spec.ts`: 5 testes;
- `DeleteUser.spec.ts`: 2 testes.

### 12.2 Testes de integração

Foi criado `tests/integration/PrismaUserRepository.spec.ts`, com 6 testes em PostgreSQL real:

- criação e consulta por ID;
- consulta por e-mail;
- listagem;
- atualização e preservação de `createdAt`;
- exclusão;
- tradução de violação de e-mail único.

### 12.3 Testes HTTP

Foi criado `tests/http/users.spec.ts`, com 13 testes Supertest:

- POST válido;
- POST inválido;
- POST duplicado;
- GET lista;
- GET por ID existente;
- GET por ID inexistente;
- PATCH válido;
- PATCH vazio;
- PATCH em usuário inexistente;
- PATCH com e-mail duplicado;
- DELETE válido;
- DELETE inexistente;
- role inválida.

### 12.4 Isolamento

Os testes de integração e HTTP:

- utilizam exclusivamente `TEST_DATABASE_URL`;
- limpam a tabela entre casos;
- desconectam o client após a suíte.

Foi criado `vitest.config.ts` com execução não paralela entre arquivos para evitar interferência entre suítes que compartilham o banco de teste.

## 13. Build e scripts

Foi criado `tsconfig.build.json` para:

- usar `src` como `rootDir`;
- gerar JavaScript em `dist`;
- não compilar testes como parte do build de produção.

O `package.json` foi atualizado com:

```text
npm run build
npm run test:unit
npm run test:integration
npm run test:http
```

O fluxo de execução ficou:

```bash
npm run dev
```

ou:

```bash
npm run build
npm start
```

## 14. Documentação e higiene do repositório

O `README.md` foi criado com:

- objetivo;
- stack;
- arquitetura;
- estrutura de diretórios;
- pré-requisitos;
- instalação;
- configuração do ambiente;
- PostgreSQL e DBeaver;
- migrations;
- execução;
- testes;
- endpoints;
- códigos HTTP;
- decisões técnicas;
- segurança;
- vulnerabilidades e limitações.

O `.gitignore` foi atualizado para excluir:

- `.env`;
- `node_modules`;
- `dist`;
- `coverage`;
- logs;
- Prisma Client gerado.

Nenhum segredo foi adicionado aos arquivos versionáveis.

## 15. Validação arquitetural

Foi realizada busca por imports proibidos.

Resultado:

- Domain não importa Express, Zod, Prisma, código gerado, Infrastructure, Presentation ou Main;
- Application importa apenas Domain e seus próprios contratos/erros;
- Infrastructure conhece Application, Domain e Prisma;
- Presentation conhece Application, Domain, Express e Zod;
- Main realiza a composição das camadas.

A direção de dependências ficou:

```text
Domain ← Application ← Infrastructure/Presentation ← Main
```

## 16. Validações finais executadas

Os seguintes comandos foram realmente executados:

| Comando | Resultado |
|---|---|
| `npm run build` | passou |
| `npm test` | 8 arquivos e 40 testes passaram |
| `npm run test:integration` | 1 arquivo e 6 testes passaram |
| `npm run test:http` | 1 arquivo e 13 testes passaram |
| `npx tsc --noEmit` | passou |
| `npm run lint` | passou |
| `npx prisma validate` | schema válido |
| `npx prisma migrate status` | banco de desenvolvimento atualizado |
| `git diff --check` | passou |

Resultado consolidado dos testes:

```text
Test Files: 8 passed
Tests:      40 passed
```

## 17. Segurança

Foram adotadas as seguintes medidas dentro do escopo:

- credenciais somente no `.env`;
- `.env` ignorado pelo Git;
- entradas HTTP validadas;
- queries parametrizadas pelo Prisma;
- ausência de SQL concatenado;
- erros internos não são expostos;
- constraint única no banco;
- ambiente de teste separado do ambiente de desenvolvimento;
- usuário específico da aplicação em vez do superusuário PostgreSQL.

Autenticação não foi implementada porque está explicitamente fora do escopo deste experimento.

## 18. Auditoria de dependências

O comando `npm audit` foi executado e reportou quatro vulnerabilidades transitivas de severidade alta:

- `deepmerge-ts`;
- `mysql2`.

Essas dependências são trazidas pelo tooling do Prisma 7.10.0. A correção sugerida por `npm audit fix --force` instalaria Prisma 6.19.3, causando downgrade incompatível com a stack definida.

Por esse motivo, `npm audit fix --force` não foi executado. A situação foi registrada no README para acompanhamento futuro.

## 19. Estrutura final relevante

```text
use-api/
├── prisma/
│   ├── migrations/
│   │   ├── 20261001020614_init_users/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── src/
│   ├── application/
│   │   ├── errors/
│   │   ├── repositories/
│   │   └── use-cases/
│   ├── domain/
│   │   └── entities/
│   ├── infrastructure/
│   │   └── database/prisma/
│   │       ├── client.ts
│   │       └── PrismaUserRepository.ts
│   ├── main/
│   │   ├── app.ts
│   │   ├── composition-root.ts
│   │   └── server.ts
│   └── presentation/
│       └── http/
│           ├── controllers/
│           ├── middlewares/
│           ├── routes/
│           └── schemas/
├── tests/
│   ├── doubles/
│   ├── http/
│   ├── integration/
│   └── unit/
├── .env.example
├── .gitignore
├── README.md
├── RELATORIO_PROJETO.md
├── package.json
├── prisma7.config.ts
├── tsconfig.build.json
├── tsconfig.json
└── vitest.config.ts
```

## 20. Limitações conhecidas

- não há autenticação ou autorização;
- não há paginação na listagem;
- não há rate limiting;
- não há observabilidade ou logging estruturado;
- não há containerização;
- a validação de e-mail é simples e não cobre integralmente todos os formatos previstos por RFC;
- permanecem vulnerabilidades transitivas no tooling Prisma, sem correção compatível indicada pelo `npm audit` na versão utilizada.

## 21. Conclusão

O projeto passou de uma implementação de Domain/Application com repositório em memória para uma API REST completa e executável, integrada a PostgreSQL real.

O resultado final possui:

- CRUD completo;
- separação de responsabilidades;
- direção correta de dependências;
- persistência Prisma/PostgreSQL;
- migration versionada;
- validação HTTP com Zod;
- tratamento centralizado de erros;
- composição explícita de dependências;
- testes unitários, de integração e HTTP;
- build de produção;
- documentação de instalação, execução e manutenção;
- 40 testes passando e todas as validações técnicas concluídas.

---

# Evolução Full Stack do projeto

## 22. Nova etapa e objetivo

Após a conclusão da API REST, o projeto foi evoluído para uma aplicação Full Stack completa. O backend existente foi preservado e passou a ser consumido por um frontend React separado.

O objetivo desta etapa foi acrescentar:

- frontend React com TypeScript;
- integração HTTP real;
- segurança básica no Express;
- experiência responsiva e acessível;
- testes de interface;
- testes end-to-end;
- execução integrada por workspaces;
- integração contínua;
- documentação centralizada.

A estrutura passou a ser:

```text
CRUD-TCC/
├── use-api/
├── use-web/
├── e2e/
├── .github/workflows/
├── package.json
├── playwright.config.ts
├── README.md
└── RELATORIO_FULLSTACK.md
```

## 23. Auditoria antes da evolução

Antes de criar o frontend, o estado descrito neste relatório foi confirmado executando novamente:

- `npm run build`;
- `npm test`;
- `npm run test:unit`;
- `npm run test:integration`;
- `npm run test:http`;
- `npx tsc --noEmit`;
- `npm run lint`;
- `npx prisma validate`;
- `npx prisma migrate status`.

O backend continuava com 8 arquivos e 40 testes passando, schema válido e migration sincronizada. Nenhum caso de uso, entidade, repositório Prisma ou controller foi refeito.

## 24. CORS, Helmet e Prettier no backend

Foram adicionadas as dependências:

- `cors`;
- `@types/cors`;
- `helmet`;
- `prettier`.

O Express passou a registrar, antes das rotas:

```text
Helmet → CORS → express.json → rotas → errorHandler
```

O CORS utiliza somente `FRONTEND_URL`, configurado em desenvolvimento como:

```env
FRONTEND_URL=http://localhost:5173
```

Não foi usado `origin: "*"`.

O Helmet adiciona headers defensivos sem alterar regras de negócio. Foram acrescentados dois testes HTTP para validar:

- `Access-Control-Allow-Origin`;
- preflight CORS;
- header `X-Content-Type-Options: nosniff`.

O backend passou de 40 para 42 testes:

- 21 unitários;
- 6 de integração;
- 15 HTTP.

Também foram criados:

- `.prettierrc.json`;
- `.prettierignore`;
- scripts `format` e `format:check`.

A porta padrão da API foi alterada de 3000 para 3333, conforme o contrato da integração local.

## 25. Frontend React

Foi criado o projeto independente `use-web` com:

- React 19;
- TypeScript;
- Vite;
- React Router;
- React Hook Form;
- Zod;
- `@hookform/resolvers`;
- Tailwind CSS;
- componentes no padrão shadcn/ui;
- Radix Dialog;
- Lucide React;
- Sonner;
- Vitest;
- React Testing Library;
- jest-dom;
- user-event;
- jsdom;
- ESLint;
- Prettier e plugin Tailwind.

Não foram adicionados:

- Redux;
- Axios;
- TanStack Query;
- Prisma no frontend;
- compartilhamento de código interno do backend.

O estado foi mantido com `useState`, `useEffect` e React Hook Form, suficientes para o escopo do CRUD.

## 26. Estrutura do frontend

O frontend foi organizado por feature:

```text
use-web/src/
├── app/
│   ├── App.tsx
│   └── router.tsx
├── components/
│   └── ui/
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── skeleton.tsx
├── features/
│   └── users/
│       ├── api/users.api.ts
│       ├── components/
│       │   ├── DeleteUserDialog.tsx
│       │   ├── UserCard.tsx
│       │   ├── UserForm.tsx
│       │   └── UserTable.tsx
│       ├── pages/
│       │   ├── CreateUserPage.tsx
│       │   ├── EditUserPage.tsx
│       │   ├── UserDetailsPage.tsx
│       │   └── UsersPage.tsx
│       ├── schemas/user.schema.ts
│       └── types/user.types.ts
├── lib/
│   ├── api.ts
│   └── utils.ts
├── styles/index.css
├── test/setup.ts
└── main.tsx
```

## 27. Rotas da interface

Foram implementadas somente as rotas do escopo:

| Rota | Responsabilidade |
|---|---|
| `/` | redirecionar para `/users` |
| `/users` | listar e excluir usuários |
| `/users/new` | cadastrar usuário |
| `/users/:id` | visualizar detalhes |
| `/users/:id/edit` | editar usuário |

Rotas desconhecidas retornam para `/users`.

## 28. Tipos e schema da interface

O frontend define tipos próprios para o contrato HTTP:

- `UserRole`;
- `User`;
- `CreateUserInput`;
- `UpdateUserInput`;
- `ApiErrorBody`.

Nenhum tipo é importado de `use-api/src`.

Foi criado um schema Zod específico da UI para validar:

- nome obrigatório;
- e-mail obrigatório e válido;
- role `USER` ou `ADMIN`.

A validação frontend existe para melhorar a experiência. O backend continua sendo a autoridade das regras.

## 29. Cliente HTTP e users API

O arquivo `use-web/src/lib/api.ts` centraliza:

- leitura de `VITE_API_URL`;
- execução de `fetch` nativo;
- serialização JSON;
- tratamento de respostas 204;
- conversão de respostas de erro em `ApiError`;
- fallback sanitizado quando o servidor não retorna JSON.

A configuração local é:

```env
VITE_API_URL=http://localhost:3333
```

O frontend nunca recebe `DATABASE_URL`, `TEST_DATABASE_URL` ou credenciais PostgreSQL.

O arquivo `users.api.ts` implementa:

- `list`;
- `get`;
- `create`;
- `update`;
- `delete`.

Componentes e páginas não espalham chamadas `fetch` diretamente.

## 30. Interface implementada

A página principal possui:

- título “Gerenciamento de usuários”;
- descrição;
- ação “Novo usuário”;
- tabela em desktop;
- cards em telas menores;
- nome, e-mail, role, data e ações;
- visualizar, editar e excluir.

Foram implementados explicitamente:

- loading com skeleton;
- estado vazio;
- estado de erro;
- tentativa novamente;
- feedback de sucesso e falha;
- estado submitting;
- botões desabilitados;
- hover e foco visível;
- confirmação antes da exclusão.

O formulário mostra mensagens próximas aos campos, desabilita o botão durante a submissão e alterna entre “Criar usuário” e “Salvar alterações”.

## 31. Exclusão e feedback

A exclusão utiliza diálogo Radix acessível.

O diálogo apresenta:

- pergunta “Excluir usuário?”;
- nome;
- e-mail;
- ação Cancelar;
- ação Excluir;
- bloqueio durante a requisição.

Após sucesso:

- o diálogo fecha;
- a lista local é atualizada;
- um toast confirma a exclusão.

Erros 400, 404, 409 e 500 são convertidos em mensagens públicas. Stack trace, Prisma, SQL e caminhos internos não são exibidos.

## 32. Responsividade

A interface foi desenvolvida mobile first, com suporte fluido para:

- 320px;
- 375px;
- 768px;
- 1024px;
- 1440px.

Em telas pequenas são usados cards. A tabela aparece em desktop, evitando overflow horizontal. Inputs possuem tamanho confortável e ações não dependem exclusivamente de hover.

## 33. Acessibilidade

Foram implementados:

- HTML semântico;
- labels ligadas aos campos;
- `aria-describedby` para erros;
- `aria-invalid`;
- alertas acessíveis;
- foco visível;
- ordem de teclado lógica;
- labels para botões apenas com ícones;
- diálogo com gerenciamento de foco e teclado;
- áreas de toque adequadas;
- suporte a `prefers-reduced-motion`;
- contraste consistente.

## 34. Testes frontend

Foram criados 11 testes em 4 arquivos.

Cobertura comportamental:

- loading da lista;
- lista com usuários;
- lista vazia;
- erro da lista;
- validações do formulário;
- submissão válida;
- bloqueio durante submissão;
- criação com sucesso;
- conflito 409;
- carregamento para edição;
- atualização;
- erro de carregamento;
- confirmação, cancelamento e sucesso da exclusão.

Resultado executado:

```text
Test Files: 4 passed
Tests: 11 passed
```

Os testes usam mocks na fronteira `users.api.ts`, sem mockar indiscriminadamente hooks internos.

## 35. Workspaces e execução integrada

A raiz `CRUD-TCC` recebeu um `package.json` privado com workspaces:

```json
{
  "private": true,
  "workspaces": ["use-api", "use-web"]
}
```

Foi adicionado `concurrently` e os scripts:

- `dev`;
- `dev:api`;
- `dev:web`;
- `test`;
- `build`;
- `lint`;
- `format`;
- `format:check`;
- `test:e2e`.

Execução integrada:

```bash
cd CRUD-TCC
npm run dev
```

Serviços:

- API: `http://localhost:3333`;
- frontend: `http://localhost:5173`.

## 36. Playwright E2E

Foi adicionado `@playwright/test` e criado `e2e/users.spec.ts`.

O cenário executa backend e frontend reais e valida:

1. abertura da lista;
2. criação de USER;
3. detalhes;
4. edição;
5. criação de ADMIN;
6. conflito de e-mail duplicado;
7. exclusão;
8. refresh;
9. persistência PostgreSQL.

Foi criado `src/main/e2e-server.ts`, que troca `DATABASE_URL` por `TEST_DATABASE_URL` antes de importar a aplicação. Assim, o E2E usa exclusivamente `use_api_test`.

O cenário limpa apenas registros com e-mail iniciado por `e2e-`.

Como a porta 3333 estava ocupada por um servidor de desenvolvimento do usuário durante a validação final, o Playwright foi isolado na porta 3334. Isso evitou interromper o processo existente ou acessar `use_api_dev`.

O download do Chromium Playwright sofreu timeout no CDN. O E2E local foi executado com o Google Chrome já instalado.

Resultado real:

```text
1 passed
```

## 37. Integração contínua

Foi criado:

```text
.github/workflows/ci.yml
```

O workflow configura:

- Ubuntu;
- Node.js 24;
- PostgreSQL 18;
- usuário e senha descartáveis de CI;
- bancos dev, test e shadow;
- `npm ci`;
- Prisma Client;
- migrations dev e teste;
- Prettier;
- ESLint;
- TypeScript backend/frontend;
- testes backend/frontend;
- build backend/frontend;
- Chromium Playwright;
- E2E Full Stack;
- upload do relatório Playwright em falha.

Nenhuma credencial local foi colocada no workflow.

## 38. Documentação

Foram criados ou atualizados:

- `CRUD-TCC/README.md` com visão Full Stack;
- `use-web/README.md`;
- `CRUD-TCC/RELATORIO_FULLSTACK.md`;
- este `RELATORIO_PROJETO.md`.

O README principal documenta arquitetura, stack, banco, DBeaver, ambientes, workspaces, execução, testes, E2E, endpoints, segurança e limitações.

## 39. Arquitetura final

O fluxo final é:

```text
Browser
  ↓
React
  ↓
users.api.ts
  ↓
fetch
  ↓
HTTP
  ↓
Express + CORS + Helmet
  ↓
Zod
  ↓
UsersController
  ↓
Use Case
  ↓
UserRepository
  ↑
PrismaUserRepository
  ↓
Prisma
  ↓
adapter-pg
  ↓
pg
  ↓
PostgreSQL
```

O DBeaver apenas observa o PostgreSQL.

## 40. Validação final consolidada

Todos os comandos abaixo foram executados na validação final:

| Validação | Resultado |
|---|---|
| Prettier backend/frontend | passou |
| ESLint backend/frontend | passou |
| TypeScript backend | passou |
| TypeScript frontend | passou |
| Backend completo | 8 arquivos e 42 testes passaram |
| Backend unitário | 6 arquivos e 21 testes passaram |
| Backend integração | 1 arquivo e 6 testes passaram |
| Backend HTTP | 1 arquivo e 15 testes passaram |
| Frontend | 4 arquivos e 11 testes passaram |
| Build backend | passou |
| Build frontend | passou |
| Prisma validate | passou |
| Prisma migrate status | banco atualizado |
| Playwright Full Stack | 1 teste passou |
| Busca de credenciais expostas | nenhuma correspondência encontrada |

Total Vitest dos workspaces:

```text
53 testes passaram
```

O build do frontend gerou aproximadamente:

- JavaScript: 548,40 kB antes de gzip;
- JavaScript: 170,36 kB após gzip;
- CSS: 18,96 kB antes de gzip;
- CSS: 4,68 kB após gzip.

O Vite emitiu aviso de chunk JavaScript acima de 500 kB. O build passou, mas code splitting permanece como melhoria futura.

## 41. Segurança final

Foram confirmados:

- `.env` ignorado;
- CORS restrito;
- Helmet ativo;
- SQL não concatenado;
- Prisma parametrizado;
- Zod no backend;
- erros internos sanitizados;
- credenciais somente no servidor;
- frontend sem acesso a banco;
- banco E2E isolado;
- nenhuma senha real encontrada em arquivos versionáveis.

Autenticação, JWT, sessions, Supabase Auth e funcionalidades fora do escopo não foram adicionados.

## 42. Vulnerabilidades e dependências

O frontend não reportou vulnerabilidades durante a instalação.

Na raiz, o npm continua reportando quatro vulnerabilidades transitivas altas trazidas pelo tooling Prisma 7.10.0. `npm audit fix --force` não foi executado porque propõe downgrade incompatível para Prisma 6.19.3.

## 43. Limitação da raiz Git

O repositório Git original permanece com raiz em `use-api`.

Como o frontend, E2E, CI e workspace estão em `CRUD-TCC`, foi tentado mover:

```text
use-api/.git → CRUD-TCC/.git
```

O Windows recusou a operação com erro de acesso negado. Nenhum arquivo Git foi movido e o histórico permaneceu intacto.

Para versionar todo o monorepo, ainda é necessário executar manualmente, com permissão adequada, a elevação do diretório `.git`. Essa operação deve preservar o histórico existente e tornar `CRUD-TCC` a raiz do repositório.

Até que isso seja feito, os arquivos da raiz, o frontend, o E2E e o workflow CI estão fora do alcance do repositório Git que atualmente começa em `use-api`.

## 44. Estrutura final consolidada

```text
CRUD-TCC/
├── .github/
│   └── workflows/
│       └── ci.yml
├── e2e/
│   └── users.spec.ts
├── use-api/
│   ├── prisma/
│   ├── src/
│   ├── tests/
│   ├── README.md
│   └── RELATORIO_PROJETO.md
├── use-web/
│   ├── src/
│   ├── .env.example
│   ├── eslint.config.js
│   ├── package.json
│   ├── README.md
│   └── vite.config.ts
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── README.md
└── RELATORIO_FULLSTACK.md
```

## 45. Comandos finais

Na raiz `CRUD-TCC`:

```bash
npm install
npm run dev
npm test
npm run lint
npm run format:check
npm run build
npm run test:e2e
```

Comandos individuais:

```bash
npm run dev:api
npm run dev:web
npm run test:unit --workspace use-api
npm run test:integration --workspace use-api
npm run test:http --workspace use-api
```

## 46. Conclusão Full Stack

O CRUD-TCC foi evoluído de uma API REST completa para uma aplicação Full Stack funcional.

O resultado possui:

- backend Clean Architecture preservado;
- PostgreSQL e Prisma;
- CORS restrito e Helmet;
- frontend React separado;
- CRUD completo pela interface;
- design responsivo;
- acessibilidade básica;
- loading, vazio, erro, sucesso e confirmação;
- 42 testes backend;
- 11 testes frontend;
- 1 fluxo E2E real;
- builds backend/frontend;
- npm workspaces;
- execução integrada;
- CI com PostgreSQL e Playwright;
- documentação completa;
- nenhuma credencial exposta.

A aplicação está funcional e validada. A única pendência operacional externa ao código é elevar manualmente a raiz Git para `CRUD-TCC`, devido à restrição de acesso do Windows encontrada durante a automação.
