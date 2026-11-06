# Trilha 1 — Fundamentos de TI
**slug da trilha:** `01-fundamentos-de-ti` · **cor:** ciano · **ícone:** 🖥️
**Descrição:** A base de tudo: Linux, redes, Windows e scripting. Sem isso, as ferramentas viram "mágica"; com isso, você entende o que está acontecendo.

---

## Módulo 1.1 — Linux essencial (`01-linux-essencial`)

### 1.1.1 — Sistema de arquivos e navegação
`sistema-de-arquivos-e-navegacao` · dificuldade 1 · 10 min · 30 XP

**Objetivo:** Navegar no terminal e entender a estrutura de diretórios.

**Tópicos-chave:** `pwd`, `ls -la`, `cd`, caminhos absoluto/relativo; `/etc`, `/var`, `/home`, `/tmp`, `/bin`; arquivos ocultos; `man`.

**Rascunho da explicação:** No Linux, tudo parte da raiz `/`. Configurações moram em `/etc`, logs em `/var/log`, arquivos dos usuários em `/home`, e `/tmp` guarda temporários. `pwd` mostra onde você está, `ls -la` lista inclusive ocultos (começam com ponto) e `cd` muda de pasta. Um caminho **absoluto** começa em `/`; um **relativo** parte de onde você está. Para um profissional de segurança, saber onde ficam logs e configurações é meio caminho para investigar ou auditar.

**Exercícios sugeridos:**
1. (single_choice) "Onde ficam, em geral, os arquivos de configuração do sistema?" → **/etc**.
2. (fill_command) "Listar todos os arquivos, inclusive ocultos, com detalhes: `ls ___`" → **-la**.
3. (sim_terminal) Navegar até `/var/log` e listar o conteúdo.

**Lab/Missão:** —

---

### 1.1.2 — Permissões e donos
`permissoes-e-donos` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Ler e alterar permissões; entender por que permissões mal configuradas são um risco.

**Tópicos-chave:** `rwx` para dono/grupo/outros; notação octal (`640`, `755`); `chmod`, `chown`; diretórios vs. arquivos; conceito de SUID (apenas conceito).

**Rascunho da explicação:** Cada arquivo tem dono, grupo e três conjuntos de permissões: leitura (r=4), escrita (w=2) e execução (x=1). `chmod 640 arquivo` dá leitura/escrita ao dono, leitura ao grupo e nada aos outros (6=4+2, 4, 0). Uma chave privada SSH com permissão `777` é como deixar a chave da casa debaixo do tapete. Permissões frouxas em arquivos de configuração e scripts são achados clássicos em auditorias. O bit **SUID** faz um programa rodar com os privilégios do dono, útil e perigoso se mal usado; aqui só o conceito.

**Exercícios sugeridos:**
1. (single_choice) "O que significa `chmod 640`?" → **dono lê/escreve, grupo lê, outros nada**.
2. (fill_command) "Dar execução ao dono: `chmod ___ script.sh`" → **u+x**.
3. (true_false) "Uma chave privada deve ser legível por todos." → **Falso**.

**Lab/Missão:** —

---

### 1.1.3 — Processos e serviços
`processos-e-servicos` · dificuldade 2 · 10 min · 40 XP

**Objetivo:** Listar, monitorar e encerrar processos; entender serviços.

**Tópicos-chave:** `ps aux`, `top/htop`, PID, `kill`, `systemctl status`; processo em segundo plano (`&`, `jobs`); serviços escutando portas (`ss -tulpn`).

**Rascunho da explicação:** Um programa em execução é um processo, com um PID. `ps aux` lista todos e `kill PID` pede o encerramento. Serviços são processos de longa duração (como um servidor web) gerenciados pelo `systemd`. Em segurança, olhar o que está rodando e **em quais portas** (`ss -tulpn`) é um dos primeiros passos de auditoria: serviço desnecessário aberto é superfície de ataque desnecessária.

**Exercícios sugeridos:**
1. (fill_command) "Mostrar portas TCP/UDP em escuta: `ss ___`" → **-tulpn**.
2. (single_choice) "O que identifica unicamente um processo?" → **PID**.
3. (true_false) "Serviços desnecessários em execução aumentam a superfície de ataque." → **Verdadeiro**.

