# Trilha 5 — Segurança Web
**slug da trilha:** `05-seguranca-web` · **cor:** vermelho · **ícone:** 🕸️
**Descrição:** Como aplicações web falham e como corrigir: OWASP Top 10, injeção, XSS, CSRF, controle de acesso, e ferramentas de teste. Toda prática ocorre em alvos do lab.

> **Regra de profundidade:** pelo menos 2 lições completas por módulo + os 2 labs funcionais. As demais podem ser `draft` (≥ 250 palavras, 2 exercícios). Sempre incluir a **correção** (como defender) em cada vulnerabilidade.

---

## Módulo 5.1 — Fundamentos web (`01-fundamentos-web`)

### 5.1.1 — Como a web funciona por dentro
`como-a-web-funciona-por-dentro` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Entender o fluxo cliente–servidor para saber onde cada falha nasce.

**Tópicos-chave:** navegador, DNS, TCP, TLS, requisição HTTP, servidor web, aplicação, banco de dados; front-end vs. back-end; entrada do usuário como superfície de ataque; same-origin policy; devtools do navegador.

**Rascunho da explicação:** Quando você abre uma página, o navegador resolve o nome, abre conexão, negocia TLS, envia uma requisição e renderiza a resposta. Tudo que o usuário controla (URL, parâmetros, headers, cookies, corpo) é **entrada não confiável**, e a regra de ouro da segurança web é: *nunca confie no cliente*. Validação só no navegador é cosmética, porque o atacante envia requisições diretamente ao servidor. A **same-origin policy** impede que scripts de um site leiam dados de outro.

**Exercícios sugeridos:**
1. (order) Ordenar as etapas ao abrir uma página HTTPS.
2. (true_false) "Validar só no front-end é suficiente." → **Falso**.
3. (multi_choice) "Quais são entradas controladas pelo usuário?" → parâmetros de URL, cookies, headers, corpo do POST.

---

### 5.1.2 — OWASP Top 10: visão geral
`owasp-top-10-visao-geral` · dificuldade 2 · 15 min · 40 XP

**Objetivo:** Conhecer as categorias de risco mais comuns em aplicações web.

**Tópicos-chave:** o que é a OWASP; Top 10 como lista de conscientização (controle de acesso quebrado, falhas criptográficas, injeção, design inseguro, configuração incorreta, componentes vulneráveis, falhas de autenticação, integridade de software/dados, falhas de log/monitoramento, SSRF); a lista é atualizada periodicamente, então **consultar a versão vigente** em owasp.org.

**Rascunho da explicação:** O OWASP Top 10 é um documento de consenso sobre os riscos mais críticos para aplicações web. Ele não é uma lista de ataques, e sim de *categorias de falhas*: controle de acesso quebrado, por exemplo, abrange IDOR, escalação de privilégios e acesso a rotas administrativas. Use-o como mapa de estudo e como checklist de revisão em projetos.

**Exercícios sugeridos:**
1. (match) Categoria ↔ exemplo (controle de acesso ↔ ver pedido de outro usuário; injeção ↔ consulta SQL concatenada; configuração incorreta ↔ painel admin com senha padrão).
2. (single_choice) "A OWASP Top 10 é…" → **Uma lista de categorias de risco consensuais**.

---

### 5.1.3 — Proxy de interceptação (Burp/ZAP)
`proxy-de-interceptacao` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Entender como inspecionar e modificar requisições em testes autorizados.

**Tópicos-chave:** proxy entre navegador e servidor; interceptar, repetir (repeater) e comparar requisições; certificado do proxy; escopo; ZAP como alternativa gratuita e de código aberto; no lab, uso via `curl` ou proxy no attacker.

**Rascunho da explicação:** Um proxy de interceptação fica entre seu navegador e o alvo e permite *pausar* uma requisição, alterar um parâmetro e reenviar. É assim que testadores verificam se o servidor realmente valida o que recebe. Configure o escopo para que apenas o alvo autorizado seja capturado. No lab, usamos `curl` e scripts para simular o mesmo fluxo sem depender de interface gráfica.

**Exercícios sugeridos:**
1. (single_choice) "Para que serve o repeater?" → **Reenviar requisições modificadas e comparar respostas**.
2. (true_false) "O escopo do proxy deve incluir qualquer site visitado." → **Falso**.

---

## Módulo 5.2 — Vulnerabilidades principais (`02-vulnerabilidades-principais`)

### 5.2.1 — SQL Injection
`sql-injection` · dificuldade 2 · 15 min · 40 XP

**Objetivo:** Entender a causa raiz, o impacto e a correção da injeção SQL.

**Tópicos-chave:** concatenação de entrada em consultas; autenticação burlada (`' OR '1'='1`) **como conceito e no lab**; tipos (in-band, blind) em visão geral; impacto (leitura/alteração de dados); defesa: **consultas parametrizadas (prepared statements)**, ORM com cuidado, privilégios mínimos do usuário do banco, validação e tratamento de erros.

