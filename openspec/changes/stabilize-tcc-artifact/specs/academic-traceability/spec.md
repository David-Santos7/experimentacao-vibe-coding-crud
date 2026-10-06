# Spec Delta

## Purpose

Preservar a interpretação acadêmica do experimento distinguindo as fontes originais das correções e dos resultados posteriormente verificados.

## ADDED Requirements

### Requirement: Versioned contract drift
A documentação SHALL preservar a fonte fornecida e a fonte histórica original quando localizada, identificar o drift SQLite/PostgreSQL e distinguir contrato histórico, implementação observada e contrato alvo versionado.

#### Scenario: Historical source missing
- **WHEN** o documento original não pode ser localizado
- **THEN** a lacuna é registrada sem reconstrução por memória nem declaração de que a fonte histórica foi preservada.

#### Scenario: Current contract documented
- **WHEN** o contrato atualizado é versionado
- **THEN** a decisão de manter PostgreSQL é explícita, a Dependency Rule permanece exigida e a fonte anterior conserva seu conteúdo e referência.

### Requirement: Evidence categories and phase classification
O registro acadêmico SHALL separar evidência histórica, estado observado, especificação alvo e resultado verificado, e classificar fases por diffs e commits como rebuild, refatoração, extensão ou correção.

#### Scenario: Documentary test claim
- **GIVEN** um relatório anterior que afirma aprovação de testes
- **WHEN** esse dado é registrado antes da reprodução
- **THEN** permanece identificado como alegação documental e não como aprovação atual.

#### Scenario: Post experiment stabilization
- **WHEN** correções desta mudança são registradas
- **THEN** são vinculadas a commits próprios e identificadas como pós-experimento, preservando o baseline e as limitações ainda abertas.

