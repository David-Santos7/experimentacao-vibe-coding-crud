# Spec Delta

## Purpose

Garantir que o artefato científico possa ser obtido integralmente e que os históricos relevantes permaneçam verificáveis após a estabilização.

## ADDED Requirements

### Requirement: Complete repository acquisition
O repositório SHALL fornecer backend, frontend, E2E e configuração de execução em clone comum do commit candidato, sem gitlink acidental ou arquivos locais secretos.

#### Scenario: Fresh clone contains all workspaces
- **GIVEN** o commit candidato após reparação aprovada
- **WHEN** o avaliador realiza clone em diretório vazio
- **THEN** os arquivos reais dos dois workspaces estão presentes e npm ci reconhece ambos sem obter arquivos de outro checkout.

### Requirement: Historical preservation gate
A reparação SHALL preservar baseline, histórico disponível e snapshot dos arquivos antes de alterar a estrutura Git. Quando autorizado explicitamente, SHALL prosseguir com commits históricos indisponíveis registrados como limitação, sem afirmar preservação integral.

#### Scenario: Referenced backend commit is unavailable
- **GIVEN** um gitlink cujo commit não está disponível em fonte verificável
- **WHEN** se inicia a reparação
- **THEN** a origem necessária é reportada; após autorização explícita e backups verificados, a conversão preserva os arquivos presentes e registra o histórico não recuperado.

#### Scenario: Verified preservation before integration
- **GIVEN** histórico recuperado e plano de integração aprovado
- **WHEN** a integração é executada
- **THEN** os commits originais permanecem alcançáveis ou mapeados a cópia preservada e backups verificáveis, com baseline identificado.
