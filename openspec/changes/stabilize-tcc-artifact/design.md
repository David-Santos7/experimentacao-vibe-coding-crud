# Design

## Context

Ver `proposal.md` para motivação. Auditoria local em 2026-10-05, somente leitura, Node v24.14.1 e npm 11.12.1:

- Git root: raiz deste projeto; HEAD `5baed0a1c5294a457edd40aa294b3c9925a26f92`, branch `main`, tracking `origin/main`.
- Remote observado: `https://github.com/David-Santos7/experimentacao-vibe-coding-crud.git`, diferente da URL escrita em `openspec.md`. Refs remotas não consultadas nesta etapa; não inferir equivalência entre URLs.
- Índice: `160000 36b1496593276508187b1aac1750b62b2b71940a use-api`. Não há `.gitmodules` configurando esse caminho; `git submodule status` falha. Não foi encontrado `use-api/.git`; Git executado ali retorna o root e HEAD do pai. `git cat-file -t` do commit do gitlink falha: objeto indisponível localmente.
- Histórico local do pai contém `189df1c` e `5baed0a`. `openspec.md`, `.agents/` e `openspec/` estão não rastreados; isso não representa autorização para descartá-los.
- README afirma CI em `.github/workflows/ci.yml`, ausente no checkout e na árvore HEAD. Relatórios alegam testes aprovados, ainda não reproduzidos nesta proposta.
- `User` contém validações de nome, e-mail normalizado e `USER`/`ADMIN`; casos de uso importam domínio e porta de repositório, sem Express/Prisma. `CreateUser` importa `node:crypto`; geração de IDs está acoplada à plataforma. Controllers usam Express/Zod, repositório Prisma converte registros para entidades, `main` compõe dependências.
- Integração e HTTP verificam apenas presença de `TEST_DATABASE_URL` antes de `deleteMany()` sem filtro. E2E usa um fluxo único com URLs repetidas e limpeza por prefixo. Configuração já desabilita paralelismo entre arquivos de testes de API.
- Prisma usa PostgreSQL e gera em `src/generated/prisma`; `prisma7.config.ts` é um nome não padrão que os comandos de reprodução devem indicar explicitamente.
- `cadastro-funcionarios` é proposta independente, ainda não implementada; não alterar seus artefatos nem adicionar funcionários neste trabalho.

O contrato fornecido descreve responsabilidades das quatro camadas, mas não exige nomes literais de diretórios. Preservar `domain`/`application` e organizar os detalhes externos sem uma renomeação integral.

## Goals / Non-Goals

**Goals:** tornar o artefato auditável, testar as fronteiras arquiteturais e preservar contratos HTTP, regras do CRUD, stack e evidências históricas. Cada etapa terá gates observáveis.

**Non-Goals:** novo rebuild, OpenAPI gerado, code splitting, paginação, rate limiting, autenticação/autorização, substituição de framework/banco, redesign de UI e expansão funcional.

## Decisions

### Revisão autorizada em 2026-10-05

O usuário determinou executar as diretrizes mesmo superando os bloqueios históricos. Esta decisão substitui os gates de recuperação obrigatória e de localização obrigatória de v1 abaixo: preservar bundle verificado do pai e snapshot local; converter apenas o gitlink do índice, sem remover arquivos ou metadados; registrar o commit do backend como indisponível. Manter `openspec.md` intacto e documentar v1 como narrativa fornecida, sem inventar original. Não exigir nova confirmação para correções locais já autorizadas. Permanecem obrigatórias segurança do banco e veracidade de resultados. A estratégia de integração de histórico recuperado só será aplicável se uma fonte surgir posteriormente; não bloqueia as correções atuais.

### 1. Preservação antes de reparação Git

Gate obrigatório: recuperar o commit/histórico `36b1496...` de refs remotas ou backup fornecido, confirmar proveniência e registrar estado. Enquanto não houver acesso, nenhuma conversão do gitlink será executada. No apply, consultar refs sem alterar branch e solicitar a fonte se a recuperação falhar. Capturar SHA, status, hashes do contrato e lockfiles, versões e datas em `docs/tcc/baseline.md`. Bundle do pai e do histórico recuperado, fora do repositório, deverá ser verificado. Tag somente com estado limpo e autorização específica.

