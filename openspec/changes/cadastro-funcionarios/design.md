# Design

## Context

O repositório possui um CRUD full stack de usuários que já estabelece os limites arquiteturais e as convenções do projeto: React consome somente o contrato HTTP; a API Express encaminha requisições para casos de uso; a aplicação depende de uma interface de repositório; e a infraestrutura implementa essa porta com Prisma/PostgreSQL. Ver `proposal.md` para a motivação e `specs/employee-management/spec.md` para o comportamento requerido.

A funcionalidade de funcionários atravessa domínio, aplicação, persistência, HTTP e frontend. Ela deve ser independente do agregado `User`, pois usuário representa acesso à aplicação enquanto funcionário representa vínculo organizacional; não há autenticação nem associação entre ambos no escopo atual.

## Goals / Non-Goals

**Goals:**

- Preservar o sentido das dependências da Clean Architecture no backend.
- Manter o contrato HTTP e a experiência web coerentes com o módulo existente de usuários.
- Fazer das regras de funcionário invariantes do domínio, independentemente de Express, Zod ou Prisma.
- Garantir unicidade do e-mail tanto na aplicação quanto no banco para lidar com concorrência.

**Non-Goals:**

- Compartilhar ou herdar entidades, repositórios e casos de uso de `User`.
- Criar autenticação, autorização, vínculo funcionário-usuário, folha de pagamento ou histórico funcional.
- Adicionar paginação, busca, filtros ou exclusão lógica nesta mudança.
- Extrair um design system ou abstrações CRUD genéricas.

## Decisions

### 1. Modelar Employee como agregado independente

`Employee` possuirá `id`, `name`, `corporateEmail`, `position`, `department`, `hireDate`, `status`, `createdAt` e `updatedAt`. `status` será o enum `ACTIVE | INACTIVE`; textos serão normalizados com `trim`, o e-mail também será convertido para minúsculas e `hireDate` não poderá estar no futuro.

Isso mantém as invariantes próximas aos dados que protegem e evita acoplar cadastro funcional às roles de acesso de `User`. A alternativa de estender `User` foi descartada porque mistura identidades com ciclos de vida e permissões distintos.

### 2. Replicar os limites arquiteturais, sem generalizar o CRUD

Serão criados a porta `EmployeeRepository`, os cinco casos de uso, uma implementação Prisma, controller, schemas HTTP, rotas e composição próprios. Os casos de uso dependerão apenas da porta e da entidade; Express e Prisma continuarão nas camadas externas.

Uma base genérica para CRUD reduziria repetição imediata, mas foi rejeitada porque esconderia regras e tipos específicos, aumentaria o impacto sobre código estável e enfraqueceria a demonstração de Clean Architecture do projeto.

### 3. Usar tabela e migration independentes

O Prisma receberá um enum de situação e um modelo `Employee` mapeado para `employees`, com chave UUID fornecida pela aplicação e índice único para `corporateEmail`. A aplicação consultará duplicidade para oferecer erro de domínio previsível, e a camada externa traduzirá também violações concorrentes da restrição única para HTTP 409.

Confiar somente na consulta prévia foi descartado por permitir corrida entre requisições; confiar somente na exceção do banco produziria tratamento mais acoplado e uma experiência menos explícita.

### 4. Manter um módulo frontend isolado por feature

O frontend ganhará `features/employees` com tipos, schema Zod, cliente HTTP, formulário, componentes e páginas equivalentes às rotas requeridas. Componentes visuais genéricos existentes serão reutilizados, mas código específico de usuários não será importado pelo novo módulo.

Adaptar as telas de usuários com parâmetros genéricos foi descartado nesta etapa para evitar uma refatoração transversal sem benefício funcional necessário.

### 5. Preservar o envelope e os códigos HTTP atuais

Os endpoints serão `POST /employees`, `GET /employees`, `GET /employees/:id`, `PATCH /employees/:id` e `DELETE /employees/:id`, usando 201, 200, 204, 400, 404, 409 e 500 nos mesmos sentidos do módulo atual. Novos erros específicos de funcionário serão incluídos no middleware central, sem expor detalhes internos.

Uma API versionada ou aninhada sob `/api` foi descartada porque criaria inconsistência com `/users` sem uma migração global planejada.

## Risks / Trade-offs

- [Duplicação estrutural entre users e employees] → Manter módulos explícitos agora e avaliar extrações somente após surgir um terceiro caso concreto.
- [Corrida na verificação de e-mail] → Aplicar restrição única no PostgreSQL e traduzir a violação para o mesmo conflito HTTP 409.
- [Data sem horário interpretada com fuso incorreto] → Tratar `hireDate` como data civil no contrato (`YYYY-MM-DD`) e normalizar de modo consistente antes da persistência e apresentação.
- [Exclusão permanente acidental] → Exigir confirmação na interface e testar que cancelar não dispara chamada HTTP.
- [Crescimento do bundle com novas páginas] → Seguir o carregamento atual; code splitting permanece fora do escopo e pode ser tratado transversalmente depois.

## Migration Plan

1. Adicionar o modelo e gerar uma migration aditiva para `employees`, sem alterar `users`.
2. Implantar a API com os novos endpoints; clientes existentes continuam compatíveis.
3. Implantar o frontend com as novas rotas e acesso de navegação ao módulo.
4. Executar testes e smoke test de criação, atualização e exclusão em ambiente de validação.

Rollback: reverter frontend e API para a versão anterior. A tabela aditiva pode permanecer sem uso para preservar dados; sua remoção deverá ocorrer apenas em migration posterior deliberada, após confirmação de que não há registros a conservar.
