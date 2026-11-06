# Trilha 0 — Boas-vindas e Ética
**slug da trilha:** `00-boas-vindas` · **cor:** verde · **ícone:** 🛡️
**Descrição:** Antes de qualquer comando, você aprende as regras do jogo: o que separa um hacker ético de um criminoso, o que a lei brasileira diz e como montar seu laboratório com segurança.

---

## Módulo 0.1 — Ética e Lei (`01-etica-e-lei`)

### 0.1.1 — O que é um hacker ético
`o-que-e-hacker-etico` · dificuldade 1 · 8 min · 30 XP

**Objetivo:** Entender o que faz um profissional de segurança ofensiva e o que o diferencia de um invasor.

**Tópicos-chave:** hacker vs. cracker; chapéu branco, cinza e preto; segurança ofensiva como serviço; pentest, red team e bug bounty; o papel da autorização.

**Rascunho da explicação:** "Hacker" originalmente é quem gosta de entender como as coisas funcionam e levá-las além do uso previsto. O que muda tudo é a **permissão**. O hacker ético (chapéu branco) é contratado ou autorizado para encontrar falhas antes que alguém mal-intencionado as explore, e entrega um relatório para que a empresa corrija. O chapéu preto age sem autorização, em geral por lucro ou dano. O chapéu cinza fica no meio: pode não ter má intenção, mas age sem autorização, e **isso continua sendo ilegal**. Pense num chaveiro: o mesmo conhecimento abre a porta de um cliente que perdeu a chave ou a de um estranho. A ética está em quem pediu, o que foi combinado e o que se faz com o que foi descoberto. Boas intenções não substituem autorização por escrito.

**Exercícios sugeridos:**
1. (match) Ligar "chapéu branco / cinza / preto" às descrições (autorizado e reporta / sem autorização mas sem má-fé aparente / sem autorização com intenção maliciosa).
2. (true_false) "Se eu encontrar uma falha com boas intenções, não preciso de autorização para testar." → **Falso**.
3. (single_choice) "O que torna um teste de invasão legítimo?" → **Autorização prévia e escopo definido**.

**Lab/Missão:** —

---

### 0.1.2 — Escopo, autorização e regras de engajamento
`escopo-autorizacao-e-regras` · dificuldade 1 · 10 min · 30 XP

**Objetivo:** Saber o que precisa estar combinado antes de qualquer teste.

**Tópicos-chave:** contrato e carta de autorização; escopo (o que pode e o que não pode); janela de testes; regras de engajamento (ROE); contatos de emergência; dados sensíveis; "fora do escopo".

**Rascunho da explicação:** Todo teste profissional começa no papel. O **escopo** lista exatamente quais sistemas, IPs, aplicações e períodos podem ser testados. As **regras de engajamento** dizem como: se pode haver negação de serviço, se engenharia social é permitida, em que horários, quem avisar se algo quebrar. Acesse algo fora do escopo (um servidor vizinho, por exemplo) e você deixa de ser pentester e vira invasor, mesmo que tenha chegado lá "sem querer". Se encontrar algo grave fora do escopo, pare e comunique. Documentar tudo também protege você: logs e relatórios provam o que foi feito e quando.

**Exercícios sugeridos:**
1. (order) Ordenar: assinar contrato → definir escopo e ROE → executar testes → entregar relatório → reteste após correções.
2. (single_choice) "Você encontra um servidor interessante que não está na lista de IPs do escopo. O que fazer?" → **Não testar e comunicar o contratante**.
3. (multi_choice) "O que normalmente consta nas regras de engajamento?" → janelas de horário, técnicas proibidas, contatos de emergência (não: "senha pessoal do cliente").

**Lab/Missão:** 🎯 Missão: ler um escopo fictício e marcar quais alvos estão dentro ou fora.

---

### 0.1.3 — Legislação brasileira em segurança
`legislacao-brasileira` · dificuldade 2 · 10 min · 40 XP