**Rascunho da explicação:** Imagine um formulário que monta a consulta assim: `SELECT * FROM users WHERE name='` + entrada + `' AND pass='...'`. Se a entrada for algo que "fecha" a aspa e acrescenta lógica, o banco passa a obedecer ao *atacante* e não ao programador, porque dado e código se misturaram. A correção não é "filtrar aspas": é **separar código de dados** com consultas parametrizadas, de modo que a entrada nunca seja interpretada como SQL. Complementos: usuário do banco com poucos privilégios, mensagens de erro genéricas e testes automatizados.

**Exercícios sugeridos:**
1. (single_choice) "Qual é a causa raiz de SQLi?" → **Misturar entrada do usuário com o código SQL**.
2. (code_review) Marcar a linha vulnerável em um trecho que concatena a entrada (e depois escolher a versão parametrizada).
3. (single_choice) "Melhor defesa?" → **Consultas parametrizadas**.
4. (true_false) "Remover aspas da entrada resolve SQLi de forma definitiva." → **Falso**.

---

### 5.2.2 — Cross-Site Scripting (XSS)
`xss` · dificuldade 2 · 15 min · 40 XP

**Objetivo:** Entender como scripts não confiáveis chegam ao navegador da vítima e como evitar.

**Tópicos-chave:** refletido, armazenado, baseado em DOM; impacto (roubo de sessão se cookie não for HttpOnly, ações em nome do usuário); defesas: **codificação de saída por contexto**, CSP, `HttpOnly`, sanitização de HTML com bibliotecas confiáveis, frameworks que escapam por padrão.

**Rascunho da explicação:** XSS ocorre quando a aplicação devolve dados do usuário no HTML sem escapar, e o navegador interpreta como código. No **refletido**, a entrada volta na mesma resposta; no **armazenado**, fica no banco (um comentário, por exemplo) e atinge todo visitante. A defesa principal é **escapar a saída conforme o contexto** (HTML, atributo, JS, URL). A CSP é uma segunda camada que restringe de onde scripts podem rodar.

**Exercícios sugeridos:**
1. (match) Tipo de XSS ↔ descrição.
2. (single_choice) "Defesa primária contra XSS?" → **Codificar/escapar a saída conforme o contexto**.
3. (true_false) "`HttpOnly` impede XSS." → **Falso**, apenas impede que o script leia o cookie.

---

### 5.2.3 — CSRF
`csrf` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Entender requisições forjadas e as defesas.

**Tópicos-chave:** navegador envia cookies automaticamente; ação em nome do usuário logado; tokens anti-CSRF; `SameSite`; verificação de `Origin`/`Referer`; reautenticação em ações sensíveis.

**Rascunho da explicação:** Se você está logado num banco e abre uma página maliciosa, seu navegador pode enviar ao banco uma requisição *com seus cookies*, sem você perceber. O servidor precisa de algo que o atacante não consiga adivinhar: um **token anti-CSRF** por sessão/formulário. Cookies com `SameSite=Lax` ou `Strict` já bloqueiam boa parte desses casos.

**Exercícios sugeridos:**
1. (single_choice) "Por que o CSRF funciona?" → **Navegadores enviam cookies automaticamente**.
2. (multi_choice) "Defesas?" → token anti-CSRF, SameSite, checar Origin.

---

### 5.2.4 — Controle de acesso quebrado e IDOR
`controle-de-acesso-quebrado-e-idor` · dificuldade 2 · 15 min · 40 XP

**Objetivo:** Reconhecer quando "estar logado" não basta.

**Tópicos-chave:** IDOR (referência insegura a objeto); escalação horizontal e vertical; rotas administrativas expostas; verificação de autorização **no servidor** por requisição; identificadores imprevisíveis como camada extra (não substituem autorização).

**Rascunho da explicação:** Se `/pedido/1042` mostra o *seu* pedido e `/pedido/1043` mostra o de outra pessoa, há IDOR: o servidor confiou no número vindo do cliente. A correção: para cada requisição, verificar se **o usuário autenticado tem direito àquele recurso** (por exemplo, `WHERE id = ? AND user_id = ?`). UUIDs dificultam adivinhar, mas não substituem a checagem.

**Exercícios sugeridos:**
1. (code_review) Achar a ausência de checagem de dono do recurso.
2. (single_choice) "IDs aleatórios resolvem IDOR?" → **Não; a autorização no servidor é necessária**.
3. (match) Tipo de escalação ↔ exemplo.

---

### 5.2.5 — Autenticação e sessão quebradas
`autenticacao-e-sessao-quebradas` · dificuldade 3 · 12 min · 50 XP

**Objetivo:** Identificar falhas em login, recuperação de senha e gestão de sessão.

**Tópicos-chave:** senhas fracas permitidas; ausência de limite de tentativas; mensagens que revelam se o usuário existe; fixação de sessão; sessão que não expira; recuperação de senha insegura; MFA.