**Lab/Missão:** —

---

### 1.1.4 — Pacotes e usuários
`pacotes-e-usuarios` · dificuldade 2 · 10 min · 40 XP

**Objetivo:** Gerenciar pacotes e entender usuários, grupos e `sudo`.

**Tópicos-chave:** `apt update/upgrade/install`; `/etc/passwd` e `/etc/shadow`; `useradd`, `usermod`, grupos; `sudo` e menor privilégio.

**Rascunho da explicação:** Distribuições Debian/Ubuntu usam o `apt`. Manter pacotes atualizados é a defesa mais simples contra vulnerabilidades conhecidas. As contas ficam em `/etc/passwd` (legível por todos) e os hashes das senhas em `/etc/shadow` (restrito ao root). `sudo` permite executar comandos como administrador sem usar a conta root diretamente, registrando quem fez o quê. O princípio do menor privilégio recomenda dar a cada usuário apenas o que ele precisa.

**Exercícios sugeridos:**
1. (single_choice) "Onde ficam os hashes das senhas?" → **/etc/shadow**.
2. (fill_command) "Atualizar a lista de pacotes: `sudo apt ___`" → **update**.
3. (true_false) "Usar a conta root para tudo é boa prática." → **Falso**.

**Lab/Missão:** —

---

### 1.1.5 — Pipes, redirecionamento e texto
`pipes-redirecionamento-e-texto` · dificuldade 2 · 15 min · 40 XP

**Objetivo:** Combinar comandos para filtrar e analisar texto (a "superpotência" da linha de comando).

**Tópicos-chave:** `|`, `>`, `>>`, `<`; `grep`, `cut`, `sort`, `uniq -c`, `head/tail`, `wc`; introdução ao `awk`.

**Rascunho da explicação:** Cada comando faz uma coisa bem; o pipe `|` liga a saída de um à entrada do outro. Exemplo: `cat access.log | grep "404" | cut -d' ' -f1 | sort | uniq -c | sort -nr | head` mostra os 10 IPs que mais geraram erro 404. Redirecionamento `>` sobrescreve um arquivo e `>>` acrescenta. Esse tipo de análise é rotina em investigação de logs e em pós-processamento de resultados de ferramentas.

**Exercícios sugeridos:**
1. (order) Ordenar os comandos para contar IPs únicos num log.
2. (fill_command) "Contar linhas: `cat arquivo | ___`" → **wc -l**.
3. (single_choice) "Diferença entre `>` e `>>`?" → **`>` sobrescreve; `>>` acrescenta**.

**Lab/Missão:** —

---

### 1.1.6 — Lab: Linux Basics
`lab-linux-basics` · dificuldade 2 · 25 min · 200 XP · **lab:** `linux-basics`

**Objetivo:** Praticar navegação, permissões, processos e filtragem de texto num sistema real.

**Tópicos-chave:** busca de arquivos (`find`), leitura de logs, permissões, pipes.

**Rascunho da explicação:** O container `linux-basics` simula um servidor pequeno com logs, arquivos de configuração e um usuário de teste. Cada objetivo pede uma habilidade: achar um arquivo por nome, descobrir quem tem permissão de ler um arquivo sensível, identificar o processo que escuta numa porta e extrair um dado de um log.

**Exercícios sugeridos (objetivos):**
1. Encontrar o arquivo `.config_secreta` com `find`. → 40 XP
2. Descobrir qual usuário é dono do arquivo `relatorio.txt`. → 40 XP
3. Identificar a porta em que o serviço `mini-web` escuta. → 50 XP
4. Contar quantas vezes o IP `10.0.0.7` aparece no log e submeter como flag. → 70 XP

**Lab/Missão:** manifesto `linux-basics.yml`.

---

### 1.1.7 — Boss: Linux
`boss-linux` · dificuldade 2 · 10 min · 100 XP · **boss**

**Objetivo:** Consolidar o módulo.

**Rascunho da explicação:** 6 exercícios cronometrados (10 min) misturando navegação, permissões, processos e pipes.

**Exercícios sugeridos:** (fill_command) montar um `chmod`; (sim_terminal) filtrar um log; (single_choice) escolher o comando certo; (order) pipeline; (true_false) boas práticas de `sudo`; (multi_choice) quais diretórios contêm logs.

