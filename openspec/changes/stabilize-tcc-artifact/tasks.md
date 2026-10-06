# Tasks

Implementação iniciada. Revisão autorizada pelo usuário em 2026-10-05: indisponibilidade histórica não bloqueia correções locais após backup; não substituir lacunas por alegações. Tarefas históricas não executáveis permanecem abertas como limitações, sem impedir P1. Referências abaixo a parar/solicitar aprovação para gates históricos são substituídas por esta decisão explícita e pela revisão do design.

## 1. P0 — Revalidar auditoria e preservar baseline

- [x] 1.1 Revalidar root, HEAD, status, índice 160000, metadados internos e refs remotas; registrar saídas em `docs/tcc/baseline.md`, inclusive diferença das URLs, e verificar que nenhum arquivo do usuário foi descartado.
- [ ] 1.2 Recuperar e verificar histórico do backend referido por `36b1496593276508187b1aac1750b62b2b71940a`; comprovar objeto e proveniência com Git. Se inacessível, parar reparação e solicitar fonte, mantendo tarefa aberta.
- [x] 1.3 Capturar hashes/snapshot dos arquivos locais, contratos e lockfiles, versões, status e data; criar bundles fora da árvore e verificar com `git bundle verify`. Registrar 53 testes Vitest alegados no relatório separadamente de resultados reproduzidos.
- [ ] 1.4 Localizar contrato original v1 em fonte verificável, preservando bytes/hash; registrar origem. Ausência mantém gate de contrato aberto e exige fonte do usuário, sem reconstrução por memória.

## 2. P0 — Reparar aquisição preservando histórico

- [x] 2.1 Ensaiar o snapshot corrigido em clone temporário, preservando bundle e cópia dos fontes locais; registrar histórico indisponível e estratégia de rollback conforme exceção autorizada, sem alegar importação de histórico não recuperado.
- [ ] 2.2 Consolidar snapshot corrigido em branch local isolada, sem force-push ou alteração do histórico disponível; verificar backup, ausência de gitlink e clone comum contendo ambos os workspaces, registrando exceção histórica autorizada.
- [ ] 2.3 Documentar aquisição e recuperação em baseline; executar npm ci no clone reparado e registrar resultado e SHA. Criar tag de baseline somente se estado limpo e autorizado.

## 3. P0 — Versionar contrato e classificação

- [ ] 3.1 Versionar fonte fornecida sem alterá-la e contrato v2 em `docs/tcc/architecture-contract-v2.md`; verificar hash preservado e distinguir histórico, observado e alvo, registrando v1 independente como não localizado conforme exceção autorizada.
- [x] 3.2 Criar `docs/tcc/contract-drift.md` registrando SQLite/PostgreSQL, role e URL remota, decisão de manter stack e matriz de dependências; revisar contra os arquivos e fontes reais.
- [x] 3.3 Criar `docs/tcc/change-classification.md` com referências a commits/diffs para rebuild, refatoração, extensão e correção; marcar fases sem fonte como pendentes e identificar esta estabilização como pós-experimento.

## 4. Pré-requisito de segurança para reprodução P0

- [x] 4.1 Implementar guard compartilhado externo com allowlist `use_api_test`, URL válida, ambiente explícito e comparação normalizada com destinos de desenvolvimento/produção; verificar unitariamente URL ausente/inválida, banco errado, ambiente errado e credenciais distintas para o mesmo destino, sem conexão real.
- [x] 4.2 Aplicar guard antes de cleanup em integração/HTTP, antes da substituição de DATABASE_URL no servidor E2E e antes de migrations/setup de teste; comprovar com doubles que operação destrutiva não é chamada em configuração insegura e documentar setup seguro.

## 5. P0 — Primeira reprodução limpa