**Rascunho da explicação:** Muitas invasões acontecem pela porta da frente. Um login sem rate limit permite força bruta; mensagens como "usuário não existe" ajudam a enumerar contas; tokens de recuperação previsíveis permitem tomar contas. Corrija com limites, mensagens genéricas, tokens aleatórios e de uso único, expiração e MFA.

**Exercícios sugeridos:**
1. (multi_choice) "Falhas de autenticação?" → sem rate limit, mensagens diferentes para usuário/senha, sessão sem expiração.
2. (true_false) "Mensagem 'senha incorreta' (vs. 'login inválido') ajuda a enumerar usuários." → **Verdadeiro**.

---

### 5.2.6 — SSRF e configurações inseguras
`ssrf-e-configuracoes-inseguras` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Entender requisições do lado do servidor e erros de configuração.

**Tópicos-chave:** SSRF (servidor induzido a fazer requisições, inclusive internas); metadados de nuvem como alvo clássico (conceito); listas de permissão de destinos; cabeçalhos de segurança; modo debug em produção; credenciais padrão; listagem de diretórios; componentes desatualizados.

**Rascunho da explicação:** Se uma aplicação busca uma URL informada pelo usuário (para gerar uma prévia, por exemplo), um atacante pode apontá-la para serviços *internos* que ele não alcançaria diretamente. A defesa é validar destinos com **lista de permissão**, bloquear redes internas e isolar o serviço. Na categoria de configurações inseguras entram painéis com senha padrão, mensagens de erro detalhadas e arquivos de backup acessíveis.

**Exercícios sugeridos:**
1. (single_choice) "Principal defesa contra SSRF?" → **Lista de permissão de destinos e bloqueio de redes internas**.
2. (multi_choice) "Configurações inseguras?" → debug ativo em produção, credenciais padrão, listagem de diretórios.

---

### 5.2.7 — Desenvolvimento seguro: corrigindo as falhas
`desenvolvimento-seguro` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Transformar o que você aprendeu em hábitos de código.

**Tópicos-chave:** validação e codificação; consultas parametrizadas; gestão de segredos; dependências e atualização (SCA); revisão de código; SAST/DAST (conceito); testes de segurança no CI; logging e monitoramento; cabeçalhos (CSP, HSTS, X-Content-Type-Options).

**Rascunho da explicação:** Segurança não é uma etapa final: é parte do ciclo (*shift left*). Revise código procurando entradas, saídas e autorização; mantenha dependências atualizadas; nunca coloque segredos no repositório; automatize análises no pipeline. Para cada falha vista nesta trilha, você deve saber *como o atacante pensa* e *como o desenvolvedor corrige*.

**Exercícios sugeridos:**
1. (code_review) Trecho com 3 problemas (SQL concatenado, segredo no código, saída sem escape): marcar todos.
2. (match) Falha ↔ correção.

---

## Módulo 5.3 — Prática (`03-pratica-web`)

### 5.3.1 — Lab: Bypass de login com SQL Injection
`lab-web-sqli-login` · dificuldade 2 · 30 min · 250 XP · **lab:** `web-sqli-login`

**Objetivo:** Reproduzir uma SQLi num alvo fictício e depois ler o código corrigido.

**Rascunho da explicação:** O alvo é o painel da "Padaria Byte", com um login vulnerável. Primeiro você faz reconhecimento (diretórios, formulário), depois testa a entrada e comprova que o código concatena dados. Ao concluir, o writeup mostra a **versão corrigida** com consulta parametrizada.

**Exercícios sugeridos (objetivos):**
1. Encontrar o painel de login (enumeração de diretórios). → 40 XP
2. Confirmar a vulnerabilidade (resposta de erro do banco). → 60 XP
3. Entrar como administrador sem conhecer a senha e capturar a flag. → 110 XP
4. (Bônus) Descrever a correção no campo de reflexão (validação manual). → 40 XP

---

### 5.3.2 — Lab: XSS e IDOR
`lab-web-xss-idor` · dificuldade 3 · 35 min · 300 XP · **lab:** `web-xss-idor`

**Objetivo:** Identificar um XSS armazenado e um IDOR no mesmo alvo.

**Rascunho da explicação:** Um mural de recados vulnerável permite que a entrada seja renderizada sem escape, e uma página de pedidos expõe dados de outros usuários por ID sequencial. Você prova cada falha e, no fim, compara com o código corrigido (escape de saída + checagem de dono).

**Exercícios sugeridos (objetivos):**
1. Provar o XSS armazenado (bot do lab "visita" a página e revela a flag). → 100 XP
2. Acessar o pedido de outro usuário via IDOR. → 100 XP
3. Submeter o trecho de código que corrige a checagem de autorização (múltipla escolha). → 100 XP

---

### 5.3.3 — Boss: Segurança Web
`boss-seguranca-web` · dificuldade 3 · 15 min · 100 XP · **boss**

**Rascunho da explicação:** 8 exercícios: identificar o tipo de falha em trechos de código, escolher a correção certa, ligar categorias OWASP a exemplos e analisar uma requisição HTTP suspeita.