---

## Módulo 1.2 — Redes essenciais (`02-redes-essenciais`)

### 1.2.1 — Modelo OSI e TCP/IP
`modelo-osi-e-tcp-ip` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Entender as camadas e onde cada protocolo vive.

**Tópicos-chave:** 7 camadas OSI; 4 camadas TCP/IP; encapsulamento; exemplos por camada (Ethernet, IP, TCP/UDP, HTTP).

**Rascunho da explicação:** Pense numa carta: o conteúdo (aplicação) vai num envelope (TCP), dentro de outro envelope com endereço da cidade (IP), que vai num caminhão com placa (Ethernet). Cada camada adiciona seu cabeçalho: isso é o **encapsulamento**. Saber a camada ajuda a diagnosticar e a escolher a defesa: um firewall de rede atua nas camadas 3/4, um WAF na 7. Camadas OSI: Física, Enlace, Rede, Transporte, Sessão, Apresentação, Aplicação.

**Exercícios sugeridos:**
1. (order) As 7 camadas em ordem.
2. (match) Protocolo ↔ camada (IP ↔ Rede, TCP ↔ Transporte, HTTP ↔ Aplicação, Ethernet ↔ Enlace).
3. (single_choice) "Em que camada atua um roteador?" → **Rede (3)**.

**Lab/Missão:** —

---

### 1.2.2 — Endereçamento IP e NAT
`enderecamento-ip-e-nat` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Ler endereços IPv4, máscaras CIDR e entender NAT.

**Tópicos-chave:** IPv4 e IPv6; CIDR (`/24`); faixas privadas (10/8, 172.16/12, 192.168/16); gateway; NAT; DHCP; ARP.

**Rascunho da explicação:** Um IP identifica um dispositivo na rede. A máscara (`/24` = 255.255.255.0) diz quantos bits formam a rede: `192.168.1.0/24` tem 254 hosts utilizáveis. Endereços privados não são roteados na internet; o **NAT** do roteador traduz seus endereços privados para um público. Em segurança, conhecer sub-redes é essencial para definir escopo e entender o que um scan está alcançando.

**Exercícios sugeridos:**
1. (single_choice) "Quantos hosts utilizáveis tem /24?" → **254**.
2. (true_false) "192.168.0.10 é um endereço público." → **Falso**.
3. (match) CIDR ↔ máscara (/8, /16, /24).

**Lab/Missão:** —

---

### 1.2.3 — Portas e protocolos comuns
`portas-e-protocolos-comuns` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Memorizar as portas mais comuns e entender TCP vs. UDP.

**Tópicos-chave:** 20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS, 445 SMB, 3306 MySQL, 3389 RDP; handshake TCP de 3 vias; UDP sem conexão.

**Rascunho da explicação:** Uma porta identifica um serviço dentro de um host (como o número de um apartamento em um prédio). O TCP estabelece conexão com um handshake (SYN, SYN-ACK, ACK) e garante entrega; o UDP é rápido e sem garantias (DNS, streaming). Quando alguém faz um scan, está perguntando "quais portas respondem?". Saber o que cada uma costuma ser ajuda a interpretar resultados e a priorizar riscos.

**Exercícios sugeridos:**
1. (match) Porta ↔ serviço.
2. (single_choice) "Protocolo do handshake de 3 vias?" → **TCP**.
3. (true_false) "Telnet é um protocolo seguro para administração remota." → **Falso** (texto puro; usar SSH).

**Lab/Missão:** —

---

### 1.2.4 — DNS em profundidade
`dns-em-profundidade` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Entender resolução de nomes e registros comuns.

**Tópicos-chave:** resolvedor recursivo, raiz/TLD/autoritativo; registros A, AAAA, CNAME, MX, TXT, NS; TTL; `dig`/`nslookup`; riscos (cache poisoning, DNS spoofing, tunelamento) em nível conceitual.

**Rascunho da explicação:** O DNS é a "lista telefônica" da internet. Quando você digita um site, seu resolvedor pergunta à raiz, depois ao TLD (.br) e então ao servidor autoritativo do domínio. Registros TXT são muito usados em verificações e SPF; MX define os servidores de e-mail. Em segurança, o DNS revela muita coisa sobre uma organização (subdomínios, e-mail, provedores) e também é alvo/meio de ataques.

