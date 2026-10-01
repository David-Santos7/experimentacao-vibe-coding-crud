# Relatório Full Stack — CRUD-TCC

## 1. Estado inicial

O projeto iniciou esta fase com um backend completo em `use-api`, seguindo Clean Architecture, integrado ao PostgreSQL e com 40 testes. A raiz `CRUD-TCC` ainda não possuía frontend, workspaces, E2E, CI ou documentação integrada.

O checkpoint inicial foi executado antes das alterações:

- build do backend: passou;
- 40 testes: passaram;
- testes unitários, integração e HTTP: passaram;
- TypeScript e ESLint: passaram;
- Prisma schema: válido;
- migration: sincronizada.

## 2. Ferramentas adicionadas

### Backend

- `cors` e `@types/cors`;
- `helmet`;
- `prettier`;
- scripts `format` e `format:check`.

### Frontend

- React 19 e TypeScript;
- Vite;
- React Router;
- React Hook Form;
- Zod e `@hookform/resolvers`;
- Tailwind CSS;
- componentes UI no padrão shadcn/ui;
- Radix Dialog;
- Lucide React;
- Sonner;
- Vitest, Testing Library, jest-dom, user-event e jsdom;
- ESLint e Prettier com plugin Tailwind.

### Integração

- npm workspaces;
- Concurrently;
- Playwright;
- GitHub Actions.

Não foram adicionados Redux, Axios, TanStack Query, Prisma no frontend ou ferramentas complexas de monorepo.

## 3. Backend e integração HTTP

O backend existente foi preservado. Foram adicionados ao `app.ts`, antes das rotas:

- Helmet para headers defensivos;
- CORS restrito ao valor de `FRONTEND_URL`.

O wildcard `*` não foi utilizado. O ambiente local foi padronizado em:

- API: `http://localhost:3333`;
- frontend: `http://localhost:5173`.

Foram incluídos dois testes HTTP adicionais para:

- headers CORS e Helmet;
- preflight CORS.

O total do backend passou de 40 para 42 testes.

## 4. Frontend criado

Foi criado `use-web`, separado do backend e organizado por feature:

```text
use-web/src/
├── app/
│   ├── App.tsx
│   └── router.tsx
├── components/ui/
├── features/users/
│   ├── api/
│   ├── components/
│   ├── pages/
│   ├── schemas/
│   └── types/
├── lib/
├── styles/
├── test/
└── main.tsx
```

Rotas implementadas:

- `/` redireciona para `/users`;
- `/users` lista usuários;
- `/users/new` cria usuário;
- `/users/:id` mostra detalhes;
- `/users/:id/edit` edita usuário.

## 5. Contrato e cliente HTTP

Foram definidos no frontend os tipos do contrato HTTP:

- `UserRole`;
- `User`;
- `CreateUserInput`;
- `UpdateUserInput`;
- `ApiErrorBody`.

O frontend não importa código interno do backend.

`src/lib/api.ts` centraliza:

- `VITE_API_URL`;
- fetch nativo;
- JSON;
- resposta vazia 204;
- conversão de erros públicos em `ApiError`;
- fallback sanitizado para respostas inesperadas.

`users.api.ts` contém todas as operações:

- list;
- get;
- create;
- update;
- delete.

## 6. Interface e experiência

A interface oferece:

- cabeçalho e hierarquia visual consistente;
- tabela para desktop;
- cards para mobile;
- criação, consulta, edição e exclusão;
- badges para roles;
- loading com skeleton;
- estado vazio;
- estado de erro e tentativa novamente;
- feedback de sucesso/erro por toast;
- botões desabilitados durante submissão;
- confirmação antes da exclusão.

O formulário usa React Hook Form, Zod e resolver. As mensagens aparecem próximas aos campos, e o backend continua sendo a autoridade das regras de negócio.

## 7. Acessibilidade

Foram implementados:

- HTML semântico;
- labels associadas aos campos;
- `aria-describedby` para mensagens de validação;
- `aria-invalid`;
- alertas com `role="alert"`;
- foco visível;
- áreas de toque adequadas;
- diálogo Radix com foco e teclado;
- labels acessíveis para ações por ícone;
- suporte a `prefers-reduced-motion`.

## 8. Responsividade

A UI foi construída mobile first, com largura mínima suportada de 320px. A listagem troca cards por tabela no breakpoint de desktop, evitando overflow horizontal e mantendo ações sempre disponíveis.

Breakpoints contemplados pelo layout fluido:

- 320px;
- 375px;
- 768px;
- 1024px;
- 1440px.

## 9. Testes frontend

Foram criados 11 testes em 4 arquivos, cobrindo:

