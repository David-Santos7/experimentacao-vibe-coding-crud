# Contrato arquitetural v2 — estabilização pós-experimento

Fonte fornecida: `openspec.md`, preservado sem alteração. O original histórico v1 independente não foi localizado; referências a SQLite são a narrativa dessa fonte, não uma reconstrução do original.

Stack mantida: TypeScript/Node.js, Express, Prisma/PostgreSQL, React/Vite. Não há migração para SQLite, nova reimplementação ou ampliação funcional.

| Camada | Diretórios | Dependências permitidas |
| --- | --- | --- |
| Entidades | `use-api/src/domain` | Apenas domínio e valores nativos JavaScript |
| Casos de Uso | `use-api/src/application` | Domínio e contratos da aplicação |
| Adaptadores de Interface | `use-api/src/adapters` | Camadas internas; Express/Zod no HTTP e SDK Prisma na persistência |
| Frameworks/Drivers | `infrastructure`, `main` | Drivers implementam detalhes externos; `main` compõe adapters e núcleo |

Adaptadores recebem client e casos de uso por injeção; não dependem do singleton de conexão nem de `main`. SDK gerado é dependência tecnológica permitida somente fora do núcleo. A geração UUID é fornecida por função ao caso de uso, implementada com `randomUUID` no composition root. Domínio/aplicação não importam Express, Prisma, pg, drivers ou adaptadores, nem por `import type`/barrel. `npm run test:architecture` verifica a regra e demonstra violações em árvore temporária.

CRUD público mantido: `/users`, nome/e-mail normalizados, unicidade de e-mail, PATCH parcial e códigos 201/200/204/400/404/409. `role` aceita USER/ADMIN, é obrigatório na criação, opcional no PATCH e não possui default na persistência. Aparece no JSON público; ADMIN não concede privilégios. Não existe autenticação/autorização neste escopo.

O formulário React pré-seleciona USER para criação; isso é um default da interface, não um default do domínio/HTTP/banco. O cliente HTTP deve continuar enviando role explicitamente.

Não objetivos: OpenAPI gerado, code splitting, paginação, rate limiting, autorização, troca de stack, redesign e novo rebuild.
