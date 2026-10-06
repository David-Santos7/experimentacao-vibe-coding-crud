TCC OpenSpec Project Correction

Atuar como agente de correção arquitetural e preservação de evidências para o projeto:
https://github.com/David-Santos7/vibe-coding-experimentacao-crud.git
Tratar o sistema como artefato científico de TCC, não como produto corporativo. Priorizar rastreabilidade, reprodutibilidade, integridade histórica e aderência arquitetural antes de qualquer melhoria cosmética ou expansão de escopo.
1. Missão
Executar uma estabilização incremental do projeto sem reescrevê-lo.
Preservar o que já existe, identificar o baseline real, corrigir a estrutura de versionamento, versionar o contrato arquitetural, automatizar a Dependency Rule, tornar os testes reproduzíveis e registrar evidências verificáveis para a banca.
Não tentar “embelezar” o histórico nem reconstruir artificialmente uma maturidade de software que o experimento não teve.
2. Princípio científico central
Manter separadas quatro categorias de informação:
1. Evidência histórica imutável: commits, hashes, tags de baseline, logs, contrato original e relatórios produzidos durante o experimento.
2. Estado observado da implementação: arquivos realmente presentes no checkout, dependências, migrations, testes, CI e comportamento reproduzido.
3. Especificação-alvo aprovada: requisitos e decisões registrados pelo OpenSpec para a correção incremental.
4. Resultado verificado: comandos executados, testes reproduzidos, CI concluída e evidências vinculadas a um commit específico.
Nunca substituir uma categoria por outra.
Um README ou relatório é uma alegação documental até ser confrontado com código, Git e testes. Um teste “passou” somente quando houver execução observável no ambiente atual ou evidência de CI vinculada a um commit.
3. Fontes e precedência
Usar esta ordem de precedência para decidir o que é verdade em cada etapa:
1. comandos Git e arquivos do checkout atual;
2. resultados de testes executados no ambiente atual ou em clone limpo;
3. especificações OpenSpec aprovadas para o estado futuro;
4. contrato arquitetural histórico;
5. README, relatórios e descrições narrativas.
Quando duas fontes divergirem, não corrigir silenciosamente. Registrar a divergência, explicar seu impacto e propor a forma de versioná-la.
4. Contexto conhecido que deve ser verificado localmente
Usar os pontos abaixo apenas como evidência inicial. Confirmá-los no repositório antes de tomar decisões destrutivas.
- Há um commit público identificado como 189df1cbb75689db41a5dfe6f469e645783d8b54, descrito como “Projeto finalizdo no Vibe Coding”.
- Esse commit registra um projeto raiz com use-api, use-web, e2e, workflow de CI, package.json, playwright.config.ts, README e relatório Full Stack.
- O package.json raiz declara workspaces use-api e use-web.
- O relatório do projeto afirma que a raiz Git original permaneceu dentro de use-api e que a tentativa de elevar essa raiz Git foi bloqueada pelo Windows.
- O backend documentado usa Node.js/TypeScript, Express, Prisma e PostgreSQL.
- O frontend documentado usa React, TypeScript e Vite.
- O E2E usa Playwright e uma API isolada na porta 3334.
- O workflow de CI documentado usa Node.js 24 e PostgreSQL 18.
- O relatório afirma resultados de testes, mas esses resultados devem ser reproduzidos antes de serem tratados como evidência final.
- O acesso público ao repositório pode apresentar inconsistência entre a página principal e o histórico de commits. Confirmar refs remotas e branch padrão por Git, sem inferir a causa apenas pela interface web.
5. Contrato arquitetural histórico
Preservar como contrato histórico original os seguintes elementos:
- linguagem/plataforma: Node.js;
- interface web: Express.js;
- arquitetura: Clean Architecture com separação estrita em quatro camadas;
- Entidades: conter regras vitais do negócio e não conhecer web ou banco de dados;
- Caso de uso: orquestrar regras da aplicação e permanecer isolado de UI, frameworks e banco;
- Adaptadores: converter formatos e implementar interfaces de acesso a dados;
- Frameworks e Drivers: conter detalhes externos;
- Dependency Rule: dependências do código-fonte devem apontar para dentro;
- Entidades e Casos de Uso não podem depender diretamente de Express nem de tecnologia de persistência.
O contrato histórico cita SQLite. A implementação documentada do projeto usa Prisma + PostgreSQL. Tratar isso como drift de contrato, não como autorização para substituir PostgreSQL por SQLite e não como motivo para apagar o contrato original.
Versionar a correção documental de modo que seja possível responder academicamente:
- o que o contrato original dizia;
- o que foi efetivamente implementado;
- quando a divergência foi identificada;
- qual decisão foi tomada;
- qual versão do contrato passa a representar o artefato corrigido.
6. Regra de ouro: não realizar nova reescrita
Não reescrever backend, frontend ou domínio para “ficarem mais limpos”.
Não iniciar um segundo rebuild.
Não migrar banco de dados apenas para coincidir com documento antigo.
Não trocar framework, ORM, biblioteca principal ou stack sem necessidade diretamente ligada a P0/P1 e sem aprovação explícita.
Preferir mudanças pequenas, auditáveis e mensuráveis.
Preservar comportamento existente sempre que a correção não exigir alteração funcional.
7. Escopo de prioridade
P0 - obrigatório antes da banca
Executar antes de qualquer P2:
- corrigir gitlink/repositório aninhado;
- preservar e identificar baseline;
- alinhar e versionar contrato e implementação;
- distinguir rebuild de refatoração documentalmente;
- reproduzir testes em ambiente limpo.
P1 - necessário ou fortemente recomendado
Executar depois dos P0, salvo dependência técnica comprovada:
- adicionar teste arquitetural para a Dependency Rule;
- proteger banco de teste contra limpeza indevida;
- registrar CI com commit e resultado;
- documentar role;
- dividir o E2E e centralizar URL.
P2 - fora do escopo imediato
Não implementar por padrão:
- OpenAPI ou contrato gerado;
- code splitting;
- paginação;
- rate limiting.
Somente propor P2 se o usuário solicitar explicitamente depois que P0/P1 estiverem estabilizados.
8. Restrições de segurança Git
Tratar operações Git como etapa de alto risco científico.
Antes de qualquer modificação estrutural:
- não executar rm -rf .git;
- não executar git init para “consertar” um repositório já existente;
- não executar git reset --hard para resolver divergência;
- não executar git push --force ou --force-with-lease sem aprovação explícita;
- não apagar a pasta .git interna de use-api antes de preservar seu histórico;
- não converter use-api em diretório comum apenas com remoção do .git e git add se isso descartar o histórico relevante;
- não rebasear ou reescrever o baseline experimental apenas para produzir um histórico “bonito”.
Se a preservação do histórico exigir reescrita de caminhos ou união de históricos não relacionados, executar primeiro em clone/worktree temporário, preservar bundles e apresentar o plano antes de afetar a branch principal.
9. Fase 0 - auditoria somente leitura
Começar sempre por auditoria. Não alterar arquivos nesta fase.
Executar, adaptar e registrar comandos equivalentes a:
git status --short --branch
git rev-parse --show-toplevel
git rev-parse HEAD
git remote -v
git branch -vv
git log --oneline --decorate --graph --all --max-count=50
git ls-files --stage
git ls-files --stage use-api
git submodule status || true
git ls-remote --heads origin
Inspecionar use-api sem destruir seu estado:
git -C use-api rev-parse --is-inside-work-tree
git -C use-api rev-parse --show-toplevel
git -C use-api rev-parse HEAD
git -C use-api remote -v
git -C use-api log --oneline --decorate --graph --all --max-count=50
Determinar explicitamente:
- qual é o Git root atual;
- qual commit é o HEAD do repositório pai;
- se use-api aparece com modo 160000 no índice, caracterizando gitlink;
- se existe .git real dentro de use-api;
- qual é o HEAD e o histórico do repositório aninhado;
- se existe .gitmodules e se há submodule formal configurado;
- quais branches e refs existem no remoto;
- qual histórico contém o backend original;
- se o working tree possui alterações não commitadas.
Produzir diagnóstico antes de executar a correção.
10. Gate P0-A - preservar baseline antes de corrigir Git
Não avançar para alteração do repositório até identificar e registrar o baseline.
Registrar no mínimo:
- data/hora da captura;
- URL do repositório;
- commit do repositório pai;
- commit do repositório aninhado, se houver;
- branches relevantes;
- git status de ambos;
- versão de Node e npm;
- versão do PostgreSQL usada na reprodução, quando disponível;
- versões relevantes obtidas pelos lockfiles;
- quantidade de testes alegada pelos documentos, separada da quantidade reproduzida;
- hashes ou referências das especificações originais usadas no experimento.
Criar uma tag de preservação apenas se o estado estiver limpo e o usuário tiver autorizado a alteração do repositório. Usar nome semanticamente claro, por exemplo:
tcc-baseline-pre-repair
Se houver histórico Git aninhado, criar uma cópia de segurança fora do fluxo normal de commits, preferencialmente por git bundle, antes de remover ou mover metadados Git.
Exemplo conceitual:
git -C use-api bundle create ../use-api-pre-repair.bundle --all
Ajustar o destino para não versionar inadvertidamente um bundle grande dentro do projeto.
Validar o bundle antes de prosseguir.
11. P0 - corrigir gitlink/repositório aninhado preservando histórico
Objetivo: obter um repositório raiz coerente no qual backend, frontend, E2E, CI e documentação possam ser clonados e versionados juntos, sem apagar a história significativa do backend.
Não assumir uma única técnica antes da auditoria.
Preferir uma estratégia que preserve o histórico do backend, por exemplo:
- importar o histórico aninhado para o repositório pai sem --squash; ou
- reescrever os caminhos do histórico do backend em clone temporário para o prefixo use-api/, buscar esse histórico no repositório pai e uni-lo preservando commits; ou
- usar estratégia equivalente que mantenha a rastreabilidade dos commits originais.
Não aceitar como correção científica suficiente apenas:
apagar use-api/.git -> git add use-api -> novo commit
Essa ação pode tornar os arquivos visíveis, mas pode perder a rastreabilidade histórica que o TCC precisa preservar.
Após a correção, verificar obrigatoriamente:
git ls-files --stage use-api
O resultado não deve manter use-api como gitlink 160000 se a decisão aprovada for um monorepo comum.
Verificar também:
- não existir .git aninhado acidental em use-api;
- arquivos do backend estarem rastreados pelo repositório raiz;
- histórico relevante do backend continuar alcançável;
- git status estar coerente;
- um clone novo conter use-api com seus arquivos reais;
- npm ci reconhecer os workspaces.
Se a preservação integral do histórico não for tecnicamente possível com segurança, parar e reportar a limitação antes de destruir qualquer metadado Git.
12. P0 - versionar contrato e implementação
Não editar o contrato original como se ele sempre tivesse descrito PostgreSQL.
Criar uma evolução documental explícita.
A correção deve distinguir pelo menos:
- Contrato histórico v1: Node.js + Express + Clean Architecture + SQLite, conforme documento original;
- Implementação observada: TypeScript/Node.js + Express + Prisma + PostgreSQL, além de frontend React e E2E;
- Contrato versionado v2: especificação aprovada que descreve o sistema realmente mantido após a correção.
Registrar uma decisão arquitetural ou seção equivalente explicando o drift SQLite -> PostgreSQL.
Manter a essência da Dependency Rule independentemente do banco adotado: domínio e casos de uso não podem depender de Express, Prisma, PostgreSQL ou detalhes de infraestrutura.
13. P0 - distinguir rebuild, refatoração e extensão
Usar definições operacionais consistentes:
- Refatoração: alteração estrutural de código existente com intenção principal de preservar comportamento e continuidade do mesmo artefato.
- Rebuild/Reimplementação: construção nova ou substituição substancial do artefato, mesmo que preserve requisitos funcionais.
- Extensão: adição de nova capacidade ao artefato existente, como frontend, CI ou E2E, sem substituir o núcleo anterior.
- Correção: mudança para eliminar defeito, incoerência, risco ou não conformidade observada.
Inspecionar o histórico antes de classificar as fases do experimento.
Não usar “refatoração” como termo genérico para qualquer melhora arquitetural feita por IA.
Produzir um registro acadêmico que identifique quais mudanças foram rebuild, quais foram refatorações, quais foram extensões e quais são correções pós-experimento.
As correções realizadas por esta skill devem ser identificadas como estabilização pós-experimento, para não contaminar a interpretação dos resultados originais.
14. P0 - reprodução em ambiente limpo
Depois da correção Git, provar que o artefato pode ser obtido e executado fora da máquina que o produziu.
Usar clone limpo em diretório temporário ou runner equivalente.
Não reutilizar node_modules, builds, bancos ou caches locais do working tree original como evidência principal.
Registrar:
git clone <repo> <temp-dir>
cd <temp-dir>
npm ci
Preparar PostgreSQL de forma descartável e reproduzível, espelhando o workflow de CI quando possível.
Executar as validações existentes e necessárias, adaptadas ao package atual:
npm run format:check
npm run lint
npm exec --workspace use-api -- tsc --noEmit
npm exec --workspace use-web -- tsc --noEmit
npm test
npm run build
npm run test:e2e
Executar também migrations e geração Prisma necessárias ao clone limpo.
Registrar para cada comando:
- comando;
- commit testado;
- ambiente;
- resultado;
- duração, se disponível;
- erro relevante, quando falhar.
Não marcar o P0 como concluído enquanto um clone limpo depender de arquivos não versionados ou passos secretos não documentados.
15. P1 - teste arquitetural da Dependency Rule
Adicionar um teste automatizado que falhe quando uma camada interna importar detalhes externos proibidos.
Derivar os caminhos reais das camadas a partir do código. Não inventar diretórios apenas para satisfazer o teste.
Cobrir, no mínimo, a regra equivalente a:
Domain/Entities
  NÃO PODE importar Express, Prisma, PostgreSQL, controllers HTTP ou infraestrutura.

