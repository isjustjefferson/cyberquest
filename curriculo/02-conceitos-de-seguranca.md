# Trilha 2 — Conceitos de Segurança
**slug da trilha:** `02-conceitos-de-seguranca` · **cor:** âmbar · **ícone:** 🔐
**Descrição:** O vocabulário e o raciocínio de quem protege (e testa) sistemas: princípios, ameaças, frameworks e risco.

---

## Módulo 2.1 — Fundamentos (`01-fundamentos`)

### 2.1.1 — Tríade CIA e extensões
`cia-e-extensoes` · dificuldade 1 · 10 min · 30 XP

**Objetivo:** Dominar Confidencialidade, Integridade e Disponibilidade e usá-las para classificar incidentes.

**Tópicos-chave:** CIA; autenticidade e não repúdio; exemplos de violação de cada pilar; trade-offs.

**Rascunho da explicação:** **Confidencialidade**: só quem deve vê, vê (vazamento de dados a quebra). **Integridade**: os dados não são alterados indevidamente (um atacante muda o valor de uma transferência). **Disponibilidade**: o sistema está acessível quando preciso (um ataque de negação de serviço a quebra). Quase toda decisão de segurança equilibra os três: criptografar tudo protege a confidencialidade, mas pode dificultar a recuperação (disponibilidade). Acrescente **autenticidade** (quem é quem) e **não repúdio** (o autor não pode negar a ação).

**Exercícios sugeridos:**
1. (match) Incidente ↔ pilar violado (vazamento ↔ C; alteração de saldo ↔ I; site fora do ar ↔ D).
2. (single_choice) "Ransomware que criptografa arquivos atinge principalmente…" → **Disponibilidade** (e também confidencialidade se houver exfiltração).
3. (true_false) "Mais segurança sempre melhora os três pilares ao mesmo tempo." → **Falso**.

---

### 2.1.2 — AAA: Autenticação, Autorização e Auditoria
`aaa` · dificuldade 1 · 10 min · 30 XP

**Objetivo:** Diferenciar provar quem você é, o que pode fazer e o que fez.

**Tópicos-chave:** fatores (algo que sabe, tem, é); autorização (RBAC); logs de auditoria; contabilização.

**Rascunho da explicação:** Autenticação: "quem é você?". Autorização: "o que você pode fazer?". Auditoria (accounting): "o que você fez?". Um erro clássico é confiar só na autenticação: o usuário está logado, mas isso não significa que pode ver os dados de outro usuário (veremos isso como IDOR na trilha de Web). Sem logs de auditoria, não há como investigar um incidente.

**Exercícios sugeridos:**
1. (match) Conceito ↔ pergunta.
2. (single_choice) "Senha + código do celular são…" → **Dois fatores diferentes (conhecimento + posse)**.
3. (true_false) "Autenticar o usuário já garante que ele pode acessar qualquer recurso." → **Falso**.

---

### 2.1.3 — Defesa em profundidade e menor privilégio
`defesa-em-profundidade-e-menor-privilegio` · dificuldade 2 · 10 min · 40 XP

**Objetivo:** Entender por que uma única barreira nunca basta.

**Tópicos-chave:** camadas (perímetro, rede, host, aplicação, dados, pessoas); menor privilégio; segregação de funções; falhar de forma segura.

**Rascunho da explicação:** Um castelo tem fosso, muralha, portão, guardas e cofre. Em TI, se o firewall falha, o antivírus, a segmentação, a criptografia e os logs ainda ajudam. O **menor privilégio** garante que, se uma conta for comprometida, o estrago seja limitado. **Segregação de funções** impede que uma única pessoa faça e aprove algo crítico.

**Exercícios sugeridos:**
1. (multi_choice) "Quais são camadas de defesa?" → firewall, MFA, criptografia de dados, treinamento de usuários.
2. (single_choice) "O que o menor privilégio limita?" → **O impacto de uma conta comprometida**.
3. (true_false) "Um bom firewall dispensa outras camadas." → **Falso**.

---

### 2.1.4 — Ativos, ameaças, vulnerabilidades e riscos
`ativos-ameacas-vulnerabilidades-riscos` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Usar o vocabulário corretamente.

**Tópicos-chave:** ativo; ameaça; vulnerabilidade; exploit; impacto e probabilidade; risco = probabilidade × impacto; controles.

**Rascunho da explicação:** **Ativo** é o que tem valor (dados, servidor, reputação). **Ameaça** é o que pode causar dano (um criminoso, um erro humano, uma enchente). **Vulnerabilidade** é uma fraqueza (software desatualizado). **Risco** é a possibilidade de uma ameaça explorar uma vulnerabilidade causando impacto. Ter uma vulnerabilidade sem ameaça relevante ou sem ativo valioso pode significar risco baixo, por isso se prioriza.

