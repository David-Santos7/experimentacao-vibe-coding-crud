# Relatório técnico: do Vibe Coding à estabilização com OpenSpec e execução agentic

**Projeto:** CRUD Full Stack de usuários, utilizado em experimento acadêmico/TCC.  
**Data de elaboração:** 5 de outubro de 2026.  
**Escopo:** desenvolvimento registrado nos relatórios originais, diagnóstico do artefato e estabilização posterior.  
**Situação:** 24 de 28 tarefas da mudança `stabilize-tcc-artifact` concluídas; validação local realizada; execução remota de CI ainda não comprovada.

## Guia de leitura

Este relatório apresenta o processo em etapas, explica o motivo das decisões e indica onde consultar as evidências. Os primeiros capítulos descrevem a aplicação e sua origem. Os seguintes apresentam o diagnóstico, as correções e a validação. Os capítulos finais tratam das limitações e do uso dos resultados no TCC.

1. [Objetivo e critérios de evidência](#1-objetivo-e-critérios-de-evidência)
2. [O que foi desenvolvido com Vibe Coding](#2-o-que-foi-desenvolvido-com-vibe-coding)
3. [Evolução registrada do backend e do frontend](#3-evolução-registrada-do-backend-e-do-frontend)
4. [Diagnóstico antes das alterações](#4-diagnóstico-antes-das-alterações)
5. [Como o OpenSpec organizou o trabalho](#5-como-o-openspec-organizou-o-trabalho)
6. [Como ocorreu a execução agentic](#6-como-ocorreu-a-execução-agentic)
7. [Preservação e correção do versionamento](#7-preservação-e-correção-do-versionamento)
8. [Organização das camadas](#8-organização-das-camadas)
9. [Verificação automática da arquitetura](#9-verificação-automática-da-arquitetura)
10. [Proteção dos bancos durante os testes](#10-proteção-dos-bancos-durante-os-testes)
11. [Testes de ponta a ponta e integração contínua](#11-testes-de-ponta-a-ponta-e-integração-contínua)
12. [Reprodução em clone limpo](#12-reprodução-em-clone-limpo)
13. [Resultados e rastreabilidade](#13-resultados-e-rastreabilidade)
14. [As quatro tarefas pendentes](#14-as-quatro-tarefas-pendentes)
15. [Interpretação acadêmica](#15-interpretação-acadêmica)
16. [Documentos para consulta](#16-documentos-para-consulta)

## 1. Objetivo e critérios de evidência

O objetivo foi transformar uma aplicação funcional, construída com assistência de IA, em um artefato mais organizado, seguro para testar e reproduzível por outras pessoas. Como o projeto integra um TCC, preservar o código e distinguir os momentos do experimento também foi parte do trabalho técnico.

Não bastava reorganizar pastas. Era necessário verificar se o Git entregava o backend em um clone comum, se as dependências respeitavam a Clean Architecture e se os testes poderiam apagar dados de um banco inadequado. As correções precisavam ser acompanhadas de evidências, sem substituir o registro histórico por uma narrativa retrospectiva de sucesso.

Este documento utiliza três categorias de informação:

| Categoria | Significado | Como deve ser interpretada |
| --- | --- | --- |
| Histórico documentado | Informação dos relatórios anteriores do projeto | Descreve o que foi registrado naquela etapa; não equivale a uma execução atual daquele commit |
| Estado observado | Resultado da inspeção de arquivos, índice Git, referências e configuração | Fundamenta o diagnóstico da estabilização |
| Resultado reproduzido | Verificação executada no artefato corrigido, com ambiente e revisão identificados | Evidência da estabilização posterior ao experimento |

Os relatórios anteriores foram preservados. Não há, nas fontes utilizadas, uma transcrição completa de todos os prompts, modelos, respostas ou tempos da criação original. Por isso, o processo histórico é apresentado a partir dos documentos disponíveis, sem inventar uma sequência de interações.

## 2. O que foi desenvolvido com Vibe Coding

Neste projeto, Vibe Coding designa o desenvolvimento assistido por IA, conduzido por solicitações e ajustes sucessivos do usuário. A aplicação resultante permite cadastrar, listar, consultar, editar e excluir usuários por uma interface web conectada a uma API e a um banco PostgreSQL.

O usuário possui identificador, nome, e-mail, papel (`USER` ou `ADMIN`) e datas de criação e atualização. As regras incluem nome válido, e-mail válido e único, normalização de informações e preservação da data de criação nas atualizações. A exclusão remove o registro fisicamente.

O campo `role` representa uma informação do cadastro. A presença de `ADMIN` não implementa autenticação nem concede, por si só, permissões administrativas. Essa distinção foi documentada para evitar que a estrutura de dados fosse confundida com um sistema de autorização.

As tecnologias centrais são TypeScript, Node.js, Express, Prisma e PostgreSQL no backend; React, Vite e bibliotecas de formulários e interface no frontend. Vitest, Supertest e Playwright participam da validação. A estabilização manteve essa base tecnológica.

O projeto não surgiu sem qualquer organização. Os registros mostram entidades, casos de uso, contratos de repositório e testes anteriores à intervenção do OpenSpec. A análise rigorosa identificou problemas específicos sobre essa base existente, em vez de presumir que todo código gerado com IA deveria ser descartado.

## 3. Evolução registrada do backend e do frontend

### 3.1 Regras de negócio e persistência

O [relatório original do backend](use-api/RELATORIO_PROJETO.md) registra a implementação das regras na entidade de usuário e dos casos de uso de criação, consulta, listagem, atualização e exclusão. O acesso aos dados ocorre por um contrato de repositório, implementado com Prisma.

O esquema de persistência contém a tabela de usuários e a restrição de unicidade do e-mail. Essa restrição complementa a validação do caso de uso: uma consulta prévia melhora a resposta ao usuário, enquanto a proteção no banco também trata conflitos entre operações concorrentes.

As datas e o identificador são controlados pela aplicação. O relatório também registra a separação dos bancos de desenvolvimento, teste e shadow utilizados pelas ferramentas de migração.

### 3.2 API HTTP

A API recebeu rotas, validação de entradas com Zod, tradução de erros e composição das dependências. Respostas distinguem entrada inválida, usuário inexistente, conflito de e-mail e erro interno, com tratamento para evitar exposição indevida de detalhes técnicos.

Um problema de serialização da entidade foi corrigido nessa etapa histórica com apresentação explícita dos dados. Essa correção pertence ao desenvolvimento registrado anteriormente; não deve ser atribuída à estabilização atual do OpenSpec.

O relatório do backend registra 40 testes naquela etapa: 21 unitários, seis de integração e 13 de HTTP. Esses números são registros históricos, sem reprodução atual do backend no commit original indisponível.

### 3.3 Interface e integração Full Stack

O [relatório Full Stack original](RELATORIO_FULLSTACK.md) descreve o frontend com páginas de listagem, cadastro, detalhe e edição, além de confirmação de exclusão. Registra validação de formulários, mensagens de sucesso e erro, estados de carregamento e organização de componentes por funcionalidade.

A comunicação HTTP foi centralizada, utilizando a URL da API configurada por ambiente. No backend, foram acrescentados CORS e Helmet. Os workspaces passaram a organizar os comandos do conjunto API/web.

Nesse momento, o relatório registra 42 testes da API e 11 do frontend, totalizando 53 testes Vitest, além de um cenário E2E. Os dois testes HTTP adicionais em relação à etapa anterior estão associados às verificações de CORS registradas no documento.

O documento também descreve recursos de responsividade e acessibilidade. A estabilização não realizou uma nova auditoria completa de acessibilidade; portanto, essas descrições continuam sendo evidências documentais da etapa original.

### 3.4 Transição para a estabilização

Uma aplicação executar localmente não garante que outra pessoa consiga obtê-la e reproduzi-la. Essa diferença motivou a etapa seguinte: auditar o artefato existente, definir requisitos verificáveis e corrigir os problemas encontrados sem ampliar desnecessariamente o produto.

## 4. Diagnóstico antes das alterações

A inspeção inicial verificou o repositório principal, o estado local, o contrato `openspec.md`, a estrutura do backend e os mecanismos de teste.

| Achado | Consequência prática | Resposta adotada |
| --- | --- | --- |
| `use-api` aparecia no índice como gitlink, modo `160000` | O repositório principal apontava para um commit de outro repositório, em vez de versionar os arquivos do backend | Preservar o estado e converter a pasta em arquivos comuns do monorepositório |
| Ausência de `.gitmodules` e de metadados Git internos em `use-api` | Não havia configuração suficiente para adquirir o backend como submódulo | Diagnosticar referências e registrar a indisponibilidade do histórico |
| Commit referenciado do backend não recuperável pelas fontes consultadas | Não era possível comprovar ou importar esse histórico | Manter a lacuna explícita |
| Organização dos adaptadores diferente do contrato arquitetural adotado | As responsabilidades externas ficavam menos claras na estrutura | Consolidar adaptadores HTTP e de persistência |
| Geração de UUID dependia de `node:crypto` dentro da aplicação | A camada de casos de uso conhecia um mecanismo concreto da plataforma | Injetar uma função geradora de identificador |
| Limpeza de testes exigia proteção mais rigorosa do destino | Uma configuração incorreta poderia direcionar operações destrutivas ao banco errado | Aplicar guard compartilhado antes de limpeza e preparação |
| E2E concentrava operações em um fluxo | Falhas e limpeza eram menos isoladas por comportamento | Criar cinco cenários independentes com dados próprios |
| Workflow ausente no checkout observado | A documentação de CI não correspondia à infraestrutura disponível | Restaurar o workflow e distinguir configuração de execução comprovada |

Também foram registradas divergências entre fontes: referências a SQLite e PostgreSQL, interpretação de `role` e URLs distintas de repositório. A decisão foi manter PostgreSQL e documentar as divergências, sem tratar URLs diferentes como equivalentes ou reconstruir uma versão antiga por memória.

## 5. Como o OpenSpec organizou o trabalho

O OpenSpec foi utilizado para estruturar a mudança `stabilize-tcc-artifact` segundo Spec-Driven Development: definir o problema, explicitar decisões e requisitos, dividir a implementação e verificar o resultado contra essas definições.

| Artefato | Papel no processo |
| --- | --- |
| `proposal.md` | Define a motivação, o escopo e o resultado pretendido |
| `design.md` | Registra decisões técnicas, alternativas, riscos e condições de execução |
| Especificações da mudança | Descrevem requisitos e cenários verificáveis de integridade, arquitetura, reprodução e rastreabilidade |
| `tasks.md` | Converte o plano em 28 tarefas acompanháveis |

A proposta não se limitou a pedir uma “melhoria geral”. Ela organizou a preservação do baseline, a correção do Git, o contrato arquitetural, a segurança dos testes, a reprodução limpa, a refatoração das camadas, os E2E, a CI e os registros acadêmicos.

O arquivo raiz [openspec.md](openspec.md), fornecido pelo usuário, foi preservado como fonte do contrato. Um [contrato v2](docs/tcc/architecture-contract-v2.md) e um [registro de divergências](docs/tcc/contract-drift.md) explicam a relação entre a fonte recebida, o estado observado e o alvo implementado. Isso evita editar silenciosamente o contrato para fazê-lo parecer compatível com o código.

Inicialmente, a recuperação histórica era uma condição de bloqueio. Após orientação explícita do usuário para prosseguir, os artefatos foram revisados: a indisponibilidade histórica deixou de impedir as correções locais após backup, mas continuou registrada como pendência. A autorização alterou a sequência de trabalho; não transformou uma evidência ausente em evidência existente.

O OpenSpec organizou e validou os artefatos de planejamento. As alterações de código e as execuções de ferramentas foram realizadas pelo agente. Essa separação é importante para compreender o papel de cada recurso.

## 6. Como ocorreu a execução agentic

Neste relatório, execução agentic significa um ciclo de trabalho em que o agente consulta o estado do projeto, escolhe ações dentro do escopo autorizado, modifica arquivos, executa verificações e utiliza os resultados para corrigir o próximo passo.

O ciclo observado foi:

1. **Inspecionar:** ler contratos, relatórios, configuração, código e referências Git.
2. **Planejar:** associar os problemas aos requisitos e às tarefas da mudança.
3. **Preservar:** criar evidências do estado inicial antes de modificar o versionamento.
4. **Implementar:** corrigir estrutura, dependências, segurança e configuração.
5. **Executar:** instalar e verificar o artefato em ambiente separado.
6. **Reagir às falhas:** ajustar problemas reais de configuração ou portabilidade e repetir as verificações afetadas.
7. **Registrar:** vincular resultados a revisões e manter tarefas sem prova abertas.

O usuário definiu prioridades, autorizou o avanço diante das lacunas históricas e delimitou a necessidade de preservação. O agente executou o trabalho técnico. Git, TypeScript, Prisma, Vitest, Playwright e outras ferramentas produziram as verificações. O termo agentic, aqui, não pressupõe uma equipe de múltiplos agentes nem demonstra autonomia irrestrita.

Algumas decisões surgiram das execuções: Docker estava indisponível, então foi utilizado PostgreSQL local descartável; uma porta já ocupada foi preservada e substituída nos testes por configuração; a verificação de um clone Windows revelou problemas de finais de linha, corrigidos com atributos Git. As falhas fizeram parte do processo e não foram ocultadas como se todas as tentativas tivessem passado.

## 7. Preservação e correção do versionamento

### 7.1 Por que o gitlink era um problema

Um gitlink registra o identificador de um commit de outro repositório. Ele não armazena os arquivos da pasta como arquivos comuns do repositório principal. Um submódulo corretamente configurado pode usar esse mecanismo; porém, no estado observado, faltavam os metadados necessários e o commit apontado não pôde ser recuperado.

O backend presente no disco precisava ser preservado e incluído no versionamento principal. Apenas apagar a referência sem guardar o estado anterior comprometeria a rastreabilidade.

### 7.2 O que foi preservado

Antes da correção, foram criados um bundle do histórico disponível do repositório principal, um snapshot dos fontes e configurações pertinentes e registros de hashes. O snapshot excluiu segredos e artefatos descartáveis, como dependências instaladas e saídas de build.

Uma cópia local durável ficou em `evidence-backups/pre-stabilization/`, ignorada pelo Git. Ela não integra um clone comum nem é requisito de execução da aplicação. O bundle preserva o histórico principal disponível; não contém, por consequência, o histórico independente do backend que não foi recuperado.

### 7.3 Como a pasta foi corrigida

A entrada gitlink foi retirada apenas do índice e os arquivos existentes de `use-api` foram adicionados como arquivos comuns. A correção foi consolidada na branch local `stabilize-tcc-artifact`, preservando a referência original de `main` e acrescentando commits.

As verificações registraram 121 arquivos rastreados em `use-api`, ausência de entradas `160000` e aquisição dos dois workspaces em clone comum. Não houve force-push, reescrita do histórico disponível ou exclusão de metadados Git para simular recuperação.

O contrato fornecido também teve os bytes preservados. A comparação entre clones revelou que a normalização de finais de linha precisava de uma exceção para `openspec.md`; essa exceção foi acrescentada e a igualdade dos hashes foi verificada.

O [relatório específico de correção Git](docs/tcc/gitlink-repair.md) reúne o diagnóstico e as evidências. O resultado é um monorepositório que entrega o código atual do backend; a recuperação de seu histórico anterior permanece uma questão separada.

## 8. Organização das camadas

A refatoração buscou tornar visível a separação de responsabilidades existente e remover dependências concretas inadequadas. A estrutura principal do backend passou a corresponder às quatro camadas:

```text
use-api/src/
├── domain/                         Entidades e regras centrais
├── application/                    Casos de uso e contratos necessários
├── adapters/
│   ├── http/                       Controllers, rotas, schemas e middlewares
│   └── persistence/prisma/         Implementação do repositório
├── infrastructure/
│   ├── database/prisma/            Conexão com o banco
│   ├── generated/prisma/           SDK gerado pelo Prisma
│   └── testing/                    Proteção da infraestrutura de testes
└── main/                           Composição e inicialização
```

`infrastructure` e `main` exercem responsabilidades externas de frameworks/drivers. O SDK gerado não integra o núcleo de negócio e deve ser regenerado na preparação do ambiente.

| Camada | Responsabilidade | Exemplo no projeto |
| --- | --- | --- |
| Entidades | Representar conceitos e invariantes do negócio | Usuário e validação de seus dados |
| Casos de uso | Coordenar operações do sistema por contratos | Criar usuário utilizando um repositório e um gerador de ID |
| Adaptadores de interface | Traduzir entradas, saídas e acesso à persistência | Controller HTTP e `PrismaUserRepository` |
| Frameworks/drivers | Disponibilizar mecanismos concretos e montar o sistema | Express, conexão PostgreSQL, cliente Prisma e inicialização |

`presentation/http` foi movido para `adapters/http`. O repositório Prisma passou para `adapters/persistence/prisma`, enquanto o cliente de conexão permaneceu na infraestrutura. A saída gerada do Prisma passou de `src/generated/prisma` para `src/infrastructure/generated/prisma`.

A aplicação passou a receber uma função `IdGenerator`. A implementação concreta com `randomUUID` ficou na composição externa. Assim, o caso de uso pode gerar um identificador sem importar `node:crypto`, e o teste pode fornecer um valor determinístico.

A regra de dependência diz respeito ao conhecimento entre módulos: as camadas internas não devem importar os mecanismos das externas. O fluxo de uma requisição pode atravessar HTTP, caso de uso e persistência, mas isso não exige que o caso de uso importe Express ou Prisma. Ele utiliza contratos, e a composição fornece as implementações.

Não houve reconstrução integral da aplicação nem alteração do modelo de dados para acomodar a nova estrutura. A intenção foi preservar o comportamento do CRUD enquanto se corrigiam fronteiras e localização das responsabilidades.

## 9. Verificação automática da arquitetura

A organização em pastas, sozinha, não impede uma importação indevida. Foi acrescentada uma verificação de dependências em [dependencies.spec.ts](use-api/tests/architecture/dependencies.spec.ts), usando TypeScript e Vitest já disponíveis no projeto.

A análise considera importações comuns e de tipos, reexportações, resolução de módulos e outras formas de carregar dependências. Ela verifica as restrições do núcleo, fronteiras entre camadas, ciclos e a presença de código nas camadas internas.

A suite possui seis testes: a verificação do código real e cinco verificações com violações controladas em diretórios temporários. Esses casos demonstram que o mecanismo detecta dependências proibidas, incluindo referências externas que poderiam ficar escondidas por tipos ou reexportações.

Os comandos `test:architecture` foram disponibilizados na raiz e no workspace da API. A verificação não precisa de banco. Seu alcance é a conformidade das dependências analisadas; ela não substitui revisão das regras de negócio ou testes de comportamento.

## 10. Proteção dos bancos durante os testes

Testes de integração e HTTP podem limpar registros. Por isso, o destino do banco precisa ser validado antes de qualquer limpeza ou preparação potencialmente destrutiva.

Foi criado um guard compartilhado em [assertSafeTestDatabase.ts](use-api/src/infrastructure/testing/assertSafeTestDatabase.ts). Ele exige ambiente de teste explícito, URLs presentes e válidas, protocolo PostgreSQL e o nome exato `use_api_test`. Configurações com caminho inadequado, parâmetros ou fragmentos são rejeitadas.

O guard compara destinos normalizados, considerando host, porta e banco independentemente das credenciais. Endereços locais equivalentes são normalizados. Quando uma URL de produção é fornecida, a comparação também impede seu uso como destino de teste. As mensagens não expõem segredos de conexão.

A proteção foi aplicada antes da criação do cliente nos testes pertinentes, antes de cada limpeza, no servidor E2E e na preparação de migrações para teste. Dez testes unitários adicionais verificam situações seguras e inseguras sem depender de uma conexão real.

Essa proteção reduz o risco operacional de configurações incorretas dentro da receita prevista. O nome de um banco, isoladamente, não torna qualquer servidor seguro; a reprodução documentada utiliza um ambiente descartável e separado.

## 11. Testes de ponta a ponta e integração contínua

### 11.1 Cinco cenários E2E

O fluxo único foi reorganizado em cinco cenários: criação e consulta, edição, e-mail duplicado, cancelamento seguido de confirmação de exclusão e persistência após recarregar a página.

Cada cenário utiliza dados próprios, com e-mails únicos, e remove os registros que criou por identificador. A limpeza deixou de depender de uma exclusão ampla por prefixo compartilhado. Essa separação facilita entender qual comportamento falhou e reduz interferência entre cenários.

As URLs da API e do frontend foram centralizadas e alinhadas com portas, variáveis dos servidores e healthchecks. Foi mantido um worker. O navegador padrão utiliza o Chromium instalado pelo Playwright, com opção de canal Chrome quando configurado.

### 11.2 Workflow restaurado

O workflow em [.github/workflows/ci.yml](.github/workflows/ci.yml) foi restaurado com Node 24 e PostgreSQL 18 descartável. Ele reúne instalação, geração do Prisma, preparação protegida do banco, formatação, lint, TypeScript, arquitetura, testes, build e E2E, além de artefatos de falha.

A presença desse arquivo demonstra que a automação foi configurada. **Não há execução remota de CI comprovada para a revisão corrigida.** A validação local não deve ser apresentada como aprovação do GitHub Actions. Essa distinção consta em [ci-evidence.md](docs/tcc/ci-evidence.md).

## 12. Reprodução em clone limpo

A verificação final utilizou um clone separado, instalação própria de dependências, geração do cliente Prisma e PostgreSQL temporário. O ambiente registrado utilizou Windows, Node `24.14.1`, npm `11.12.1` e PostgreSQL 18.

Como Docker não estava disponível, foi criado um cluster PostgreSQL descartável, restrito ao endereço local e com porta específica. O cluster foi encerrado ao final. A validação não dependeu de reutilizar o banco cotidiano do usuário.

A sequência compreendeu:

1. Obter o clone da branch corrigida e confirmar a presença dos workspaces.
2. Instalar dependências com `npm ci`.
3. Configurar o ambiente temporário sem versionar segredos.
4. Gerar o cliente Prisma com `prisma7.config.ts` explícito.
5. Aplicar as migrações de teste pelo comando protegido.
6. Executar formatação, lint, TypeScript e teste arquitetural.
7. Executar as suites da API e do frontend e gerar os builds.
8. Instalar o navegador isolado do Playwright e executar os cinco E2E.
9. Registrar revisão, ambiente e resultados, encerrando os recursos temporários.

O clone limpo revelou um problema relevante de portabilidade: arquivos adquiridos no Windows podiam ficar com finais de linha incompatíveis com a formatação exigida. A regra `* text=auto eol=lf` em `.gitattributes` corrigiu a aquisição dos fontes, com exceção explícita para preservar os bytes do contrato recebido.

Uma tentativa de E2E teve problemas de encerramento no ambiente restrito, apesar de mostrar os cinco cenários aprovados. Essa tentativa não foi considerada conclusão integral bem-sucedida. A execução posterior terminou com código de saída zero. O registro diferencia resultados parciais de comandos concluídos.

Os detalhes de ambiente e comandos estão em [reproducibility.md](docs/tcc/reproducibility.md). Esse documento é a referência operacional para repetir o processo; o presente relatório explica seu significado.

## 13. Resultados e rastreabilidade

### 13.1 Verificações do artefato corrigido

| Verificação | Resultado registrado |
| --- | --- |
| Instalação no clone limpo | Concluída |
| Geração Prisma e migrações protegidas | Concluídas |
| Formatação e lint dos workspaces | Aprovados |
| TypeScript da API e projetos web | Aprovado |
| Arquitetura | Seis testes aprovados |
| API completa | 58 testes aprovados |
| Frontend | 11 testes aprovados |
| E2E | Cinco cenários aprovados, com comando concluído |
| Builds da API e do frontend | Concluídos |
| Validação OpenSpec em modo estrito | Aprovada |
| CI remota | Não verificada |

Os 58 testes da API incluem 31 unitários, seis de integração, 15 HTTP e seis arquiteturais. Somados aos 11 do frontend, são **69 testes Vitest**. Os seis arquiteturais já estão nesse total e não devem ser somados novamente. Os cinco E2E são contabilizados separadamente.

O aumento em relação aos 53 testes históricos vem das dez verificações unitárias da proteção de banco e dos seis testes de arquitetura. Os E2E passaram de um fluxo documentado para cinco cenários. A contagem mostra a extensão da validação, mas não constitui, por si só, uma medida de cobertura ou qualidade absoluta.

### 13.2 Revisões relevantes

| Revisão | Significado |
| --- | --- |
| `5baed0a1c5294a457edd40aa294b3c9925a26f92` | Baseline observado do repositório principal antes da estabilização |
| `36b1496593276508187b1aac1750b62b2b71940a` | Commit indicado pelo antigo gitlink; histórico não recuperado |
| `3472194539bc7e128e22717e9a96eced22cea480` | Consolidação inicial da estabilização |
| `bc9cc5ee2bfc5f79db09deca7acc5b9cb8a1fc4d` | Correções de aquisição Windows e proteção do banco; código utilizado na validação limpa final |
| `33dd6bd4ab73dbe960ecffbc045847ec396bcb1d` | Preservação dos bytes do contrato fornecido |
| `bba4a219c0686327ae2d3748f63db836a9e5b560` | Registro das evidências do clone e da correção Git |

As revisões posteriores à execução completa não introduziram mudanças no código de execução validado; registraram preservação do contrato e evidências. Os identificadores permitem consultar cada etapa sem atribuir resultados ao baseline errado.

### 13.3 Limitações técnicas ainda registradas

A instalação anterior com auditoria informou quatro alertas de severidade alta em dependências. A instalação final utilizou `--no-audit`, portanto não produziu uma nova avaliação desses alertas. Eles não devem ser descritos como resolvidos.

O build web manteve um aviso de tamanho de chunk. Não foi introduzida uma mudança de divisão de código apenas para eliminar esse aviso. Autenticação, autorização, paginação e outras expansões de produto também não fizeram parte desta estabilização.

## 14. As quatro tarefas pendentes

As quatro tarefas abertas não representam quatro funcionalidades ausentes do CRUD. Elas tratam de fontes históricas, validação externa e encerramento formal.

| Tarefa | O que falta | Efeito no funcionamento atual |
| --- | --- | --- |
| 1.2 | Recuperar o histórico original do backend e comprovar a origem do commit referenciado | Não impede o backend atual de executar; limita a rastreabilidade histórica |
| 1.4 | Localizar uma fonte independente verificável do contrato original v1 | Não altera o CRUD; limita a comparação histórica dos contratos |
| 8.3 | Executar CI remota para o SHA correto e registrar URL, jobs e status | Não impede a execução local; falta comprovação em outro ambiente automatizado |
| 9.3 | Encerrar e arquivar formalmente a mudança após comprovar os gates obrigatórios | Não altera o comportamento; mantém o processo OpenSpec aberto |

A execução local foi concluída e comprovada no escopo registrado. O fechamento acadêmico e processual permanece parcial. Manter essas tarefas abertas evita uma declaração incorreta de conclusão total.

## 15. Interpretação acadêmica

### 15.1 O que esta intervenção permite afirmar

O caso demonstra que um artefato funcional desenvolvido com assistência de IA pode apresentar problemas de aquisição, organização de responsabilidades e segurança de testes. Também demonstra, neste projeto, a aplicação de um processo explícito para diagnosticar, preservar, corrigir e verificar esses problemas.

O OpenSpec forneceu a organização dos requisitos e tarefas; a execução agentic realizou as ações e respondeu às verificações; as ferramentas de desenvolvimento produziram evidências locais. A contribuição observável é o artefato estabilizado e seu registro técnico.

### 15.2 O que não pode ser concluído

Não há base suficiente para afirmar que a IA foi mais rápida que um desenvolvedor humano, calcular economia de tempo ou generalizar a superioridade de uma metodologia. Também não é possível reconstruir todos os passos do backend original a partir de um histórico que não foi recuperado.

Resultados atuais não comprovam que o experimento original já possuía essas correções. A estabilização deve ser identificada como intervenção posterior. Comparações causais exigiriam protocolo experimental, métricas, versões completas e condições de controle que este relatório não inventa.

### 15.3 Classificação das mudanças

| Tipo | Aplicação nesta etapa |
| --- | --- |
| Refatoração | Movimentação dos adaptadores, localização do SDK, injeção de ID e reorganização de cenários E2E |
| Correção | Gitlink inadequado, proteção de banco, restauração do workflow e aquisição consistente no Windows |
| Extensão de validação | Testes arquiteturais, casos de segurança e registros de reprodução |
| Rebuild | Não realizado na estabilização |

Para um TCC com projeto de escala limitada, foram priorizadas soluções proporcionais: aproveitar TypeScript e Vitest existentes, manter PostgreSQL, evitar frameworks adicionais de arquitetura e preservar o CRUD. A aplicação continua simples, enquanto os critérios de verificação se tornam explícitos.

Ao apresentar o trabalho, recomenda-se manter separadas a construção original, a auditoria do estado recebido e a estabilização posterior. Os relatórios e revisões permitem sustentar essa distinção com fontes consultáveis.

## 16. Documentos para consulta

| Documento | Conteúdo |
| --- | --- |
| [Relatório original do backend](use-api/RELATORIO_PROJETO.md) | Construção e validações históricas da API |
| [Relatório Full Stack original](RELATORIO_FULLSTACK.md) | Frontend, integração e validações históricas |
| [Contrato fornecido](openspec.md) | Fonte técnica recebida do usuário |
| [Proposta da estabilização](openspec/changes/stabilize-tcc-artifact/proposal.md) | Motivação e escopo |
| [Design da estabilização](openspec/changes/stabilize-tcc-artifact/design.md) | Decisões e condições de implementação |
| [Lista de tarefas](openspec/changes/stabilize-tcc-artifact/tasks.md) | Situação das 28 tarefas |
| [Integridade do repositório](openspec/changes/stabilize-tcc-artifact/specs/repository-integrity/spec.md) | Requisitos de aquisição e preservação |
| [Contrato arquitetural da mudança](openspec/changes/stabilize-tcc-artifact/specs/architecture-contract/spec.md) | Requisitos de camadas e dependências |
| [Reprodutibilidade dos testes](openspec/changes/stabilize-tcc-artifact/specs/test-reproducibility/spec.md) | Requisitos de execução e segurança |
| [Rastreabilidade acadêmica](openspec/changes/stabilize-tcc-artifact/specs/academic-traceability/spec.md) | Requisitos de classificação e evidência |
| [Baseline](docs/tcc/baseline.md) | Estado observado e preservação |
| [Contrato v2](docs/tcc/architecture-contract-v2.md) | Interpretação arquitetural implementada |
| [Divergências do contrato](docs/tcc/contract-drift.md) | Diferenças entre fontes e decisões |
| [Classificação das mudanças](docs/tcc/change-classification.md) | Separação entre intervenção e história do experimento |
| [Correção do gitlink](docs/tcc/gitlink-repair.md) | Diagnóstico e evidências de versionamento |
| [Receita e evidências de reprodução](docs/tcc/reproducibility.md) | Ambiente, comandos e resultados locais |
| [Evidência de CI](docs/tcc/ci-evidence.md) | Situação da validação remota |

Este relatório consolida a leitura do processo. Os documentos específicos conservam os detalhes necessários para conferir as decisões, reproduzir as verificações e identificar o que permanece sem comprovação.