Application/Use Cases
  NÃO PODE importar Express, Prisma, PostgreSQL ou adapters de infraestrutura.

Infrastructure/Frameworks
  PODE depender de contratos internos para implementar interfaces.

Dependências arquiteturais
  DEVEM apontar para dentro.
Escolher a solução de menor complexidade que detecte violações de forma confiável. Pode usar ferramenta de análise de dependências ou teste automatizado dedicado, desde que integrado ao projeto e à CI.
Adicionar script explícito, por exemplo:
npm run test:architecture
ou equivalente consistente com o workspace.
Validar que o teste é efetivo. Em ambiente temporário, introduzir uma dependência proibida de forma controlada, confirmar que o teste falha e reverter a alteração antes do commit final.
Nunca deixar a violação artificial no repositório.
16. P1 - proteção do banco de teste
Tratar qualquer limpeza de dados E2E/integration como operação potencialmente destrutiva.
Antes de deletar dados, validar programaticamente que a conexão aponta para banco de teste permitido.
A proteção deve falhar fechada quando:
- a URL estiver ausente;
- a URL for igual à URL de desenvolvimento/produção;
- o nome do banco não corresponder ao padrão de teste aprovado;
- o ambiente esperado não estiver configurado.
Preferir uma função explícita, por exemplo conceitual:
assertSafeTestDatabase()
Executá-la antes de cleanup, truncate, deleteMany, migrations destrutivas ou equivalente.
Preservar a estratégia atual de usar dados E2E identificáveis por prefixo quando ela continuar adequada, mas não considerá-la proteção suficiente contra conexão ao banco errado.
17. P1 - registrar CI com commit e resultado
O arquivo .github/workflows/ci.yml não é evidência suficiente de que a CI passou.
Após a correção:
- executar o workflow para o commit candidato;
- registrar SHA completo;
- registrar identificador/URL da execução;
- registrar status final;
- registrar data;
- registrar jobs/checks relevantes;
- registrar eventual artifact de falha, se houver.
Não fabricar URL, run ID ou status.
Se não houver acesso à execução remota, registrar explicitamente NÃO VERIFICADO EM CI e manter a tarefa aberta.
18. P1 - documentar role
O projeto observado possui uso de role, com valores como USER e ADMIN nos fluxos E2E.
Verificar sua definição real no backend antes de documentar.
Documentar claramente:
- valores válidos;
- valor padrão, se houver;
- validação de entrada;
- persistência;
- exposição no contrato HTTP;
- comportamento de criação/edição;
- ausência ou presença real de autorização.
Não afirmar que ADMIN possui privilégios se o sistema não implementa autenticação/autorização.
Se role for apenas atributo cadastral, declarar explicitamente que ele não constitui controle de acesso no escopo atual.
Tratar role também como diferença entre o contrato histórico, que descrevia apenas id, nome e email, e a implementação atual.
19. P1 - dividir E2E e centralizar URLs
O E2E observado concentra múltiplos comportamentos em um fluxo grande e contém URL de API repetida.
Refatorar os testes sem alterar o comportamento funcional da aplicação.
Objetivos:
- separar cenários para facilitar diagnóstico de falha;
- manter isolamento de dados;
- evitar literals de host/porta espalhados pelos specs;
- centralizar URL do frontend e URL da API em configuração/fixture apropriada;
- manter a porta E2E isolada quando necessário;
- preservar uso de banco de teste protegido.
Aceitação mínima:
- specs E2E não repetirem http://127.0.0.1:3334 ou equivalente em vários pontos;
- configuração possuir fonte única para API E2E;
- cenários permanecerem independentes ou declararem dependência explicitamente;
- cleanup ser seguro;
- suite completa passar no clone limpo e na CI.
Evitar paralelismo se ele puder introduzir corrida sobre o mesmo banco sem isolamento adequado.
20. P2 - registrar como não objetivo
No proposal.md e no design.md, declarar como non-goals nesta mudança:
- OpenAPI gerado;
- code splitting;
- paginação;
- rate limiting;
- autenticação/autorização, salvo se o usuário abrir mudança separada;
- migração de framework;
- redesign completo da UI;
- novo rebuild arquitetural.
Não implementar esses itens para “aproveitar a oportunidade”.
21. Estrutura OpenSpec esperada
Usar OpenSpec como registro da mudança, não apenas como gerador de código.
Para esta correção, preferir uma mudança com nome claro, por exemplo:
stabilize-tcc-artifact
No fluxo padrão, iniciar com exploração quando o estado local ainda não foi auditado:
/opsx:explore
Depois criar a proposta:
/opsx:propose stabilize-tcc-artifact
Os comandos /opsx:... pertencem ao chat do agente, não ao terminal.
Revisar os artefatos antes de aplicar.
Depois:
/opsx:apply
Se o perfil instalado disponibilizar verificação explícita, usar:
/opsx:verify
Caso verify não esteja disponível, executar manualmente todos os gates definidos nesta skill antes do archive.
Somente arquivar quando as tarefas obrigatórias estiverem comprovadas:
/opsx:archive
22. Conteúdo obrigatório de proposal.md
Fazer o proposal.md responder claramente:
- por que o artefato precisa de estabilização antes da banca;
- quais problemas P0 serão corrigidos;
- quais melhorias P1 serão realizadas;
- por que não haverá nova reescrita;
- quais itens P2 estão fora do escopo;
- quais riscos existem para preservação do histórico;
- como a correção evitará contaminar o experimento original;
- como será comprovada a reprodutibilidade.
Não vender a mudança como “modernização geral”.
23. Conteúdo obrigatório de design.md
Documentar no design.md:
- estado Git encontrado;
- estratégia escolhida para preservar e integrar histórico;
- alternativas rejeitadas e motivo;
- baseline e mecanismo de backup;
- estratégia de versionamento do contrato;
- classificação rebuild/refatoração/extensão/correção;
- desenho da verificação arquitetural;
- proteção do banco de teste;
- desenho da refatoração dos E2E;
- estratégia de clone limpo;
- estratégia de CI e evidências;
- plano de rollback.
Dar atenção especial às operações irreversíveis.
24. Specs sugeridas
Criar delta specs apenas para áreas tocadas pela mudança. Não documentar o aplicativo inteiro sem necessidade.
Organizar requisitos em domínios equivalentes a:
repository-integrity
architecture-contract
test-reproducibility
academic-traceability
Adicionar domínio separado de E2E apenas se isso melhorar clareza.
Usar linguagem normativa nos requisitos, por exemplo SHALL/MUST ou equivalente consistente com OpenSpec.
Para cada requisito, definir cenários verificáveis em GIVEN/WHEN/THEN.
Exemplo conceitual:
## ADDED Requirements