**Objetivo:** Conhecer as leis mais relevantes para quem atua com segurança no Brasil.

**Tópicos-chave:** Lei 12.737/2012 (invasão de dispositivo informático, art. 154-A do Código Penal) e seu agravamento pela Lei 14.155/2021; Marco Civil da Internet (Lei 12.965/2014); LGPD (Lei 13.709/2018); incidentes e comunicação à ANPD; responsabilidade civil e criminal.

**Rascunho da explicação:** A chamada "Lei Carolina Dieckmann" tipificou a invasão de dispositivo informático alheio, mediante violação de mecanismo de segurança, com o fim de obter, adulterar ou destruir dados. Mudanças posteriores aumentaram as penas. O Marco Civil estabelece princípios, direitos e deveres no uso da internet, incluindo guarda de registros. A LGPD trata de dados pessoais: um pentest pode expor dados reais, então é preciso acordos de confidencialidade e cuidado no manuseio. Não dá para dar aconselhamento jurídico numa lição; o ponto é saber que **existe base legal**, que o consentimento do titular do sistema é essencial e que, em caso de dúvida, um advogado deve ser consultado. (Revisar a legislação vigente antes de publicar o conteúdo.)

**Exercícios sugeridos:**
1. (match) Ligar lei ↔ tema: 12.737/2012 ↔ invasão de dispositivo; 12.965/2014 ↔ Marco Civil; 13.709/2018 ↔ proteção de dados pessoais.
2. (true_false) "Acessar um sistema sem autorização é legal se nada for alterado ou roubado." → **Falso**.
3. (single_choice) "Qual lei trata especificamente de dados pessoais?" → **LGPD**.

**Lab/Missão:** —

---

### 0.1.4 — Divulgação responsável e bug bounty
`divulgacao-responsavel-e-bug-bounty` · dificuldade 1 · 8 min · 30 XP

**Objetivo:** Saber o que fazer ao encontrar uma vulnerabilidade e como programas de recompensa funcionam.

**Tópicos-chave:** divulgação coordenada; VDP (Vulnerability Disclosure Policy); bug bounty; "safe harbor"; prazos comuns; não explorar além do necessário; não vazar dados.

**Rascunho da explicação:** Se você encontra uma falha em um sistema que não é seu, o caminho seguro é procurar a **política de divulgação** da organização (muitas publicam em `/.well-known/security.txt`). Programas de bug bounty definem escopo, regras e recompensas, e muitos oferecem "safe harbor", que é a promessa de não processar quem seguir as regras. Reporte só o necessário para provar o problema, sem acessar dados de terceiros nem causar indisponibilidade. A divulgação coordenada dá tempo para a correção antes de qualquer publicação, por isso é comum combinar prazos.

**Exercícios sugeridos:**
1. (order) Encontrar a falha → parar de explorar → reportar pelo canal oficial → aguardar correção → divulgar de forma coordenada.
2. (single_choice) "O que é safe harbor num programa de bug bounty?" → **Compromisso de não tomar ação legal contra quem segue as regras**.
3. (true_false) "Publicar uma falha imediatamente nas redes é a forma mais ética de divulgar." → **Falso**.

**Lab/Missão:** —

---

## Módulo 0.2 — Seu laboratório (`02-seu-laboratorio`)

### 0.2.1 — Como a plataforma funciona
`como-a-plataforma-funciona` · dificuldade 1 · 5 min · 30 XP

**Objetivo:** Conhecer XP, níveis, streak, Bits, labs e dicas.

**Tópicos-chave:** mapa de trilhas; XP e níveis; streak e congelamento; Bits e loja; dicas pagas; flags; Byte, o mascote.

**Rascunho da explicação:** Você avança por um mapa de nós. Cada lição concede XP e quando seu XP cruza um limite você sobe de nível e muda de título. Estudar um pouco por dia mantém sua sequência (streak); se faltar um dia, um congelamento de streak pode salvar. Nos labs, a "flag" é um código que prova que você completou o objetivo. Dicas ajudam quando você trava, mas custam Bits e reduzem parte do XP daquele objetivo.

