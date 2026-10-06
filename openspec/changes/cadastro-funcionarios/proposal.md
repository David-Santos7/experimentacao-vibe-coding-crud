# Proposal

## Why

O sistema atualmente gerencia apenas usuários e não oferece um cadastro próprio para representar funcionários e seus dados organizacionais. A nova capacidade permitirá manter o quadro funcional com regras de negócio isoladas e alinhadas à Clean Architecture já adotada pelo backend.

## What Changes

- Adicionar cadastro completo de funcionários, com criação, consulta, listagem, edição e exclusão.
- Registrar nome, e-mail corporativo, cargo, departamento, data de admissão e situação ativa/inativa.
- Validar campos obrigatórios, formato de e-mail, unicidade do e-mail corporativo e consistência da data de admissão.
- Expor endpoints HTTP dedicados em `/employees`, com respostas e erros consistentes com o CRUD de usuários.
- Adicionar telas responsivas para listar, cadastrar, visualizar e editar funcionários, incluindo confirmação de exclusão e feedback de sucesso/erro.
- Persistir funcionários no PostgreSQL por meio de um repositório Prisma, preservando a separação entre domínio, aplicação, infraestrutura e apresentação.
- Cobrir regras de domínio, casos de uso, persistência, API, interface e fluxo ponta a ponta com testes automatizados.

## Capabilities

### New Capabilities

- `employee-management`: Gerenciamento do ciclo de vida de funcionários e de seus dados organizacionais por API e interface web.

### Modified Capabilities

Nenhuma.

## Impact

- Backend: nova entidade de domínio, casos de uso, contrato e implementação de repositório, erros de aplicação, schemas HTTP, controller, rotas e composição de dependências.
- Banco de dados: novo modelo/tabela de funcionários e migration Prisma, com restrição de unicidade para o e-mail corporativo.
- Frontend: novo módulo `employees`, rotas, cliente HTTP, formulários, páginas e componentes de listagem/detalhes.
- Testes: novas suítes unitárias, de integração, HTTP, componentes e Playwright.
- API: novos endpoints sob `/employees`; os contratos existentes de `/users` permanecem inalterados.
