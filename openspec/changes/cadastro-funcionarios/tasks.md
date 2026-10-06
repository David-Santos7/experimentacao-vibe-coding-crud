# Tasks

## 1. Domínio e aplicação

- [ ] 1.1 Implementar a entidade `Employee` com normalização e invariantes de nome, e-mail corporativo, cargo, departamento, data de admissão e status; verificar com testes unitários de casos válidos, campos vazios, e-mail inválido, status inválido e data futura.
- [ ] 1.2 Definir a porta `EmployeeRepository`, o double em memória e os erros específicos de funcionário; verificar que os testes TypeScript compilam sem dependência de Prisma ou Express nas camadas de domínio/aplicação.
- [ ] 1.3 Implementar os casos de uso de criação e atualização parcial, incluindo unicidade case-insensitive do e-mail; verificar com testes unitários de sucesso, conflito, dados inválidos, preservação de campos e registro inexistente.
- [ ] 1.4 Implementar os casos de uso de consulta individual, listagem e exclusão; verificar com testes unitários para coleção vazia, registros existentes e identificadores inexistentes.

## 2. Persistência PostgreSQL

- [ ] 2.1 Adicionar `EmployeeStatus` e `Employee` ao schema Prisma, com tabela `employees` e e-mail corporativo único, gerar uma migration aditiva e verificar com `prisma validate` e inspeção do SQL sem alterações destrutivas em `users`.
- [ ] 2.2 Implementar `PrismaEmployeeRepository`, incluindo mapeamento entre entidade e registro e tradução de conflito de unicidade; verificar com testes de integração de criação, consulta, listagem, atualização, exclusão e e-mail duplicado no banco de teste.

## 3. API HTTP e composição

- [ ] 3.1 Criar schemas Zod para UUID, criação e atualização de funcionário, incluindo rejeição de PATCH vazio; verificar com testes HTTP para payloads válidos e inválidos.
- [ ] 3.2 Criar `EmployeesController` e rotas REST em `/employees`, com apresentação consistente de datas e todos os campos; verificar com testes HTTP dos status 201, 200, 204, 400, 404 e 409.
- [ ] 3.3 Registrar erros de funcionário no middleware central e conectar repositório, casos de uso, controller e router no composition root e no app; verificar que erros conhecidos não viram 500 e que a suíte existente de usuários continua passando.
- [ ] 3.4 Atualizar a documentação da API no README com campos, rotas e erros de funcionários; verificar que exemplos e códigos documentados correspondem aos testes HTTP.

## 4. Módulo web de funcionários

- [ ] 4.1 Criar tipos, schema de formulário e cliente HTTP em `features/employees`, mantendo `hireDate` como `YYYY-MM-DD`; verificar com testes do schema para campos obrigatórios, e-mail, status e data futura.
- [ ] 4.2 Implementar o formulário reutilizável de criação/edição com mensagens acessíveis, estado de envio e preservação dos dados após erro; verificar com testes de componente de validação, submissão e falha da API.
- [ ] 4.3 Implementar as páginas de criação, detalhes e edição e registrar `/employees/new`, `/employees/:id` e `/employees/:id/edit`; verificar com testes de navegação, carregamento, sucesso, 404 e conflito de e-mail.
- [ ] 4.4 Implementar a listagem responsiva com tabela/cartões, estados de carregamento, vazio e erro, além do diálogo de exclusão; verificar com testes de recarregamento, cancelamento sem chamada HTTP, exclusão confirmada e feedback ao operador.
- [ ] 4.5 Adicionar uma entrada de navegação para funcionários sem remover o acesso a usuários e atualizar o README com as novas rotas web; verificar por teste de roteamento e navegação em viewport móvel e desktop.

## 5. Integração da funcionalidade

- [ ] 5.1 Adicionar cenário Playwright do fluxo persistido de funcionários, com criação, edição, conflito de e-mail, cancelamento e confirmação de exclusão e persistência após refresh; verificar com `npm run test:e2e` e limpeza restrita aos registros prefixados pelo teste.
- [ ] 5.2 Executar `npm test`, `npm run lint`, `npm run format:check` e `npm run build`; corrigir regressões até todos os comandos concluírem com sucesso, incluindo o CRUD existente de usuários.
