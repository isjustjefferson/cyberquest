# Trilha 7 — Blue Team
**slug da trilha:** `07-blue-team` · **cor:** ciano-claro · **ícone:** 🛡️
**Descrição:** A visão do defensor: observar, detectar, responder e endurecer sistemas. Entender o lado azul faz de você um testador melhor.

> **Regra de profundidade:** 1 lição completa por módulo (as marcadas ⭐) + o lab. Demais lições `draft` (≥ 250 palavras, 2 exercícios).

---

## Módulo 7.1 — Monitoramento e detecção (`01-monitoramento-e-deteccao`)

### 7.1.1 — Logs e telemetria ⭐
`logs-e-telemetria` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Saber quais logs importam e como lê-los.

**Tópicos-chave:** logs de autenticação (`/var/log/auth.log`), web (access/error), sistema (journald), firewall; Windows Event Logs (logon 4624/4625); sincronização de relógio (NTP); retenção; centralização; integridade dos logs.

**Rascunho da explicação:** Logs são a "caixa-preta" de um sistema: sem eles, não há como saber o que aconteceu. Um padrão simples como muitas falhas de login seguidas de um sucesso do mesmo IP merece investigação. Para correlacionar eventos entre máquinas, os **relógios precisam estar sincronizados**, e para evitar que um invasor apague pistas, logs devem ser enviados a um local central.

**Exercícios sugeridos:**
1. (sim_terminal) Filtrar um `auth.log` para contar falhas de login por IP.
2. (single_choice) "Por que centralizar logs?" → **Evitar que um invasor apague as evidências e facilitar a correlação**.
3. (true_false) "Relógios dessincronizados não afetam investigações." → **Falso**.

---

### 7.1.2 — SIEM: conceitos
`siem-conceitos` · dificuldade 3 · 12 min · 50 XP

**Objetivo:** Entender o que um SIEM faz.

**Tópicos-chave:** coleta, normalização, correlação, alertas, painéis; casos de uso; ruído e ajuste de regras; exemplos (Wazuh/Elastic — visão geral); SOC e níveis de analista.

**Rascunho da explicação:** Um SIEM junta logs de várias fontes, os padroniza e aplica regras de correlação para gerar alertas. O valor está nos **casos de uso** bem definidos ("detectar força bruta seguida de login bem-sucedido"), não em coletar tudo sem critério.

**Exercícios sugeridos:**
1. (order) Fluxo: coleta → normalização → correlação → alerta → triagem.
2. (single_choice) "Principal valor de um SIEM?" → **Correlacionar eventos de várias fontes para detectar incidentes**.

---

### 7.1.3 — Detecção com regras (Sigma/YARA — conceito)
`deteccao-com-regras` · dificuldade 3 · 12 min · 50 XP

**Objetivo:** Entender regras de detecção como código.

**Tópicos-chave:** assinaturas vs. comportamento; Sigma (regras de log, agnósticas de plataforma); YARA (padrões em arquivos); Indicadores de comprometimento (IoCs); ciclo de teste e ajuste.

**Rascunho da explicação:** Uma regra descreve o que procurar: um padrão de log (Sigma) ou características de um arquivo (YARA). Boas regras são testadas contra dados reais de atividade normal para reduzir falsos positivos e versionadas como código.

**Exercícios sugeridos:**
1. (match) Sigla ↔ uso (Sigma, YARA, IoC).
2. (true_false) "Regras de detecção não precisam de manutenção." → **Falso**.

---

## Módulo 7.2 — Resposta e investigação (`02-resposta-e-investigacao`)

### 7.2.1 — Resposta a incidentes ⭐
`resposta-a-incidentes` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Conhecer o ciclo de resposta e agir com método.

**Tópicos-chave:** preparação; detecção e análise; contenção; erradicação; recuperação; lições aprendidas (NIST SP 800-61); plano de comunicação (inclusive notificação regulatória, ex.: LGPD/ANPD); evitar destruir evidências; papéis e comunicação.

