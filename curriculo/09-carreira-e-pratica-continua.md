# Trilha 9 — Carreira e Prática Contínua
**slug da trilha:** `09-carreira-e-pratica-continua` · **cor:** dourado · **ícone:** 🏆
**Descrição:** Para onde ir depois dos fundamentos: carreiras, certificações, CTFs, bug bounty e como construir portfólio e aprender continuamente.

> **Regra de profundidade:** 1 lição completa (⭐) + demais `draft`. Conteúdo informativo; **revisar nomes, preços e conteúdos de certificações antes de publicar**, pois mudam com frequência.

---

## Módulo 9.1 — Seu caminho (`01-seu-caminho`)

### 9.1.1 — Mapa de carreiras em segurança ⭐
`mapa-de-carreiras` · dificuldade 1 · 10 min · 30 XP

**Objetivo:** Conhecer áreas da segurança e descobrir quais combinam com você.

**Tópicos-chave:** SOC (analista N1/N2/N3); pentester/red team; AppSec; GRC (governança, risco e conformidade); DFIR (forense e resposta); engenharia de segurança/cloud; threat intelligence; perfis de entrada (suporte, redes, desenvolvimento → segurança).

**Rascunho da explicação:** Segurança não é uma carreira só. O **SOC** monitora e responde; o **pentester** testa de forma ofensiva; **AppSec** trabalha com desenvolvedores para criar código seguro; **GRC** cuida de políticas, riscos e auditorias; **DFIR** investiga incidentes. Muita gente chega vindo de TI (suporte, redes) ou desenvolvimento. Descobrir o que você gosta (investigar, construir, testar, organizar) ajuda a escolher o foco.

**Exercícios sugeridos:**
1. (match) Área ↔ atividade principal.
2. (single_choice) "Quem trabalha com políticas, risco e conformidade?" → **GRC**.
3. (multi_choice) "Caminhos comuns de entrada?" → suporte técnico, redes, desenvolvimento.

---

### 9.1.2 — Certificações: o que cobrem e para quem
`certificacoes` · dificuldade 1 · 10 min · 30 XP

**Objetivo:** Entender o papel das certificações sem se prender a elas.

**Tópicos-chave:** CompTIA Security+ (base geral); eJPT (introdução prática ao pentest); CEH (teórica, conhecida em RH); PenTest+; OSCP (prática e exigente); CISSP (gestão, exige experiência); Blue Team Level 1 e similares; custos e validade (**verificar sites oficiais**); como escolher; certificação ≠ competência.

**Rascunho da explicação:** Certificações abrem portas em processos seletivos e organizam o estudo, mas **não substituem prática**. Para iniciantes, uma base como Security+ ou uma certificação prática introdutória costuma ser um bom começo; as mais avançadas (como OSCP) pressupõem bom domínio técnico. Pesquise o conteúdo, o formato (múltipla escolha vs. prova prática) e se a vaga que você quer cita alguma.

**Exercícios sugeridos:**
1. (match) Certificação ↔ perfil (prática ofensiva, base geral, gestão).
2. (true_false) "Uma certificação por si só garante competência técnica." → **Falso**.

---

### 9.1.3 — CTFs e onde treinar
`ctfs-e-onde-treinar` · dificuldade 1 · 8 min · 30 XP

**Objetivo:** Saber como praticar de forma legal e contínua.

**Tópicos-chave:** CTF Jeopardy vs. Attack-Defense; categorias (web, cripto, forense, reversa, pwn, misc); plataformas de treino legais (ex.: TryHackMe, Hack The Box, OverTheWire, PicoCTF, VulnHub); jogar em equipe; escrever writeups; calendário de eventos.

**Rascunho da explicação:** CTFs são competições com desafios de segurança em ambientes autorizados: o melhor treino que existe. Comece por plataformas guiadas, avance para desafios mais abertos e **escreva writeups**, porque explicar o que você fez consolida o aprendizado e vira portfólio. Participar de times acelera muito.

**Exercícios sugeridos:**
1. (match) Categoria de CTF ↔ exemplo.
2. (single_choice) "Por que escrever writeups?" → **Consolida o aprendizado e compõe o portfólio**.

---

### 9.1.4 — Bug bounty responsável
`bug-bounty-responsavel` · dificuldade 2 · 10 min · 40 XP

**Objetivo:** Entrar em bug bounty com expectativas realistas e ética.

**Tópicos-chave:** plataformas e programas; ler o escopo e as regras; duplicados e "informativos"; relatórios claros; ritmo realista de ganhos; segurança jurídica (safe harbor); começar por programas de divulgação (VDP); evitar testar fora do escopo.

**Rascunho da explicação:** Bug bounty paga por falhas válidas dentro do escopo, mas é competitivo: muitos relatórios são duplicados ou recusados. Leia a política com atenção, comece por alvos mais simples e foque em **qualidade e clareza** do relatório. Nunca teste fora das regras: a promessa de proteção só vale para quem as segue.

**Exercícios sugeridos:**
1. (true_false) "Qualquer ativo da empresa pode ser testado num programa de bug bounty." → **Falso** (apenas o escopo).
2. (order) Fluxo: ler escopo → testar → validar → reportar → acompanhar.

---

### 9.1.5 — Portfólio e blog técnico
`portfolio-e-blog` · dificuldade 1 · 8 min · 30 XP

**Objetivo:** Mostrar o que você sabe de forma pública e segura.

**Tópicos-chave:** GitHub com ferramentas e scripts próprios; writeups de CTFs e labs (sem divulgar desafios ativos de competição); notas de estudo; contribuição em projetos open source; LinkedIn; cuidado com dados sensíveis e regras das plataformas.

**Rascunho da explicação:** Recrutadores gostam de ver evidência. Um repositório com pequenas ferramentas, writeups bem explicados e anotações do que você aprendeu vale mais que uma lista de cursos. Nunca publique informações de clientes, falhas ainda não corrigidas ou soluções de desafios que a plataforma proíbe divulgar.

**Exercícios sugeridos:**
1. (multi_choice) "O que NÃO publicar?" → dados de clientes, falhas não corrigidas, soluções proibidas pela plataforma.
2. (single_choice) "O que mais comprova prática?" → **Projetos e writeups próprios**.

---

### 9.1.6 — Aprendizado contínuo
`aprendizado-continuo` · dificuldade 1 · 8 min · 30 XP

**Objetivo:** Montar uma rotina sustentável de estudo.

**Tópicos-chave:** newsletters e podcasts; acompanhar CVEs e comunicados; comunidades; estudo em blocos curtos e frequentes; revisão espaçada; projetos pessoais (home lab); evitar o "colecionismo de cursos"; saúde mental e burnout.

**Rascunho da explicação:** A área muda o tempo todo, então o hábito vale mais que a maratona. 30 minutos por dia, um laboratório por semana e um projeto pessoal são suficientes para evoluir de forma consistente. Descanse, pois burnout é comum no mercado.

**Exercícios sugeridos:**
1. (single_choice) "O que mais ajuda a longo prazo?" → **Constância**.
2. (true_false) "Fazer muitos cursos sem praticar é a melhor estratégia." → **Falso**.
