# Reprodução — estabilização pós-experimento

## Setup

Requisitos: Node 24, PostgreSQL 18 descartável e browser Playwright. Criar bancos use_api_dev, use_api_test e use_api_shadow no serviço descartável, como no workflow CI. Configurar NODE_ENV=test, DATABASE_URL para use_api_dev, TEST_DATABASE_URL para use_api_test e SHADOW_DATABASE_URL para use_api_shadow. Não usar banco existente nem URLs com query de schema; o guard recusa destinos ambíguos. E2E_API_URL/E2E_WEB_URL permitem portas livres (padrão 3334/5173); servidor E2E valida destino antes de substituir DATABASE_URL.

```text
npm ci
npm exec --workspace use-api -- prisma generate --config prisma7.config.ts
npm run db:test:setup --workspace use-api
npm run format:check
npm run lint
npm run typecheck --workspaces
npm run test:architecture
npm test
npm run build
npm exec -- playwright install chromium
npm run test:e2e
```

CI instala Chromium com --with-deps e o seleciona. O padrão local também é o Chromium do Playwright; E2E_BROWSER_CHANNEL=chrome permite optar explicitamente por Chrome instalado. As primeiras execuções Windows usaram Chrome instalado; a validação final usa o browser baixado em diretório temporário próprio. Nunca fazer reset contra banco existente. Setup testa destino antes de migrate deploy.

## Fonte e ambiente

Baseline original: `5baed0a1c5294a457edd40aa294b3c9925a26f92`; backend ausente em clone comum por gitlink. Não é o artefato testado após correção.

Candidato temporário: `a07bcaedb8be31feb61cfc96a3f95c3b2cc163f7`. Construído em clone local do pai, adicionando fontes corrigidos sem node_modules, geração, dist ou .env herdados. npm ci instalou dependências novas. Não publicado; não é o HEAD principal. Pasta: `C:/Users/Highlander/AppData/Local/Temp/tcc-clean-149dd56759c84bb5b1aa5a16f923b0aa`.

Node v24.14.1, npm 11.12.1. PostgreSQL 18 em cluster descartável, apenas 127.0.0.1:55439, pasta `C:/Users/Highlander/AppData/Local/Temp/tcc-pg-bf2d3f2cfd4c41789cc9f99528453383`. Docker indisponível; usado initdb/pg_ctl. Nenhum banco existente foi limpo.

## Verificações locais antes do candidato

| Comando/validação | Resultado |
| --- | --- |
| Prisma generate --config prisma7.config.ts | Passou, Prisma 7.10.0 no novo diretório |
| db:test:setup | Migrations passaram em use_api_test isolado |
| test:architecture | 6 passaram, incluindo violações controladas em árvore temporária removida |
| npm test | API 57 testes/10 arquivos; web 11 testes/4 arquivos passaram |
| typecheck --workspaces | API e projetos web app/node passaram |
| format:check / lint | Passaram nos dois workspaces |
| build | API/web passaram; aviso chunk >500 kB permanece P2 |
| test:e2e em portas 55334/55173 | 5 cenários passaram; teardown sandbox ficou preso, comando integral não aprovado |

Falhas registradas: npm exec tsc tentou buscar pacote errado e falhou por rede, substituído por scripts typecheck com binário do workspace; porta 5173 ocupada, preservado servidor existente e usadas portas alternativas; formatter web chamado por use-api não encontrou plugin, corrigida execução no workspace web.

npm ci no candidato instalou 696 pacotes, com 4 alertas de severidade alta; não executado audit fix --force ou upgrade incompatível automático. Gate CI permanece NÃO VERIFICADO EM CI. Registrar resultados integrais do candidato após execução; não inferir aprovação de comandos em andamento.

## Resultados do candidato temporário

Em `a07bcaedb8be31feb61cfc96a3f95c3b2cc163f7`: geração, migrations, lint, tipos API/web, 57 testes API, 11 testes web e build passaram. O format:check detectou apenas formatação de package.json da API. Corrigida em `7d6f303b91fcef8a9562976ddb41d36ac8910551`; format:check e 6 testes arquiteturais passaram na nova revisão. Nenhum código de produção foi alterado entre essas duas revisões; apenas espaços/indentação do package.json.

E2E no candidato, fora do sandbox Windows, portas 55335/55174: 5 passed (19.7s), exit code 0, encerramento normal. Os cinco cenários também foram executados individualmente pela suíte com dados próprios, sem dependência de outro cenário. Duração Vitest: API 12.28s, web 34.53s. Build web passou com aviso de chunk >500 kB; não aplicar P2 de code splitting.

Os servidores E2E sob sandbox deixaram teardown pendente, embora testes tenham passado; essa execução não é usada como prova integral. A repetição fora do sandbox é a evidência de conclusão. CI remota continua não verificada.

O primeiro clone real do commit `3472194539bc7e128e22717e9a96eced22cea480` instalou dependências com cache novo e executou geração/migrations, mas format:check falhou em 38 arquivos de cada workspace: checkout Windows usou CRLF enquanto Prettier exigia LF. A correção é `.gitattributes` com eol=lf, excetuando openspec.md como conteúdo binário preservado. A comparação exata de nome do banco também foi endurecida com teste para caminho composto. Esses ajustes exigem validação do commit atualizado; o clone anterior não é declarado aprovado.
