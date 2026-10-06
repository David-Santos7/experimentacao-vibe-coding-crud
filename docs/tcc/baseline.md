# Baseline — auditoria inicial

## Revisão autorizada e backup antes da correção

Em 2026-10-05 o usuário autorizou explicitamente prosseguir apesar do histórico indisponível. Conserva-se esta auditoria e registra-se a lacuna; preservação integral do histórico do backend NÃO é alegada.

Bundle do pai criado com `git bundle create --all` e validado com `git bundle verify`: `C:/Users/HIGHLA~1/AppData/Local/Temp/tcc-baseline-2be7e01219dd4f078871517347369833/parent.bundle`. Contém HEAD e refs locais/remotas disponíveis. A mesma pasta contém snapshot dos fontes/configurações locais do backend, sem `.env`, node_modules ou builds, e cópia de `openspec.md`. Esse backup deve ser conservado em armazenamento durável pelo responsável do TCC.

SHA256 de `openspec.md`: `4D033F200A9164D457C80363B7600D2DE9C4878F96C529339FEB0BD989AAE3E6`.
SHA256 do lockfile raiz antes das correções: `799F8477E086BF824F59F487F0FCCC194FBF18FA1EC3168C6463305001F170D2`.

Node v24.14.1, npm 11.12.1. Relatório anterior alega 53 testes Vitest; não confundir com execução posterior à correção. Nenhuma tag de estado limpo foi criada, pois havia arquivos não rastreados.

Após backup: `git rm --cached -- use-api` removeu apenas o gitlink do índice; `git add -- use-api` registrou arquivos reais sem apagar fontes. HEAD e histórico do pai permanecem intactos. Clone do commit candidato será validado após registro das correções; a ausência histórica não impede os demais trabalhos autorizados.

Verificação final: main conserva `5baed0a1c5294a457edd40aa294b3c9925a26f92`; branch isolate `stabilize-tcc-artifact` é descendente desse baseline. Índice contém 121 arquivos de use-api e zero gitlinks. Clone novo e validações passaram, registrados em reproducibility.md e gitlink-repair.md. Essas evidências posteriores não alteram os resultados da auditoria original abaixo.

Captura: 2026-10-05T20:29:52-03:00. Mudança: `stabilize-tcc-artifact`. Estado: auditoria concluída; preservação integral e reparação bloqueadas por histórico indisponível.

## Estado observado

- Root: `C:/Users/Highlander/Documents/TCC-Arquitetura-IA/CRUD-TCC`.
- HEAD: `5baed0a1c5294a457edd40aa294b3c9925a26f92`.
- Branch: `main`, tracking `origin/main`.
- Histórico local observado: `5baed0a` e `189df1c`.
- Remote: `https://github.com/David-Santos7/experimentacao-vibe-coding-crud.git`.
- URL indicada em `openspec.md`: `https://github.com/David-Santos7/vibe-coding-experimentacao-crud.git`. Equivalência não comprovada; remote não alterado.
- Status anterior às alterações desta sessão: `?? .agents/`, `?? openspec.md`, `?? openspec/`; nenhum arquivo rastreado modificado.
- Índice do backend: `160000 36b1496593276508187b1aac1750b62b2b71940a 0 use-api`.
- `use-api/.git` e `.gitmodules` ausentes. Git executado em `use-api` retorna root e HEAD do pai, não um histórico independente.

## Comandos e resultados

| Comando | Resultado |
| --- | --- |
| `git status --short --branch` | `main...origin/main`, diretórios/fontes não rastreados acima |
| `git rev-parse --show-toplevel` / `git rev-parse HEAD` | Root e SHA acima |
| `git remote -v` / `git branch -vv` | Remote e tracking acima |
| `git log --oneline --decorate --graph --all --max-count=50` | Dois commits locais do pai |
| `git ls-files --stage use-api` | Gitlink 160000 acima |
| `git submodule status` | Falha: `no submodule mapping found in .gitmodules for path 'use-api'` |
| `git -C use-api rev-parse --show-toplevel` / `rev-parse HEAD` | Mesmo root e HEAD do pai |
| `git cat-file -t 36b1496593276508187b1aac1750b62b2b71940a` | Falha: objeto indisponível localmente |
| `git ls-remote --heads --tags origin` | Após autorização de rede: somente `refs/heads/main`, SHA do HEAD acima |
| Clone bare em pasta temporária | Concluído, sem alteração do checkout original |
| Fetch do SHA do gitlink no clone bare | Falha: `upload-pack: not our ref 36b1496593276508187b1aac1750b62b2b71940a` |
| Consulta do objeto após fetch | Falha: `could not get object info` |

Clone de investigação: `C:/Users/HIGHLA~1/AppData/Local/Temp/tcc-history-recovery-c8aa3e66d38f432facb8242fe7f1880f`. É uma cópia de investigação do pai, não backup validado do backend nem evidência de reprodução.

## Gate e limitações

O remoto configurado não forneceu o commit referenciado. Isso não prova perda definitiva: pode haver outro repositório ou backup. É necessária uma fonte verificável contendo esse commit/histórico para cumprir a tarefa 1.2.

Não foram alterados branch, índice, refs ou arquivos de implementação no checkout. As únicas edições desta sessão são este registro e a marcação da auditoria nas tarefas. Nenhum arquivo do usuário foi descartado; `openspec.md` permanece intacto.

Baseline integral, bundles verificados, hashes/snapshots, contrato original v1, classificação histórica, testes, banco e CI permanecem pendentes. Nenhuma aprovação antiga de testes foi reproduzida nesta sessão.
