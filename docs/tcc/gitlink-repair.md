# Correção do gitlink use-api

## Diagnóstico antes da modificação

Root: CRUD-TCC. Baseline `5baed0a1c5294a457edd40aa294b3c9925a26f92`, branch main. `git ls-files --stage use-api` retornava um gitlink modo 160000 para `36b1496593276508187b1aac1750b62b2b71940a`. Não existiam use-api/.git ou .gitmodules. `git -C use-api rev-parse --show-toplevel` retornava o root pai. Portanto não havia repositório interno acessível ou submódulo formal que pudesse fornecer o histórico.

`git cat-file -t` não encontrou esse objeto. `git ls-remote --heads --tags origin` anunciou somente main; clone bare/fetch do SHA retornou not our ref. Isso não prova perda definitiva; outra fonte pode conter o histórico.

## Preservação e decisão

Auditoria registrada em baseline.md antes da correção. Bundle do pai criado fora da árvore, verificado com git bundle verify; snapshot dos fontes locais, contrato e manifesto SHA256 conservados na pasta de backup indicada nesse documento. Nenhum .git foi apagado. HEAD original não foi resetado, rebaseado ou substituído. Não houve force-push.

O usuário autorizou prosseguir apesar do bloqueio histórico. A correção NÃO recuperou o histórico inacessível do backend, não alega preservação integral e não fabrica commits antigos. Preservou o histórico disponível do pai e o código local. `openspec.md` conserva SHA256 4D033F200A9164D457C80363B7600D2DE9C4878F96C529339FEB0BD989AAE3E6.

## Operações efetuadas

1. `git rm --cached -- use-api`: removeu somente a entrada gitlink do índice, sem excluir a pasta.
2. `git add -- use-api`: registrou arquivos reais, respeitando ignores de .env, node_modules, build e SDK gerado.
3. Correções consolidadas na branch local `stabilize-tcc-artifact`; main ficou no baseline.
4. Commit inicial de estabilização `3472194539bc7e128e22717e9a96eced22cea480`; ajuste de reprodução Windows/guard `bc9cc5ee2bfc5f79db09deca7acc5b9cb8a1fc4d`.
5. `.gitattributes` exige LF para fontes em clone Windows, preservando openspec.md byte a byte. Um checkout antigo retinha CRLF; clone novo confirmou LF. Tentativa de renormalização não mudou blobs já normalizados e não produziu commit extra.
6. A primeira inclusão de openspec.md no Git normalizou suas linhas, embora o arquivo original do workspace nunca tenha sido alterado. A comparação SHA256 entre fonte e clone detectou a diferença. Commit `33dd6bd4ab73dbe960ecffbc045847ec396bcb1d` registrou os bytes originais sob a exceção -text; o blob agora é idêntico ao arquivo fornecido. Nenhum código de aplicação foi alterado nesse commit.

## Evidências verificadas

| Verificação | Resultado |
| --- | --- |
| git ls-files --stage use-api | 121 arquivos rastreados, zero entradas 160000 |
| Test-Path use-api/.git | False |
| Test-Path .gitmodules | False; nenhuma dependência de submódulo |
| git -C use-api rev-parse --show-toplevel | Root pai correto |
| git merge-base --is-ancestor BASELINE HEAD | Exit 0, baseline preservado |
| git bundle verify backup/parent.bundle | Bundle válido com histórico disponível e refs originais |
| Clone local comum da branch | Backend/frontend reais presentes; arquivos independem de metadados internos |
| npm ci no clone | Instalou 696 pacotes; sem node_modules/.env/build do original |

Clone novo verificado: `C:/Users/Highlander/AppData/Local/Temp/tcc-verified-clone-d3135943da4d492697be0b0b5d5fdab0`. Resultados de execução em reproducibility.md. Não houve publicação remota: o GitHub ainda depende de push posterior autorizado.

## Risco residual e recuperação

O commit 36b1496... e o documento original v1 independente continuam não recuperados. Preservar o bundle/snapshot em armazenamento durável: a pasta temporária não é arquivo permanente do TCC. Se a fonte original surgir, importar seu histórico em ensaio isolado e registrar a ligação aos hashes originais, sem reescrever o baseline.

Foi conservada também uma cópia local em `evidence-backups/pre-stabilization/`, incluindo bundle, snapshot e manifesto SHA256. Esse diretório é ignorado pelo Git para não publicar backups como código; não existe no clone e não é dependência de execução. Manter uma cópia externa adicional sob responsabilidade do TCC.

Rollback disponível: manter branch main original ou restaurar cópia em diretório separado a partir do bundle validado. Não aplicar reset --hard ou excluir metadados no checkout do usuário. Os arquivos não rastreados de .agents e da mudança cadastro-funcionarios permanecem presentes e não foram descartados.
