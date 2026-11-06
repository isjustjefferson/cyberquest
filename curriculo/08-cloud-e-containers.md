# Trilha 8 — Cloud e Containers
**slug da trilha:** `08-cloud-e-containers` · **cor:** azul-escuro · **ícone:** ☁️
**Descrição:** Segurança em nuvem, containers e pipelines. Como os erros de configuração viram o maior risco quando a infraestrutura vira código.

> **Regra de profundidade:** 1 lição completa por módulo (⭐) + o lab. Demais `draft`. **Não exigir conta em nuvem:** todos os exercícios usam arquivos/trechos fornecidos pela plataforma.

---

## Módulo 8.1 — Nuvem (`01-nuvem`)

### 8.1.1 — Modelo de responsabilidade compartilhada ⭐
`responsabilidade-compartilhada` · dificuldade 2 · 10 min · 40 XP

**Objetivo:** Saber o que o provedor protege e o que é responsabilidade sua.

**Tópicos-chave:** IaaS, PaaS, SaaS; o provedor protege a infraestrutura da nuvem; o cliente protege configuração, identidades, dados e aplicações; erros de configuração como principal causa de incidentes.

**Rascunho da explicação:** Pense em alugar um apartamento: o prédio cuida da estrutura, mas **você** tranca a porta. Na nuvem é igual: o provedor garante datacenters e hipervisores; você configura quem acessa o quê, quais portas ficam abertas e se os dados são cifrados. Quanto mais "gerenciado" o serviço (SaaS), menos coisas você configura, mas nunca zero.

**Exercícios sugeridos:**
1. (match) Modelo ↔ o que o cliente gerencia (IaaS/PaaS/SaaS).
2. (single_choice) "Um bucket de armazenamento público por engano é responsabilidade de…" → **Do cliente**.
3. (true_false) "Usar a nuvem transfere toda a responsabilidade de segurança ao provedor." → **Falso**.

---

### 8.1.2 — IAM e menor privilégio
`iam-e-menor-privilegio` · dificuldade 3 · 12 min · 50 XP

**Objetivo:** Entender identidades, papéis e políticas.

**Tópicos-chave:** usuários, grupos, papéis (roles) e políticas; permissões `*` como risco; credenciais temporárias; MFA em contas privilegiadas; chaves de acesso de longa duração; revisão periódica; contas de serviço.

**Rascunho da explicação:** Na nuvem, **identidade é o novo perímetro**. Uma política que concede `*` em todos os recursos é um convite ao desastre. Prefira papéis com credenciais temporárias, separe contas administrativas, ative MFA e revise acessos regularmente. Chaves de acesso não devem ir para repositórios de código.

**Exercícios sugeridos:**
1. (code_review) Achar o excesso de permissão numa política JSON fornecida.
2. (single_choice) "Preferir credenciais…" → **Temporárias**.

---

### 8.1.3 — Armazenamento e segredos
`armazenamento-e-segredos` · dificuldade 3 · 12 min · 50 XP

**Objetivo:** Evitar vazamentos por buckets e segredos expostos.

**Tópicos-chave:** buckets privados por padrão; criptografia em repouso e em trânsito; gerenciadores de segredos; variáveis de ambiente vs. cofres; varredura de segredos em repositórios; rotação.

**Rascunho da explicação:** Muitos vazamentos famosos vieram de buckets públicos e de chaves comitadas no Git. Defina acesso privado por padrão, cifre dados e use um cofre de segredos com rotação. Se um segredo vazar, **revogue e troque**: apagar o commit não basta, pois ele permanece no histórico.

**Exercícios sugeridos:**
1. (true_false) "Apagar o arquivo no último commit remove o segredo do histórico." → **Falso**.
2. (multi_choice) "Boas práticas para segredos?" → cofre, rotação, varredura em repositórios.

---

## Módulo 8.2 — Containers e DevSecOps (`02-containers-e-devsecops`)

### 8.2.1 — Segurança de containers ⭐
`seguranca-de-containers` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Reduzir riscos em Docker e em orquestradores.

**Tópicos-chave:** imagens mínimas e confiáveis; não rodar como root; não usar `--privileged` nem montar o socket do Docker; limites de recursos; segredos fora da imagem; varredura de imagens; redes isoladas; Kubernetes (visão geral: RBAC, Pod Security, secrets).

**Rascunho da explicação:** Containers compartilham o kernel do host: um container privilegiado ou com acesso ao socket do Docker é quase um acesso root ao host. Boas práticas: imagens enxutas de fonte confiável, usuário não-root, `cap-drop`, sistema de arquivos somente leitura quando possível e nenhuma credencial dentro da imagem. (É exatamente assim que **os labs do CyberQuest são montados**: dá para olhar o código e aprender.)

**Exercícios sugeridos:**
1. (single_choice) "O que torna `--privileged` perigoso?" → **Dá ao container quase os mesmos poderes do host**.
2. (multi_choice) "Boas práticas de Dockerfile?" → usuário não-root, imagem base mínima, sem segredos.
3. (true_false) "Montar o socket do Docker num container é inofensivo." → **Falso**.

---

### 8.2.2 — IaC e DevSecOps
`iac-e-devsecops` · dificuldade 3 · 12 min · 50 XP

**Objetivo:** Integrar segurança ao ciclo de desenvolvimento e à infraestrutura como código.

**Tópicos-chave:** IaC (Terraform/CloudFormation — conceito); revisão de código; análise estática (SAST), de dependências (SCA), de imagens e de IaC no pipeline; segredos em CI; assinatura de artefatos; "shift left".

**Rascunho da explicação:** Quando a infraestrutura é código, erros de segurança também são código e podem ser detectados **antes** do deploy. Pipelines com verificações automáticas (dependências vulneráveis, segredos, configurações perigosas) impedem que falhas conhecidas cheguem à produção. A segurança passa a ser responsabilidade compartilhada entre dev, ops e segurança.

**Exercícios sugeridos:**
1. (match) Sigla ↔ o que analisa (SAST, SCA, DAST).
2. (single_choice) "Shift left significa…" → **Tratar segurança mais cedo no ciclo de desenvolvimento**.

---

### 8.2.3 — Lab: Auditar um Dockerfile e um docker-compose inseguros ⭐
`lab-auditar-dockerfile` · dificuldade 3 · 25 min · 250 XP · **lab:** `auditar-dockerfile`

**Objetivo:** Encontrar más práticas em arquivos fornecidos e propor correções.

**Rascunho da explicação:** Aqui o "alvo" são **arquivos**, não containers vulneráveis: você recebe um `Dockerfile` e um `docker-compose.yml` com 6 problemas (usuário root, segredo hardcoded, imagem `latest`, `privileged: true`, porta de banco exposta publicamente, volume com o socket do Docker). Marque as linhas e escolha a correção para cada uma.

**Exercícios sugeridos (objetivos):**
1. (code_review) Marcar as 6 linhas problemáticas. → 120 XP
2. (match) Problema ↔ correção. → 80 XP
3. (single_choice) Qual problema tem maior risco de comprometer o host? → **Montar o socket do Docker / privileged**. → 50 XP

**Lab/Missão:** implementável como lab "estático" (sem containers), usando `code_review` + `match`; o manifesto pode ser dispensado.
