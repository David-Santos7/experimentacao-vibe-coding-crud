# Proposal

## Why

O artefato do TCC não pode ser reproduzido fielmente a partir do Git atual: o backend é um gitlink sem submódulo configurado, e a CI descrita no README está ausente. A estabilização pós-experimento deve preservar evidências, tornar verificável a Clean Architecture e impedir limpeza de banco inadequado, sem uma nova reimplementação.

## What Changes

- P0: capturar baseline e recuperar o histórico referido pelo gitlink antes de propor sua integração ao monorepo; nenhum metadado será apagado enquanto esse histórico não estiver preservado.
- P0: preservar `openspec.md`, localizar a fonte histórica original e versionar explicitamente o drift SQLite/PostgreSQL e a classificação das fases experimentais.
- P0: preparar instalação, geração Prisma, migrations e reprodução em clone limpo, vinculadas ao commit candidato.
- P1: consolidar quatro camadas com mudanças mínimas de caminhos, retirar geração de UUID do caso de uso por injeção de função e automatizar a Dependency Rule.
- P1: rejeitar conexões inseguras antes de qualquer limpeza de testes; dividir E2E, centralizar URLs e documentar `role` como atributo cadastral obrigatório, sem privilégios.
- P1: restaurar CI reproduzível e registrar execução real por SHA, sem presumir sucesso.
- Preservar o CRUD de usuários e PostgreSQL; não incluir a mudança independente `cadastro-funcionarios`.
- Não objetivos: OpenAPI gerado, code splitting, paginação, rate limiting, autenticação/autorização, migração de framework ou banco, redesign de UI e novo rebuild.

## Capabilities

### New Capabilities

- `repository-integrity`: obtenção completa do artefato e preservação dos históricos experimentais.
- `architecture-contract`: limites das quatro camadas e compatibilidade do CRUD mantido.
- `test-reproducibility`: execução segura e reproduzível de testes, configuração E2E e CI.
- `academic-traceability`: distinção entre observações, contrato histórico, alvo proposto e resultados comprovados.

### Modified Capabilities

Nenhuma; não há specs principais existentes.

## Impact

Backend: `domain`, `application`, `presentation`, `infrastructure`, `main`, geração Prisma e imports de testes. Raiz: índice Git após decisão específica, scripts, Playwright, E2E, CI e documentos pequenos em `docs/tcc`. Frontend: somente configuração de execução se necessária, preservando telas e contratos HTTP.

O histórico do backend referido pelo gitlink não está acessível no banco de objetos local e não há `.git` interno observado. Por decisão explícita do usuário em 2026-10-05, a recuperação desse histórico deixa de bloquear correções: preservar o histórico disponível em bundle validado e o snapshot local antes de converter o gitlink, registrando a lacuna sem alegar recuperação integral. O contrato v1 ausente será registrado como fonte não localizada. Publicação remota continua dependente de autorização. Os resultados antigos permanecem alegações documentais até reprodução; o baseline original não será reescrito.
