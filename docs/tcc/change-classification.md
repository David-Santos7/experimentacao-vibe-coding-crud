# Classificação acadêmica

Baseline observado: `5baed0a1c5294a457edd40aa294b3c9925a26f92`; pai anterior `189df1cbb75689db41a5dfe6f469e645783d8b54`. O backend era gitlink `36b1496593276508187b1aac1750b62b2b71940a`, cujo objeto não foi recuperado.

As narrativas de rebuild/refatoração anteriores não podem ser comprovadas pelos diffs do backend ausente. Permanecem não verificadas; os relatórios originais não foram editados para parecer mais maduros.

`git diff 189df1c 5baed0a --stat` mostra somente remoção do workflow CI (92 linhas). Essa fase observável é remoção de infraestrutura de validação, não prova refatoração ou rebuild do backend. A restauração atual corrige a divergência entre checkout e README.

Esta estabilização pós-experimento inclui:

- Refatoração: movimentação de adaptadores e saída gerada, injeção da geração de ID e divisão de cenários E2E, preservando comportamento.
- Correção: gitlink sem submódulo, proteção de cleanup e restauração do workflow ausente.
- Extensão de validação: teste automatizado da Dependency Rule e registros de evidência.
- Rebuild: nenhum realizado nesta mudança.

Os arquivos corrigidos ainda não constituem resultado histórico do baseline. Registrar SHA candidato após commit e vincular novas execuções a ele; nunca atribuir resultados atuais aos commits antigos.