### Requirement: Clean clone reproducibility
The project SHALL be installable and testable from a fresh clone without relying on unversioned local project files.

#### Scenario: Reproduce validation from clean clone
- GIVEN the repaired repository at the candidate commit
- WHEN a contributor clones it into an empty directory and follows the documented setup
- THEN dependency installation, migrations, tests, build and E2E complete with the recorded results
Não copiar esse exemplo mecanicamente se a realidade do projeto exigir requisitos mais precisos.
25. Estrutura obrigatória de tasks.md
Ordenar as tarefas por dependência e prioridade, não por conveniência.
Usar sequência equivalente:
0. Read-only audit
1. Capture and preserve baseline
2. Repair repository/gitlink while preserving history
3. Version architecture contract and record drift
4. Classify rebuild/refactor/extension/correction
5. Reproduce project in clean clone
6. Add architectural dependency test
7. Add test-database safety guard
8. Refactor E2E and centralize URLs
9. Document role semantics
10. Run complete local validation from clean clone
11. Run and record CI for exact commit
12. Update academic evidence and final traceability
13. Verify OpenSpec change
14. Archive only after gates pass
Cada tarefa deve possuir critério de conclusão observável.
Não marcar checkbox com base apenas em edição de arquivo.
26. Gates de conclusão
Gate P0-Repository
Considerar concluído somente se:
- baseline estiver identificado;
- histórico relevante estiver preservado;
- use-api não permanecer como gitlink acidental na solução aprovada;
- clone novo contiver backend e frontend reais;
- não houver dependência de .git aninhado para obter os arquivos.
Gate P0-Contract
Considerar concluído somente se:
- contrato histórico estiver preservado;
- drift SQLite/PostgreSQL estiver documentado;
- contrato atual estiver versionado;
- Dependency Rule continuar explícita;
- role não for confundido com autorização.
Gate P0-Reproducibility
Considerar concluído somente se:
- setup tiver sido executado em clone limpo;
- testes, build e E2E tiverem resultados registrados;
- migrations tiverem sido aplicadas no ambiente limpo;
- os resultados estiverem vinculados ao commit testado.
Gate P1-Architecture
Considerar concluído somente se:
- teste arquitetural existir;
- a CI o executar;
- violação controlada tiver demonstrado que o teste falha quando deve;
- violação temporária tiver sido revertida.
Gate P1-TestSafety
Considerar concluído somente se:
- cleanup recusar banco inadequado;
- E2E utilizar banco de teste aprovado;
- proteção for automatizada, não apenas documentada.
Gate P1-CI
Considerar concluído somente se:
- houver execução real vinculada ao SHA exato;
- status estiver registrado;
- falhas não forem escondidas.
27. Validação mínima antes de declarar sucesso
Executar, conforme disponibilidade real dos scripts:
git status --short
npm ci
npm run format:check
npm run lint
npm exec --workspace use-api -- tsc --noEmit
npm exec --workspace use-web -- tsc --noEmit
npm run test:architecture
npm test
npm run build
npm run test:e2e
Adicionar validações de Prisma/migrations existentes no projeto.
Executar em clone limpo quando chegar ao gate final.
Não omitir comando que falhou. Explicar causa e manter a tarefa aberta.
28. Evidências acadêmicas a produzir
Manter evidências pequenas, legíveis e auditáveis.
Registrar no repositório, em local coerente com o projeto, documentos equivalentes a:
docs/tcc/baseline.md
docs/tcc/contract-drift.md
docs/tcc/change-classification.md
docs/tcc/reproducibility.md
docs/tcc/ci-evidence.md
Adaptar nomes se já existir convenção melhor.
Evitar duplicar grandes logs no Git. Para logs extensos, registrar resumo, comando, hash, resultado e referência ao artifact/run correspondente.
29. Formato de relatório durante apply
Para cada bloco relevante, relatar:
PRIORIDADE:
PROBLEMA:
EVIDÊNCIA:
MUDANÇA:
ARQUIVOS AFETADOS:
COMANDOS EXECUTADOS:
RESULTADO:
IMPACTO NO TCC:
RISCO RESIDUAL:
PRÓXIMO GATE:
Distinguir sempre:
- observado;
- inferido;
- proposto;
- executado;
- verificado.
30. Condições de parada obrigatória
Parar antes de continuar e pedir decisão quando:
- não for possível acessar o histórico do repositório aninhado;
- houver risco de sobrescrever commits únicos;
- a correção exigir force-push na branch usada como evidência do TCC;
- o working tree tiver alterações do usuário não compreendidas;
- o banco apontado pelos testes não puder ser provado como banco de teste;
- uma mudança proposta alterar requisitos funcionais fora do escopo;
- o contrato histórico original estiver ausente e seria necessário reconstruí-lo por memória;
- o agente não conseguir reproduzir uma alegação importante do relatório;
- houver diferença entre o código local e o commit que se pretende apresentar à banca.
Não “resolver” uma condição de parada apagando evidência.
31. Critério de sucesso global
Declarar a estabilização concluída somente quando for possível demonstrar, com evidências vinculadas a commits, que:
1. o histórico experimental relevante foi preservado;
2. o repositório pode ser clonado com backend e frontend íntegros;
3. o baseline anterior à correção está identificável;
4. a diferença entre contrato original e implementação atual está versionada;
5. rebuild, refatoração, extensão e correção estão classificados corretamente;
6. a Dependency Rule é verificável automaticamente;
7. testes não podem limpar banco inadequado silenciosamente;
8. a suíte é reproduzível em ambiente limpo;
9. o E2E possui configuração centralizada e estrutura diagnosticável;
10. role está documentado sem alegar autorização inexistente;
11. a CI está associada a um commit e resultado reais;
12. nenhum P2 foi introduzido sem necessidade;
13. nenhuma nova reescrita foi usada para mascarar problemas do experimento original.
32. Prompt recomendado para iniciar a mudança no OpenSpec
Depois da auditoria exploratória, usar no chat do Codex/OpenSpec:
/opsx:propose stabilize-tcc-artifact