**Exercícios sugeridos:**
1. (match) Registro ↔ função.
2. (fill_command) "Consultar o IP de um domínio: `dig ___ exemplo.com`" → **A** (ou omitir).
3. (single_choice) "Qual registro indica os servidores de e-mail?" → **MX**.

**Lab/Missão:** —

---

### 1.2.5 — HTTP/HTTPS na prática
`http-https-na-pratica` · dificuldade 2 · 15 min · 40 XP

**Objetivo:** Ler requisições/respostas HTTP e entender cookies e status.

**Tópicos-chave:** métodos (GET, POST, PUT, DELETE); headers (Host, User-Agent, Cookie, Set-Cookie, Content-Type); status 2xx/3xx/4xx/5xx; `curl -i`; HTTPS e certificados; cookies e flags (`HttpOnly`, `Secure`, `SameSite`).

**Rascunho da explicação:** HTTP é um diálogo de texto: o cliente envia método, caminho e headers; o servidor responde com status, headers e corpo. `curl -i http://alvo.lab/` mostra tudo. Cookies mantêm estado de sessão. Os atributos `HttpOnly`, `Secure` e `SameSite` reduzem riscos de roubo e uso indevido de cookies. HTTPS adiciona criptografia e autenticação do servidor; cuidado, HTTPS protege o **canal**, não torna a aplicação segura.

**Exercícios sugeridos:**
1. (match) Status ↔ significado (200, 301, 403, 404, 500).
2. (single_choice) "Qual atributo impede JavaScript de ler o cookie?" → **HttpOnly**.
3. (fill_command) "Mostrar cabeçalhos da resposta: `curl ___ http://alvo.lab`" → **-i**.

**Lab/Missão:** —

---

### 1.2.6 — Lab: Explorando a rede
`lab-explorando-a-rede` · dificuldade 2 · 25 min · 200 XP · **lab:** `explorando-a-rede`

**Objetivo:** Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab.

**Rascunho da explicação:** Você recebe um alvo com DNS interno, um serviço web e um serviço TCP simples. Deve resolver nomes, inspecionar cabeçalhos HTTP e conversar com um serviço via `nc`.

**Exercícios sugeridos (objetivos):**
1. Resolver o IP de `intranet.lab`. → 40 XP
2. Descobrir o header customizado retornado pelo servidor web. → 60 XP
3. Conectar via `nc` na porta do serviço e ler o banner. → 100 XP

---

### 1.2.7 — Boss: Redes
`boss-redes` · dificuldade 3 · 10 min · 100 XP · **boss**

**Rascunho da explicação:** 7 exercícios cronometrados: camadas OSI, CIDR, portas, registros DNS e status HTTP.

---

## Módulo 1.3 — Windows e conceitos de SO (`03-windows-e-so`)

### 1.3.1 — Estrutura do Windows
`estrutura-do-windows` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Conhecer registro, serviços, NTFS e logs do Windows.

**Tópicos-chave:** Registro (HKLM, HKCU); serviços; NTFS e ACLs; Event Viewer; `C:\Windows`, `Program Files`, perfis de usuário.

**Rascunho da explicação:** O Windows guarda configurações no **Registro**, uma base hierárquica; programas e malwares frequentemente o usam para persistir. Serviços rodam em segundo plano. O NTFS controla acesso com listas de controle (ACLs). O Visualizador de Eventos (Event Viewer) registra logons, falhas e mudanças, fonte essencial para defesa e forense.

**Exercícios sugeridos:**
1. (single_choice) "Onde o Windows guarda configurações do sistema?" → **Registro**.
2. (match) Ferramenta ↔ função (Event Viewer, Gerenciador de Serviços, Regedit).
3. (true_false) "Logs do Windows ajudam a detectar tentativas de logon falhas." → **Verdadeiro**.

---

### 1.3.2 — Usuários e privilégios no Windows
`usuarios-e-privilegios-windows` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Entender contas, grupos, UAC e visão geral de Active Directory.

**Tópicos-chave:** contas locais vs. de domínio; grupo Administradores; UAC; SID; Active Directory (domínio, controlador de domínio, Kerberos em nível conceitual).