Estratégia escolhida: ensaiar importação não squashed do histórico recuperado sob `use-api/` em clone temporário, comparar os arquivos presentes com o snapshot recuperado e preservar diferenças locais antes de qualquer integração. Exigir plano concreto aprovado antes de afetar a branch principal. Se a importação preservar hashes originais, preferi-la; qualquer transformação de caminhos exige mapa dos hashes e retenção do histórico original no bundle. Não usar force-push. Apagar metadados e adicionar arquivos isoladamente foi rejeitado porque não preserva a proveniência. Manter um submódulo foi rejeitado para o alvo porque o contrato exige clone comum contendo todos os workspaces.

### 2. Contrato e classificação científica

Manter `openspec.md` byte a byte como fonte fornecida, com hash. Sua narrativa sobre SQLite não prova que o contrato original v1 foi localizado: localizar documento em histórico ou backup e registrar fonte, sem reconstruí-lo por memória. Ausência impede afirmar preservação de v1 e bloqueia esse gate. Criar contrato v2 em `docs/tcc/architecture-contract-v2.md` e decisão em `contract-drift.md`, conservando PostgreSQL e a Dependency Rule. Registrar diferença entre URL indicada e remote observado.

Em `change-classification.md`, vincular fases a diffs/commits: mudança estrutural que preserva comportamento é refatoração; substituição substancial é rebuild; capacidade adicional é extensão; eliminação de defeito é correção. Classificações antigas permanecem pendentes se faltarem fontes. Esta mudança é estabilização pós-experimento e não altera os resultados originais.

### 3. Quatro camadas com refatoração pequena

Estrutura proposta para `use-api/src`:

```text
domain/entities/                 # Entidades, preservar User
application/use-cases/           # Casos de Uso, preservar classes existentes
application/repositories/       # Porta UserRepository, preservar
application/errors/             # Erros da aplicação, preservar
adapters/http/                   # Adaptadores HTTP, mover presentation/http
adapters/persistence/prisma/     # PrismaUserRepository e conversão de registros
infrastructure/database/prisma/ # Drivers: client, pool e conexão
infrastructure/generated/prisma/# Cliente gerado, atualizar generator
main/                           # Drivers: app, servers e composition root
```

PrismaUserRepository é adaptador de persistência tecnológico: pode importar tipos/erros do SDK gerado, mas recebe client por construtor e não importa singleton, ambiente nem composição. A regra estrita incide nas camadas internas; permitir dependência tecnológica limitada do adaptador evita criar um segundo repositório genérico sem benefício. Controllers são adaptadores HTTP que podem conhecer Express/Zod; não importam persistência ou drivers. `main` é o ponto externo autorizado a ligar todas as dependências. `domain` não importa outras camadas; `application` importa apenas domínio e seus contratos. Não permitir dependências de `domain`/`application` para adapters, infrastructure, main, SDK gerado ou pacotes externos.

Adicionar `IdGenerator = () => string` como contrato em application e injetar em CreateUser; implementação `randomUUID` no composition root. A seleção da estratégia UUID não exige fábrica abstrata ou container de DI. Manter datas como valores JavaScript e a lógica existente; não criar abstração de relógio sem necessidade demonstrada.

Atualizar imports `.js`, testes, saída gerada e caminhos de build em cada movimento. Não mudar rotas `/users`, códigos HTTP, apresentação pública, semântica de PATCH, ordenação ou unicidade do e-mail. `role` é obrigatório na criação, opcional no PATCH, enum persistido, sem default no schema Prisma e sem autorização. Não introduzir default USER como correção cosmética.

### 4. Teste arquitetural de baixo custo

Usar TypeScript já instalado e Vitest: percorrer arquivos de produção, extrair imports, exports, import-equals e imports dinâmicos/requires literais pela AST, resolver destinos com opções do tsconfig e aplicar matriz de fronteiras. Checar `import type`, reexports, caminhos `.js` resolvidos a `.ts`, aliases e travessia transitiva para impedir bypass por barrel. Import dinâmico não literal em camada interna deve falhar por impossibilidade de verificar. Excluir arquivos gerados da análise de autoria, mas proibir sua importação nas camadas internas. Detectar ciclos entre camadas e recusar diretório interno vazio para evitar teste verde sem cobertura.