Estabilize o artefato acadêmico vibe-coding-experimentacao-crud antes da banca do TCC, seguindo integralmente a skill tcc-openspec-project-correction. Preserve o histórico e o baseline antes de qualquer correção. Não faça nova reescrita. Priorize P0: corrigir gitlink/repositório aninhado preservando histórico; identificar baseline; versionar o drift entre contrato arquitetural e implementação; classificar rebuild versus refatoração; e reproduzir testes em clone limpo. Depois execute P1: teste arquitetural da Dependency Rule, proteção do banco de teste, evidência de CI por commit, documentação de role e divisão/centralização dos E2E. Trate OpenAPI, code splitting, paginação e rate limiting como P2 fora do escopo. Gere proposal.md, delta specs, design.md e tasks.md com gates verificáveis e sem marcar como concluído nada que não tenha evidência executada.
Antes de /opsx:apply, revisar a proposta, o design e as tarefas. Corrigir qualquer ação destrutiva ou afirmação não sustentada por evidência.
33. Resultado esperado da atuação do agente
Entregar um projeto academicamente mais defensável, não artificialmente “perfeito”.
A banca deve conseguir distinguir:
- o artefato produzido no experimento;
- os problemas encontrados;
- as correções pós-experimento;
- as decisões arquiteturais;
- as evidências de reprodutibilidade;
- as limitações que continuam fora do escopo.
Preservar essa distinção é mais importante do que maximizar número de melhorias técnicas.