**Exercícios sugeridos:**
1. (match) Termo ↔ definição.
2. (single_choice) "Servidor com patch faltando é…" → **Vulnerabilidade**.
3. (order) Ordenar de menor para maior risco cenários dados (probabilidade × impacto).

---

## Módulo 2.2 — Ameaças (`02-ameacas`)

### 2.2.1 — Malware: conceitos
`malware-conceitos` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Distinguir tipos de malware e saber como se defender, sem entrar em técnicas de criação.

**Tópicos-chave:** vírus, worm, trojan, ransomware, spyware, rootkit, botnet, keylogger; vetores de infecção; defesas (atualização, backups, EDR).

**Rascunho da explicação:** Vírus precisam de um hospedeiro; worms se espalham sozinhos pela rede; trojans fingem ser úteis; ransomware sequestra dados; spyware espia; rootkits escondem presença. O vetor mais comum ainda é o **e-mail** e o download de fontes duvidosas. Boas práticas: atualizações, backups offline testados, menor privilégio, bloqueio de macros, EDR e conscientização.

**Exercícios sugeridos:**
1. (match) Tipo ↔ característica.
2. (single_choice) "Melhor defesa contra impacto de ransomware?" → **Backups offline e testados**.
3. (true_false) "Worms exigem que o usuário execute um arquivo para se espalhar." → **Falso**.

---

### 2.2.2 — Engenharia social e phishing
`engenharia-social-e-phishing` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Reconhecer golpes que exploram pessoas e saber como mitigar.

**Tópicos-chave:** phishing, spear phishing, vishing, smishing, pretexting, BEC; gatilhos (urgência, autoridade, medo); sinais de alerta; verificação por canal alternativo; simulações autorizadas.

**Rascunho da explicação:** A parte mais fraca costuma ser a humana. O atacante cria **urgência** ("sua conta será bloqueada em 1 hora") ou finge **autoridade** (o "diretor") para que você aja sem pensar. Sinais: domínio parecido com o real, links que levam a outro endereço, anexos inesperados, pedidos de pagamento ou senha. Defesa: parar, verificar por outro canal, usar MFA e reportar. Em empresas, simulações de phishing **autorizadas** servem para treinar.

**Exercícios sugeridos:**
1. (code_review) Marcar os sinais suspeitos num e-mail de exemplo (domínio `banc0.com`, link diferente do texto etc.).
2. (single_choice) "Você recebe um pedido urgente do 'diretor' para pagar um boleto. O que fazer?" → **Confirmar por outro canal oficial**.
3. (true_false) "Phishing só acontece por e-mail." → **Falso**.

---

### 2.2.3 — Ataques comuns: DoS, MITM e força bruta
`ataques-comuns-dos-mitm-forca-bruta` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Entender, em nível conceitual, ataques frequentes e as defesas.

**Tópicos-chave:** DoS/DDoS; MITM (ARP spoofing, Wi-Fi falso) e como TLS ajuda; força bruta e credential stuffing; rate limit, bloqueio, MFA, WAF.

**Rascunho da explicação:** **DoS** sobrecarrega um serviço até ele ficar indisponível; **DDoS** usa muitas origens. No **MITM**, o atacante fica no meio da comunicação; o HTTPS com certificados válidos dificulta isso. **Força bruta** tenta muitas senhas; **credential stuffing** reutiliza senhas vazadas de outros sites. Defesas: limites de tentativas, MFA, senhas únicas, monitoramento e CDN/WAF.

**Exercícios sugeridos:**
1. (match) Ataque ↔ defesa principal.
2. (single_choice) "Qual medida reduz muito o risco de credential stuffing?" → **MFA e senhas únicas**.
3. (true_false) "HTTPS torna impossível qualquer tipo de MITM." → **Falso**, mas dificulta muito quando bem configurado.

---

### 2.2.4 — Ameaças internas e cadeia de suprimentos
`ameacas-internas-e-cadeia-de-suprimentos` · dificuldade 2 · 10 min · 40 XP

**Objetivo:** Entender riscos vindos de dentro e de terceiros.

**Tópicos-chave:** insider malicioso e negligente; fornecedores; dependências de software; SBOM; revisão de acessos; princípios de verificação de integridade.

**Rascunho da explicação:** Nem toda ameaça vem de fora. Um funcionário descuidado ou descontente pode vazar dados. E nenhum software é uma ilha: bibliotecas, imagens de container e fornecedores trazem risco. Ataques à cadeia de suprimentos comprometem um componente confiável para atingir muitos clientes. Práticas: revisão periódica de acessos, logs, fixar versões, verificar assinaturas e manter um inventário de dependências (SBOM).

