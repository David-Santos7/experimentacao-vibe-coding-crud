# Spec Delta

## Purpose

Definir as fronteiras arquiteturais verificáveis do artefato mantido e assegurar que a reorganização preserve seu comportamento público.

## ADDED Requirements

### Requirement: Automated dependency boundaries
A validação arquitetural SHALL recusar dependências de entidades e casos de uso para adaptadores, frameworks, persistência ou detalhes de plataforma externos, inclusive por tipos e reexports.

#### Scenario: External dependency introduced in inner layer
- **GIVEN** uma dependência proibida direta, de tipo ou transitiva introduzida em cópia temporária
- **WHEN** a validação arquitetural é executada
- **THEN** retorna falha identificando origem e destino e impede aprovação na CI.

#### Scenario: Existing inner layers are fully checked
- **WHEN** a validação percorre as entidades e casos de uso
- **THEN** todos os arquivos internos são cobertos, imports resolvidos são avaliados e ausência das camadas ou dependência não verificável causa falha.

### Requirement: CRUD behavioral compatibility
A reorganização SHALL preservar rotas, campos públicos, códigos HTTP, normalização, unicidade de e-mail, atualização parcial e persistência do CRUD existente.

#### Scenario: Maintained user lifecycle
- **WHEN** usuário válido é criado, consultado, atualizado parcialmente, listado e excluído
- **THEN** os contratos atuais de /users são preservados e nenhum campo interno da entidade é exposto.

#### Scenario: Existing validation and conflict behavior
- **WHEN** payload inválido, PATCH vazio, identificador inexistente ou e-mail duplicado é enviado
- **THEN** respostas correspondentes 400, 404 ou 409 são preservadas conforme o caso.

### Requirement: Role is registration data
O contrato mantido SHALL apresentar USER e ADMIN como valores cadastrais, exigir role na criação, permitir sua omissão no PATCH e não atribuir privilégios inexistentes.

#### Scenario: Role creation and update
- **WHEN** criação omite role ou envia valor fora do enum
- **THEN** entrada é rejeitada; PATCH sem role preserva o valor existente e nenhuma operação depende de privilégio ADMIN.

