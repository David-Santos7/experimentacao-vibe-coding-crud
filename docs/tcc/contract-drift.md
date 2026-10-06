# Drift de contrato

Identificado em 2026-10-05. A fonte fornecida `openspec.md` afirma contrato histórico Node/Express/Clean Architecture/SQLite. O checkout usa TypeScript/Node/Express/Prisma/PostgreSQL e inclui React/Vite e Playwright. Mantém-se PostgreSQL: troca de banco não é necessária para corrigir a Dependency Rule.

O original independente v1 não foi localizado; não afirmar que foi preservado ou reconstruí-lo por memória. A fonte fornecida permanece byte a byte e o alvo passa a ser `architecture-contract-v2.md`.

O campo role também excede a descrição histórica de id/nome/e-mail: USER/ADMIN são atributos cadastrais, sem autorização; obrigatório na criação, omitível na edição, sem default em Prisma. A matriz de dependências está no contrato v2.

URL fornecida: `David-Santos7/vibe-coding-experimentacao-crud`; remote observado: `David-Santos7/experimentacao-vibe-coding-crud`. Não foi alterada a configuração remota nem presumida equivalência.

Decisão explícita do usuário: prosseguir apesar do histórico indisponível, conservando o histórico acessível e snapshot local. Essa exceção não transforma histórico não recuperado em preservação integral.
