# Spec Delta

## Purpose

Permitir que operadores mantenham um cadastro confiável de funcionários e seus dados organizacionais por meio da API e da interface web.

## ADDED Requirements

### Requirement: Criar funcionário
O sistema SHALL permitir criar um funcionário com nome, e-mail corporativo, cargo, departamento, data de admissão e situação, gerando identificador e timestamps.

#### Scenario: Cadastro válido
- **WHEN** o operador envia todos os campos válidos e um e-mail corporativo ainda não cadastrado
- **THEN** o sistema persiste o funcionário e retorna seus dados com status HTTP 201

#### Scenario: Dados obrigatórios inválidos
- **WHEN** o operador omite um campo obrigatório, informa e-mail inválido ou uma data de admissão futura
- **THEN** o sistema rejeita o cadastro com status HTTP 400 e não persiste o funcionário

#### Scenario: E-mail corporativo duplicado
- **WHEN** o operador informa um e-mail corporativo já associado a outro funcionário, desconsiderando diferenças entre maiúsculas e minúsculas
- **THEN** o sistema rejeita o cadastro com status HTTP 409 e mantém o registro existente inalterado

### Requirement: Consultar funcionários
O sistema SHALL permitir listar todos os funcionários e consultar um funcionário individualmente por seu identificador.

#### Scenario: Listagem com registros
- **WHEN** o operador acessa a listagem e existem funcionários cadastrados
- **THEN** o sistema retorna status HTTP 200 com os dados de todos os funcionários

#### Scenario: Listagem vazia
- **WHEN** o operador acessa a listagem e não existem funcionários cadastrados
- **THEN** o sistema retorna status HTTP 200 com uma coleção vazia e a interface apresenta um estado vazio

#### Scenario: Consulta por identificador existente
- **WHEN** o operador consulta um identificador de funcionário existente
- **THEN** o sistema retorna status HTTP 200 com todos os dados do funcionário

#### Scenario: Consulta por identificador inexistente
- **WHEN** o operador consulta um identificador válido que não corresponde a um funcionário
- **THEN** o sistema retorna status HTTP 404

### Requirement: Atualizar funcionário
O sistema SHALL permitir atualizar parcialmente os dados de um funcionário, preservando os campos não enviados e renovando o timestamp de atualização.

#### Scenario: Atualização válida
- **WHEN** o operador altera um ou mais campos com valores válidos
- **THEN** o sistema persiste as alterações e retorna o funcionário atualizado com status HTTP 200

#### Scenario: Atualização sem campos
- **WHEN** o operador envia uma atualização sem qualquer campo alterável
- **THEN** o sistema rejeita a solicitação com status HTTP 400

#### Scenario: Atualização para e-mail duplicado
- **WHEN** o operador altera o e-mail para um endereço pertencente a outro funcionário
- **THEN** o sistema rejeita a alteração com status HTTP 409 e mantém ambos os registros inalterados

#### Scenario: Atualização de funcionário inexistente
- **WHEN** o operador tenta atualizar um identificador que não corresponde a um funcionário
- **THEN** o sistema retorna status HTTP 404

### Requirement: Excluir funcionário
O sistema SHALL permitir excluir permanentemente um funcionário após confirmação explícita na interface.

#### Scenario: Exclusão confirmada
- **WHEN** o operador confirma a exclusão de um funcionário existente
- **THEN** o sistema remove o registro, retorna status HTTP 204 e a interface deixa de exibi-lo

#### Scenario: Exclusão de funcionário inexistente
- **WHEN** o operador solicita a exclusão de um identificador que não corresponde a um funcionário
- **THEN** o sistema retorna status HTTP 404

#### Scenario: Exclusão cancelada
- **WHEN** o operador cancela a confirmação de exclusão na interface
- **THEN** a interface fecha a confirmação sem enviar a solicitação de exclusão

### Requirement: Experiência web de gerenciamento
A interface SHALL oferecer rotas responsivas e acessíveis para listar, criar, visualizar e editar funcionários, comunicando estados de carregamento, sucesso e falha.

#### Scenario: Navegação pelo cadastro
- **WHEN** o operador usa as ações disponíveis na listagem, formulário ou detalhes
- **THEN** a interface navega entre `/employees`, `/employees/new`, `/employees/:id` e `/employees/:id/edit` conforme a ação

#### Scenario: Falha de comunicação
- **WHEN** uma operação da API falha
- **THEN** a interface mantém dados já informados quando aplicável e apresenta uma mensagem de erro compreensível com opção de nova tentativa quando pertinente