- [ ] 5.1 Documentar e preparar PostgreSQL descartável, env de exemplo sem segredo, npm ci, geração e migrations com `prisma7.config.ts` explícito e browser Playwright; verificar que clone limpo executa setup sem arquivos herdados.
- [ ] 5.2 Executar formatação, lint, TypeScript API/web, testes, build e E2E no clone reparado com guard ativo; registrar comandos/SHA/ambiente/resultados em `docs/tcc/reproducibility.md`, mantendo falhas abertas e distinguindo baseline original do baseline reparado.

## 6. P1 — Consolidar camadas e testar dependências

- [x] 6.1 Mover `presentation/http` para `adapters/http` e PrismaUserRepository para `adapters/persistence/prisma`, preservando lógica; atualizar imports e verificar unitários, HTTP, TypeScript e build com banco seguro, documentando a correspondência das quatro camadas.
- [x] 6.2 Mover saída Prisma para `infrastructure/generated/prisma` e atualizar generator/imports/ignores necessários; regenerar em clone limpo e verificar build e integração sem alterar modelo nem migrations de dados.
- [x] 6.3 Injetar contrato de função geradora de ID em CreateUser, implementado via randomUUID no composition root; verificar teste com ID determinístico, funcionamento da composição e ausência de node:crypto na application.
- [x] 6.4 Adicionar teste AST de dependências e scripts `test:architecture` na raiz/workspace; verificar imports de tipos, reexports, aliases, .js para .ts, imports dinâmicos, fronteiras transitivas, ciclos e camadas vazias, sem exigir banco.
- [x] 6.5 Demonstrar falhas com violações controladas em cópia temporária para Express, SDK gerado, tipo e barrel externo; registrar resultados e verificar que nenhuma violação artificial permaneceu, documentando execução do teste.

## 7. P1 — Refatorar E2E e documentar role

- [x] 7.1 Centralizar API/web URLs em configuração compartilhada por Playwright e fixture, alinhando PORT, VITE_API_URL e healthcheck; verificar que specs não contêm URLs repetidas e destino alternativo é propagado corretamente.
- [x] 7.2 Separar cenários independentes de criação/consulta, edição, conflito, exclusão/cancelamento e persistência; usar dados próprios por cenário e cleanup por IDs em afterEach/finally com guard, manter um worker e verificar execução individual e suíte completa.
- [x] 7.3 Documentar USER/ADMIN, ausência de default, obrigatoriedade na criação, PATCH parcial, persistência/exposição e ausência de autorização; conferir com schemas/entidade/Prisma e testes HTTP existentes, sem acrescentar privilégios.

## 8. P1 — CI e verificação integrada

- [x] 8.1 Restaurar `.github/workflows/ci.yml` com Node 24, PostgreSQL 18 descartável, geração/migrations seguras, browser e teste arquitetural antes de testes com DB; verificar correspondência com receita local e documentar execução.
- [ ] 8.2 Executar em clone limpo do commit candidato npm ci, setup Prisma protegido, format:check, lint, TypeScript API e projetos web app/node, test:architecture, npm test, build e test:e2e; registrar SHA e cada resultado real, corrigindo regressões sem ampliar escopo.
- [ ] 8.3 Após autorização de publicação necessária, executar CI para o SHA exato e registrar run ID/URL/data/jobs/status em `docs/tcc/ci-evidence.md`; ausência de acesso mantém NÃO VERIFICADO EM CI e checkbox aberto.

## 9. Gates acadêmicos e encerramento

- [ ] 9.1 Conferir gates de repositório, contrato, reprodução, arquitetura, segurança e CI com evidências por commit; atualizar documentos pequenos com limitações, sem copiar grandes logs nem atribuir resultados corrigidos ao experimento original.
- [ ] 9.2 Executar `openspec validate stabilize-tcc-artifact --strict` e revisar correspondência de cada requisito/cenário com resultado verificável; manter tarefas não comprovadas abertas.
- [ ] 9.3 Somente após todos os gates obrigatórios comprovados e solicitação de encerramento, iniciar skill de archive; verificar que specs sincronizadas e registro arquivado conservam evidências e referências históricas.