**Exercícios sugeridos:**
1. (single_choice) "O que é um SBOM?" → **Inventário dos componentes de software**.
2. (true_false) "Dependências de código aberto não precisam ser monitoradas." → **Falso**.

---

## Módulo 2.3 — Frameworks e gestão (`03-frameworks-e-gestao`)

### 2.3.1 — Modelagem de ameaças (STRIDE)
`modelagem-de-ameacas-stride` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Aplicar STRIDE a um diagrama simples.

**Tópicos-chave:** DFD (processos, depósitos, fluxos, fronteiras de confiança); Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege.

**Rascunho da explicação:** Modelar ameaças é pensar como atacante **antes** de construir. Desenhe o sistema, marque as fronteiras de confiança e, para cada elemento, pergunte o que pode dar errado usando STRIDE. Ex.: num login, *Spoofing* (alguém finge ser outro), *Tampering* (alterar a requisição), *Information disclosure* (mensagens de erro vazam dados).

**Exercícios sugeridos:**
1. (match) Letra do STRIDE ↔ propriedade violada (S ↔ autenticidade, T ↔ integridade, etc.).
2. (single_choice) "Uma mensagem de erro que revela a estrutura do banco é…" → **Information disclosure**.
3. (order) Passos do threat modeling.

---

### 2.3.2 — MITRE ATT&CK e Cyber Kill Chain
`mitre-attack-e-kill-chain` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Usar frameworks para descrever comportamento de atacantes.

**Tópicos-chave:** Kill Chain (reconhecimento → armamento → entrega → exploração → instalação → C2 → ações); ATT&CK (táticas e técnicas); uso por red e blue team.

**Rascunho da explicação:** A Kill Chain mostra as etapas de um ataque; interrompendo uma delas, você o impede. O **MITRE ATT&CK** é um catálogo de táticas (o "porquê", como *Acesso inicial*) e técnicas (o "como") observadas em ataques reais. Red teams planejam exercícios com ele; blue teams medem cobertura de detecção.

**Exercícios sugeridos:**
1. (order) Etapas da Kill Chain.
2. (single_choice) "ATT&CK organiza o conhecimento em…" → **Táticas e técnicas**.
3. (true_false) "Interromper uma etapa pode impedir o ataque completo." → **Verdadeiro**.

---

### 2.3.3 — Frameworks: NIST, ISO 27001 e CIS Controls
`frameworks-nist-iso-cis` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Saber para que serve cada um.

**Tópicos-chave:** NIST CSF (Identificar, Proteger, Detectar, Responder, Recuperar, e Governar na versão mais recente); ISO/IEC 27001 (SGSI, certificável); CIS Controls (lista prática priorizada).

**Rascunho da explicação:** Frameworks dão uma linguagem comum e um roteiro. O **NIST CSF** é um modelo de funções; a **ISO 27001** define um sistema de gestão que pode ser certificado; o **CIS Controls** é uma lista prática de controles priorizados. Não são concorrentes: organizações misturam conforme necessidade.

**Exercícios sugeridos:**
1. (match) Framework ↔ característica.
2. (single_choice) "Qual é certificável?" → **ISO 27001**.

---

### 2.3.4 — Gestão de risco, CVE e CVSS
`gestao-de-riscos-cvss-cve` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Interpretar identificadores e notas de vulnerabilidades.

**Tópicos-chave:** CVE; CVSS (gravidade 0–10, vetores); exploração conhecida (listas de vulnerabilidades exploradas ativamente); priorização por contexto; tratar, mitigar, aceitar ou transferir risco.

**Rascunho da explicação:** Um **CVE** identifica uma vulnerabilidade pública (ex.: `CVE-AAAA-NNNN`). O **CVSS** dá uma nota de gravidade técnica, mas não conta tudo: uma falha 9.8 num sistema isolado pode importar menos do que uma 7.5 num servidor exposto e já explorada. O risco se trata: **mitigar**, **aceitar**, **transferir** (seguro) ou **evitar**.

**Exercícios sugeridos:**
1. (single_choice) "Para que serve um CVE?" → **Identificar de forma única uma vulnerabilidade pública**.
2. (true_false) "CVSS alto sempre significa prioridade máxima, independentemente do contexto." → **Falso**.
3. (match) Estratégia de risco ↔ exemplo.

---

### 2.3.5 — Boss: Conceitos de Segurança
`boss-conceitos-de-seguranca` · dificuldade 3 · 12 min · 100 XP · **boss**

**Rascunho da explicação:** 8 exercícios cronometrados: classificar incidentes em CIA, aplicar STRIDE a um mini-diagrama, ordenar a Kill Chain, interpretar CVSS e reconhecer phishing.