- loading da lista;
- lista preenchida;
- estado vazio;
- erro de carregamento;
- validações do formulário;
- submissão válida;
- bloqueio durante submissão;
- criação com sucesso;
- conflito 409;
- carregamento e edição;
- erro de edição/carregamento;
- confirmação, cancelamento e sucesso de exclusão.

Resultado final:

```text
Test Files: 4 passed
Tests: 11 passed
```

## 10. Testes E2E

Foi criado um fluxo Playwright contra backend e frontend reais. O servidor E2E troca `DATABASE_URL` por `TEST_DATABASE_URL` antes de importar a aplicação, garantindo uso de `use_api_test`.

O cenário validou:

1. abertura da lista;
2. criação de USER;
3. visualização de detalhes;
4. edição;
5. criação de ADMIN;
6. conflito de e-mail duplicado;
7. exclusão confirmada;
8. refresh;
9. persistência no PostgreSQL.

O cenário limpa somente registros com prefixo `e2e-`. Para não conflitar com um servidor do desenvolvedor em 3333, o Playwright usa a porta isolada 3334.

Resultado executado:

```text
1 passed
```

O download do Chromium Playwright sofreu timeout no CDN local. O teste foi executado com o Google Chrome já instalado. No CI, o Chromium é instalado explicitamente.

## 11. Workspaces e execução

A raiz recebeu npm workspaces para:

- `use-api`;
- `use-web`.

Scripts integrados:

- `npm run dev`;
- `npm run dev:api`;
- `npm run dev:web`;
- `npm test`;
- `npm run lint`;
- `npm run format:check`;
- `npm run build`;
- `npm run test:e2e`.

## 12. CI

Foi criado `.github/workflows/ci.yml` com:

- Node.js 24;
- PostgreSQL 18 service;
- bancos de desenvolvimento, teste e shadow;
- instalação via `npm ci`;
- Prisma generate e migrations;
- Prettier;
- ESLint;
- TypeScript backend/frontend;
- testes backend/frontend;
- builds;
- instalação Chromium;
- Playwright E2E;
- upload do relatório Playwright em falhas.

As credenciais do workflow são descartáveis e não correspondem ao ambiente local.

## 13. Resultados finais

| Validação | Resultado |
|---|---|
| Prettier backend/frontend | passou |
| ESLint backend/frontend | passou |
| TypeScript backend | passou |
| TypeScript frontend | passou |
| Backend total | 8 arquivos, 42 testes passaram |
| Backend unitário | 6 arquivos, 21 testes passaram |
| Backend integração | 1 arquivo, 6 testes passaram |
| Backend HTTP | 1 arquivo, 15 testes passaram |
| Frontend | 4 arquivos, 11 testes passaram |
| Build backend | passou |
| Build frontend | passou |
| Prisma validate | passou |
| Prisma migrate status | atualizado |
| Playwright Full Stack | 1 teste passou |

Total Vitest nos workspaces: 53 testes.

## 14. Segurança

- CORS restrito;
- Helmet ativo;
- `.env` fora do Git;
- credenciais apenas no backend;
- Prisma parametrizado;
- validação Zod no backend;
- validação frontend para UX;
- erros sanitizados;
- E2E isolado no banco de teste;
- ausência de autenticação mantida conforme escopo.

## 15. Build

Os dois builds passaram. O frontend gerou bundle JavaScript de aproximadamente 548 kB antes de gzip e 170 kB após gzip. O Vite emitiu aviso de chunk acima de 500 kB; isso não impede o build e está registrado como possível melhoria futura por code splitting.

## 16. Estrutura final

```text
CRUD-TCC/
├── .github/workflows/ci.yml
├── e2e/users.spec.ts
├── use-api/
├── use-web/
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── README.md
└── RELATORIO_FULLSTACK.md
```

## 17. Limitações

- não há autenticação/autorização;
- não há paginação ou rate limiting;
- o frontend ainda pode receber code splitting;
- permanecem vulnerabilidades transitivas conhecidas do tooling Prisma;
- o CDN do Playwright apresentou timeout durante download local;
- a raiz Git original permanece em `use-api`: a tentativa de elevá-la para `CRUD-TCC` foi bloqueada pelo Windows com acesso negado. Para versionar frontend, E2E e CI no mesmo repositório, é necessário mover manualmente `use-api/.git` para `CRUD-TCC/.git` com permissões adequadas, preservando o histórico.

## 18. Comandos

```bash
npm install
npm run dev
npm test
npm run lint
npm run format:check
npm run build
npm run test:e2e
```

## 19. Conclusão

A aplicação está funcional como CRUD Full Stack. Backend e frontend estão integrados via contrato HTTP, com segurança básica, interface responsiva, testes de componente, fluxo E2E real, workspace, CI e documentação. A única pendência operacional externa ao código é elevar a raiz Git, impedida pelas permissões do Windows nesta execução.