Adicionar `test:architecture` no workspace e na raiz e executar antes de testes que precisam de banco na CI. Demonstrar eficácia em cópia temporária com import de Express, SDK gerado, barrel externo e `import type` proibido; registrar falha e remoção das violações. Regex simples foi rejeitada por não resolver aliases/reexports; ferramenta nova de grafo não é necessária se o teste AST cobrir esses casos.

### 5. Guard de banco, E2E e reprodução

Função externa compartilhada valida URL PostgreSQL, nome exato permitido (`use_api_test`), ambiente de teste e diferença do destino de desenvolvimento/produção, comparando host, porta normalizada e database independentemente de credenciais. Ausência/URL inválida/igualdade/ambiente inadequado devem falhar fechados antes de criar client destrutivo, migrar banco de teste ou limpar dados. E2E deve validar antes de substituir DATABASE_URL, preservando a referência de desenvolvimento para comparação. Não imprimir credenciais nos erros. Guard também nos hooks beforeEach/afterAll e scripts de setup; unit tests do guard não conectam ao banco. Manter suíte API sequencial e E2E com um worker enquanto houver banco compartilhado.

Centralizar API/web URLs em módulo de configuração E2E consumido por Playwright e fixture request; alinhar VITE_API_URL, healthcheck e PORT. Separar criação/consulta, edição, conflito, exclusão/cancelamento e persistência; cada teste semeia registros próprios com identificador único, limpa apenas IDs criados em finally/afterEach e não remove todo prefixo global de outra execução.

Primeiro reproduzir o baseline reparado com a proteção de banco ativa, antes de refatorações P1; essa antecipação é dependência de segurança comprovada pelos deleteMany observados. Repetir validação final após P1. Clone temporário do commit candidato, sem node_modules/build/.env herdados; PostgreSQL descartável, bancos separados e credenciais de teste locais. Usar lockfile via npm ci, geração/migrations Prisma com `--config prisma7.config.ts` no workspace e env explícito. Comandos destrutivos de migration/reset somente depois do guard, sem reset em banco existente.

Registrar format:check, lint, TypeScript API, TypeScript web com projeto app/node conforme scripts reais (tsconfig raiz web com references não basta sozinho), architecture, testes, build e Playwright. Restaurar workflow Node 24/PostgreSQL 18 com setup documentado e browser Playwright explícito, sem exigir Chrome do sistema. Registrar falhas e versões reais; não executar limpeza de banco nesta proposta.

`docs/tcc/reproducibility.md` guarda SHA, ambiente, comandos, resultados e durações disponíveis. `ci-evidence.md` guarda URL/run ID/SHA/data/jobs reais; sem acesso remoto, escrever NÃO VERIFICADO EM CI e manter tarefa aberta. Arquivo de workflow e teste local não equivalem a CI aprovada.

## Risks / Trade-offs

- [Histórico original inacessível] → Bloquear reparação até recuperar fonte; não fabricar continuidade científica.
- [Arquivos locais do backend fora do índice] → Snapshot/hash/backup antes do ensaio; comparar e preservar diferenças.
- [Contrato v1 não localizado] → Preservar fonte fornecida e registrar lacuna, sem inventar documento histórico.
- [Mudanças de paths quebram execução] → Movimentos pequenos, regenerar Prisma e verificar unit/HTTP/build em cada fronteira.
- [Guard confunde URLs equivalentes] → Comparar destino normalizado e testar credenciais diferentes apontando ao mesmo banco.
- [Dependência remota/DB/browser indisponível] → Relatar resultado não verificado e manter gate aberto.

## Migration Plan

1. Revisar os artefatos e iniciar apply explicitamente; revalidar auditoria e recuperar fontes históricas.
2. Capturar baseline e backups verificados; aprovar ensaio de integração Git antes de alterar branch.
3. Versionar contrato/classificação, instalar guard mínimo e reproduzir checkout reparado em clone limpo.
4. Mover adaptadores e geração, injetar ID e verificar invariantes; adicionar teste arquitetural, dividir E2E e documentar role.
5. Executar validação final de clone limpo e CI por SHA; atualizar evidências e só então considerar archive.

Rollback: trabalhar em branch isolada; conservar baseline, bundles e snapshots fora da árvore. Reverter commits de correção sem reescrever baseline; não desfazer migrations de dados pois esta mudança não prevê alteração de modelo. Se integração Git falhar, descartar somente o ensaio temporário após confirmar backups, mantendo branch principal intacta. Não excluir metadados originais nem usar reset --hard para resolver divergências.