**Rascunho da explicação:** Quando algo acontece, a pressa é inimiga: reagir sem método pode piorar o estrago ou apagar evidências. O ciclo é: **preparar**, **detectar e analisar**, **conter** (isolar o sistema afetado), **erradicar** (remover a causa), **recuperar** e **aprender**. Documente tudo em linha do tempo. A comunicação com gestores, jurídico e, quando aplicável, autoridades é parte da resposta.

**Exercícios sugeridos:**
1. (order) Ordenar as fases de resposta a incidentes.
2. (single_choice) "Primeira prioridade ao identificar uma máquina comprometida?" → **Conter para evitar propagação, preservando evidências**.
3. (true_false) "Desligar e formatar imediatamente é sempre a melhor resposta." → **Falso**.

---

### 7.2.2 — Forense digital
`forense-digital` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Entender princípios de coleta e preservação de evidências.

**Tópicos-chave:** ordem de volatilidade (memória → disco); cadeia de custódia; imagem forense e hashes de integridade; linha do tempo; artefatos comuns (logs, histórico, arquivos recentes); aspectos legais.

**Rascunho da explicação:** Evidência digital é frágil: ligar/desligar, copiar ou abrir arquivos pode alterá-la. Coleta-se primeiro o mais **volátil** (memória, conexões), depois o disco, sempre registrando quem fez o quê (cadeia de custódia) e calculando **hashes** para provar que a cópia é idêntica ao original.

**Exercícios sugeridos:**
1. (order) Ordenar por volatilidade: memória, disco, backups.
2. (single_choice) "Para que serve o hash de uma imagem forense?" → **Provar a integridade da evidência**.

---

### 7.2.3 — Lab: Análise de logs de um servidor comprometido ⭐
`lab-analise-de-logs` · dificuldade 3 · 30 min · 250 XP · **lab:** `analise-de-logs`

**Objetivo:** Reconstruir uma linha do tempo a partir de logs fictícios.

**Rascunho da explicação:** O ambiente fornece logs de autenticação, web e processos de um servidor fictício que foi "comprometido". Usando as técnicas da trilha 1 (grep, sort, uniq), você identifica o IP atacante, o momento do acesso e a conta usada, e propõe ações de contenção.

**Exercícios sugeridos (objetivos):**
1. Identificar o IP com mais falhas de login. → 60 XP
2. Descobrir o horário do primeiro login bem-sucedido após as falhas. → 80 XP
3. Identificar a conta comprometida e submeter como flag. → 110 XP

---

## Módulo 7.3 — Hardening e gestão (`03-hardening-e-gestao`)

### 7.3.1 — Hardening de Linux e Windows
`hardening` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Reduzir a superfície de ataque com configurações seguras.

**Tópicos-chave:** remover serviços e pacotes desnecessários; SSH (chaves, sem root, sem senha); firewall; atualizações automáticas; permissões; auditoria (`auditd`); benchmarks CIS (conceito); Windows: GPO, BitLocker, Defender (visão geral).

**Rascunho da explicação:** Hardening é "tirar o que sobra e trancar o que fica". Em SSH, use autenticação por chave, desative login de root e limite quem pode entrar. Ative atualizações, remova serviços sem uso e registre eventos relevantes. Benchmarks como o CIS fornecem listas de verificação verificáveis.

**Exercícios sugeridos:**
1. (multi_choice) "Medidas de hardening do SSH?" → desativar login root, usar chaves, limitar usuários.
2. (code_review) Achar configurações fracas num `sshd_config`.

---

### 7.3.2 — Gestão de vulnerabilidades e patching
`gestao-de-vulnerabilidades-e-patching` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Manter sistemas atualizados com método.

**Tópicos-chave:** inventário; varredura periódica; priorização (CVSS + exposição + exploração conhecida); prazos (SLA); janela de manutenção; testes antes de aplicar; exceções documentadas.

**Rascunho da explicação:** Não se corrige tudo ao mesmo tempo: prioriza-se por **risco real**. Um sistema exposto à internet com falha explorada ativamente vem antes de um servidor interno com falha teórica. Sem inventário, não há gestão: não dá para corrigir o que você não sabe que existe.

**Exercícios sugeridos:**
1. (single_choice) "Primeiro passo da gestão de vulnerabilidades?" → **Inventariar os ativos**.
2. (order) Priorizar três vulnerabilidades dadas por exposição e exploração.
