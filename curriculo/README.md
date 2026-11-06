# curriculo/ — Currículo detalhado do CyberQuest

> Complemento do `PLANO_CYBERQUEST.md`. Estes arquivos são a **fonte de conteúdo**: cada lição traz objetivo, tópicos-chave, **rascunho de explicação**, exercícios sugeridos (com gabarito) e laboratório associado.

## Como a IA deve usar esta pasta

1. Para cada lição listada, gerar o arquivo `content/tracks/<trilha>/<modulo>/NN-<slug>.md` no formato da seção 10.1 do `PLANO_CYBERQUEST.md`.
2. O **rascunho de explicação** é um ponto de partida, não o texto final. Expanda para **600–1000 palavras** em PT-BR, com analogias, exemplos de comandos/código, callouts (`> 💡`, `> ⚠️ Ética`, `> 🎯 Missão`) e linguagem descontraída-profissional. Não copie textos de terceiros.
3. Converta os "Exercícios sugeridos" para os tipos da seção 8 do plano (`single_choice`, `true_false`, `order`, `match`, `fill_command`, `sim_terminal`, `code_review`, `multi_choice`). Pode complementar com mais exercícios, mantendo os sugeridos. O gabarito vem após `→`.
4. Mantenha os `slug` exatamente como listados (são chaves do banco). Pré-requisitos: por padrão, a lição anterior do mesmo módulo; o primeiro item de cada módulo exige o último do módulo anterior.
5. Lições `lab:` apontam para `labs/manifests/<slug>.yml`; `boss:` são desafios cronometrados que combinam 5–8 exercícios do módulo.
6. Marque `status: complete` quando a lição tiver texto final + exercícios; caso contrário, `status: draft`.
7. **Regra ética:** técnicas ofensivas são sempre apresentadas no contexto de teste autorizado, em alvos fornecidos pela plataforma. Não incluir exploits funcionais para software real nem instruções contra terceiros.

## Convenções de pontuação (XP) sugeridas

| Dificuldade | XP da lição |
|---|---|
| 1 | 30 |
| 2 | 40 |
| 3 | 50 |
| 4 | 60 |
| Boss | 100 |
| Lab | 150–300 |

## Índice

| Trilha | Arquivo | Foco |
|---|---|---|
| 0 | `00-boas-vindas-e-etica.md` | Ética, lei, ambiente |
| 1 | `01-fundamentos-de-ti.md` | Linux, redes, Windows, scripting |
| 2 | `02-conceitos-de-seguranca.md` | CIA, ameaças, frameworks |
| 3 | `03-criptografia-e-autenticacao.md` | Hash, TLS, senhas, MFA, JWT |
| 4 | `04-seguranca-de-redes.md` | Firewall, IDS, VPN, tráfego, nmap |
| 5 | `05-seguranca-web.md` | OWASP, SQLi, XSS, IDOR, Burp |
| 6 | `06-pentest-metodologia-e-pratica.md` | PTES, recon, privesc, relatório |
| 7 | `07-blue-team.md` | Logs, SIEM, IR, forense |
| 8 | `08-cloud-e-containers.md` | IAM, segredos, containers, DevSecOps |
| 9 | `09-carreira-e-pratica-continua.md` | Carreira, certs, CTF |
| 10 | `10-avancado-backlog.md` | Estrutura para o futuro |

## Template de lição usado nos arquivos

```
### N.M.L — Título
`slug` · dificuldade D · X min · XP
**Objetivo:** ...
**Tópicos-chave:** ...
**Rascunho da explicação:** ...
**Exercícios sugeridos:** (tipo) pergunta → resposta
**Lab/Missão:** ...
```
