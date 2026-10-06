# Spec Delta

## Purpose

Permitir que testes e validações sejam reproduzidos com segurança em ambiente isolado e relacionados ao commit efetivamente avaliado.

## ADDED Requirements

### Requirement: Fail closed test database protection
Operações destrutivas de setup e cleanup SHALL ser recusadas se a URL de teste estiver ausente, inválida, apontar ao mesmo destino de desenvolvimento/produção, usar banco não permitido ou ambiente não configurado para testes.

#### Scenario: Unsafe database selected
- **GIVEN** qualquer uma das condições inseguras, inclusive credenciais distintas para o mesmo destino
- **WHEN** setup ou cleanup destrutivo é solicitado
- **THEN** ocorre falha antes da operação no banco, sem expor credenciais.

#### Scenario: Approved isolated test database
- **GIVEN** ambiente de teste explícito e destino permitido distinto de desenvolvimento/produção
- **WHEN** testes executam preparação e limpeza
- **THEN** somente o banco de teste autorizado é utilizado.

### Requirement: Independent E2E execution
A suíte E2E SHALL permitir diagnóstico por cenário, utilizar URLs de API/web de fonte única e limpar apenas registros pertencentes à própria execução.

#### Scenario: Execute individual scenario
- **WHEN** cenário de criação, edição, conflito, exclusão ou persistência é executado isoladamente
- **THEN** prepara seus dados sem depender de cenário anterior e remove apenas os registros que criou.

#### Scenario: API endpoint configuration changes
- **WHEN** a URL da API E2E é alterada na fonte de configuração
- **THEN** requisições dos testes, frontend e inicialização da API utilizam o mesmo destino, sem alterações em literals nos specs.

### Requirement: Clean clone validation
A validação SHALL executar instalação, geração, migrations, formatação, lint, TypeScript, arquitetura, testes, builds e E2E em clone limpo do commit candidato com serviços descartáveis.

#### Scenario: Reproduction is recorded
- **WHEN** a sequência documentada é executada sem caches ou arquivos privados herdados
- **THEN** cada resultado real é registrado com comando, ambiente e SHA, incluindo falhas e duração quando disponível.

### Requirement: Real CI evidence
A conclusão do gate CI SHALL exigir execução real vinculada ao SHA exato, com identificador, URL, data, jobs e status final verificáveis.

#### Scenario: No remote execution access
- **WHEN** somente workflow ou testes locais estão disponíveis
- **THEN** evidência indica NÃO VERIFICADO EM CI e o gate permanece aberto.

