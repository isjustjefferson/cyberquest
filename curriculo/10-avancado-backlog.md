# Trilha 10 — Avançado (backlog)
**slug da trilha:** `10-avancado` · **cor:** cinza-neon · **ícone:** 🧠
**Status:** apenas estrutura. Criar `track.yml`, `module.yml` e as lições como `status: draft` com título, objetivo e tópicos-chave. **Não bloquear** (aparece como "Em breve" no mapa). Requer a conclusão das trilhas 5 e 6.

---

## Módulo 10.1 — Análise de malware (`01-analise-de-malware`)
- `analise-estatica-vs-dinamica` — Objetivo: diferenciar análise estática (sem executar) e dinâmica (sandbox). Tópicos: strings, hashes, imports, VirusTotal (conceito), sandbox isolada.
- `ambiente-seguro-de-analise` — Objetivo: montar um laboratório isolado. Tópicos: VMs/containers sem rede, snapshots, regras de manuseio.
- `iocs-e-relatorios-de-malware` — Objetivo: extrair indicadores e documentá-los. Tópicos: IoCs, YARA, relatório.

## Módulo 10.2 — Engenharia reversa (`02-engenharia-reversa`)
- `introducao-a-assembly-e-binarios` — Tópicos: registradores, pilha, formato ELF/PE.
- `ferramentas-de-analise` — Tópicos: desassembladores/descompiladores (ex.: Ghidra), depuradores.
- `crackme-guiado` — Lab com binário didático criado pela plataforma.

## Módulo 10.3 — Red Team e Purple Team (`03-red-e-purple-team`)
- `diferenca-entre-pentest-e-red-team` — Objetivos, duração, furtividade, regras.
- `emulacao-de-adversarios` — Planos com MITRE ATT&CK, cadeia de ataque, cooperação com o blue team.
- `purple-team-na-pratica` — Ciclo de teste → detecção → melhoria; métricas de cobertura.

## Módulo 10.4 — Mobile e IoT (`04-mobile-e-iot`)
- `owasp-mobile-top-10-visao-geral`
- `seguranca-de-apps-android-conceitos`
- `iot-e-firmware-conceitos`

## Módulo 10.5 — Segurança de IA (`05-seguranca-de-ia`)
- `riscos-em-sistemas-de-ia` — Tópicos: injeção de prompt, vazamento de dados, envenenamento de dados, uso de agentes com ferramentas.
- `owasp-top-10-llm-visao-geral`
- `defesas-e-governanca-de-ia`

## Módulo 10.6 — Desenvolvimento de exploits (conceitos) (`06-exploits-conceitos`)
- `memoria-e-vulnerabilidades-classicas` — Conceito de corrupção de memória, mitigações (ASLR, DEP, canários).
- `mitigacoes-modernas` — Foco defensivo; **sem instruções de exploração funcional contra software real**.

---

## Regras para esta trilha
- Conteúdo conceitual e defensivo; práticas apenas em binários/alvos criados pela própria plataforma.
- Nada de malware real: amostras didáticas devem ser inofensivas e geradas pelo projeto.
- Cada lição `draft` deve conter: objetivo, 3–5 tópicos-chave e 2 exercícios simples.