**Exercícios sugeridos:**
1. (single_choice) "O que é uma flag num lab?" → **Um código que prova que o objetivo foi cumprido**.
2. (true_false) "Usar dicas não tem custo." → **Falso**.
3. (match) Ligar elemento ↔ função (XP, Bits, streak, boss).

**Lab/Missão:** —

---

### 0.2.2 — Preparando o Docker (Windows + WSL2)
`preparando-o-docker` · dificuldade 1 · 10 min · 30 XP

**Objetivo:** Ter o Docker funcionando no WSL2 para rodar os labs.

**Tópicos-chave:** WSL2; Docker Desktop com integração WSL; `docker run hello-world`; containers vs. máquinas virtuais; por que labs são isolados.

**Rascunho da explicação:** Um container é um processo isolado com seu próprio sistema de arquivos e rede, mais leve que uma máquina virtual. Nossos labs usam containers para criar alvos descartáveis: você ataca, aprende, e tudo é apagado. No Windows, o Docker roda sobre o WSL2. Depois de instalar e ativar a integração com sua distro Ubuntu, `docker run hello-world` confirma que está tudo certo. Lembre: o acesso ao Docker é poderoso, por isso usamos apenas na sua máquina pessoal.

**Exercícios sugeridos:**
1. (order) Instalar WSL2 → instalar Docker Desktop → ativar integração com Ubuntu → rodar hello-world.
2. (fill_command) `docker run ___` → **hello-world**.
3. (true_false) "Containers são sempre mais isolados que máquinas virtuais." → **Falso** (são mais leves, mas o isolamento é diferente).

**Lab/Missão:** 🎯 Missão: rodar `docker run hello-world` e colar a saída (validação por `sim_terminal` ou conferência de texto).

---

### 0.2.3 — Lab: Olá, terminal
`lab-ola-terminal` · dificuldade 1 · 15 min · 150 XP · **lab:** `ola-terminal`

**Objetivo:** Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples.

**Tópicos-chave:** abrir sessão de lab; terminal web; `ls`, `cat`, `whoami`; submeter flag.

**Rascunho da explicação:** Este lab guiado apresenta o ambiente: um container "attacker" com seu terminal e um alvo com um arquivo escondido. Você usa comandos básicos para explorar o diretório, ler o arquivo e achar a flag. O foco é o fluxo da plataforma: iniciar, usar, validar e encerrar.

**Exercícios sugeridos (objetivos do lab):**
1. Descobrir o nome do usuário atual (`whoami`). → 20 XP
2. Listar arquivos ocultos e encontrar o arquivo da flag. → 50 XP
3. Ler o arquivo e submeter a flag. → 80 XP

**Lab/Missão:** manifesto `ola-terminal.yml` (1 container attacker + 1 target simples).

---

### 0.2.4 — Boss: Quiz de Ética
`boss-etica` · dificuldade 2 · 10 min · 100 XP · **boss**

**Objetivo:** Consolidar o módulo 0.1 e 0.2 num desafio cronometrado.

**Tópicos-chave:** autorização, escopo, legislação, divulgação, ferramentas da plataforma.

**Rascunho da explicação:** Boss com 6 questões (8 minutos) mesclando cenários: "Um cliente pede para testar o site, mas o servidor compartilha IP com outras empresas. O que fazer?" Acertando 5 ou mais, você ganha 3 estrelas e a conquista *Primeiro Byte de Ética*.

**Exercícios sugeridos:**
1. (single_choice) Cenário de escopo com IP compartilhado → **testar só o que o contrato cobre e alinhar com o cliente**.
2. (true_false) "Relatório vago protege o cliente." → **Falso**.
3. (order) Fases de um engajamento autorizado.
4. (match) Lei ↔ tema.
5. (single_choice) Cenário de divulgação responsável.
6. (multi_choice) Itens que devem constar nas regras de engajamento.