**Rascunho da explicação:** O Windows identifica contas por SIDs. O **UAC** pede confirmação antes de ações administrativas. Em empresas, o **Active Directory** centraliza usuários e políticas: um domínio comprometido é um cenário crítico, por isso privilégios devem ser mínimos e contas administrativas separadas das do dia a dia.

**Exercícios sugeridos:**
1. (single_choice) "Função do UAC?" → **Pedir confirmação para ações que exigem privilégios elevados**.
2. (true_false) "Usar conta administradora para tarefas diárias é recomendado." → **Falso**.

---

### 1.3.3 — PowerShell básico
`powershell-basico` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Executar cmdlets simples e entender sua importância em defesa e ataque.

**Tópicos-chave:** `Get-Process`, `Get-Service`, `Get-ChildItem`; pipeline de objetos; `Get-EventLog`/`Get-WinEvent`; política de execução.

**Rascunho da explicação:** O PowerShell passa **objetos**, não texto, pelo pipeline, o que facilita filtrar: `Get-Process | Where-Object CPU -gt 100`. É ferramenta de administração poderosa, e por isso também muito monitorada em defesa, pois é usada em ataques "sem arquivo".

**Exercícios sugeridos:**
1. (fill_command) "Listar serviços: `___-Service`" → **Get**.
2. (single_choice) "O que o pipeline do PowerShell passa entre comandos?" → **Objetos**.

---

## Módulo 1.4 — Scripting (`04-scripting`)

### 1.4.1 — Bash para automação
`bash-para-automacao` · dificuldade 2 · 15 min · 40 XP

**Objetivo:** Escrever scripts simples com variáveis, condicionais e laços.

**Tópicos-chave:** shebang; variáveis; `if`; `for`; argumentos `$1`; códigos de saída; `chmod +x`.

**Rascunho da explicação:** Um script bash é uma lista de comandos reutilizável. Exemplo: um laço que testa se vários hosts respondem a ping. Automatizar tarefas repetitivas (coleta de informações, checagens) é o que separa o iniciante do profissional.

**Exercícios sugeridos:**
1. (fill_command) "Primeira linha de um script bash: `#!/___`" → **bin/bash**.
2. (single_choice) "O que `$1` representa?" → **O primeiro argumento do script**.
3. (order) Montar um `for` simples na ordem correta.

---

### 1.4.2 — Python para segurança
`python-para-seguranca` · dificuldade 3 · 20 min · 50 XP

**Objetivo:** Usar Python para tarefas básicas: sockets, requests e hashing.

**Tópicos-chave:** `hashlib`; `requests`; `socket` (conectar e ler banner); leitura de arquivos; tratamento de erros.

**Rascunho da explicação:** Python é a língua franca de ferramentas de segurança. Com poucas linhas você calcula um hash, faz uma requisição HTTP ou verifica se uma porta está aberta num host **autorizado**. Exemplo conceitual: criar um socket, `connect_ex((host, porta))` e interpretar o resultado. Escreva ferramentas pequenas e legíveis; elas ensinam mais do que usar programas prontos sem entender.

**Exercícios sugeridos:**
1. (code_review) Achar o erro num script que calcula SHA-256 sem codificar a string em bytes.
2. (single_choice) "Biblioteca padrão para hash?" → **hashlib**.
3. (true_false) "Escanear portas de qualquer host é aceitável se o script for seu." → **Falso**.

---

### 1.4.3 — Expressões regulares
`expressoes-regulares` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Criar regex para extrair padrões (IPs, e-mails, tokens) de textos e logs.

**Tópicos-chave:** classes `\d`, `\w`; quantificadores `+ * ?`; âncoras; grupos; `grep -E`; testar no Python.

**Rascunho da explicação:** Regex descreve padrões de texto. `\b\d{1,3}(\.\d{1,3}){3}\b` encontra IPs simples. É muito usada em análise de logs, regras de detecção e na procura de segredos expostos em código. Cuidado com regex complexas: podem ser lentas e imprecisas.

**Exercícios sugeridos:**
1. (single_choice) "O que `\d+` casa?" → **Um ou mais dígitos**.
2. (fill_command) "Filtrar IPs com grep: `grep ___ '[0-9]{1,3}(\.[0-9]{1,3}){3}' log`" → **-E**.
3. (sim_terminal) Extrair todos os e-mails de um arquivo.
