# Trilha 4 — Segurança de Redes
**slug da trilha:** `04-seguranca-de-redes` · **cor:** azul · **ícone:** 🌐
**Descrição:** Como redes são defendidas e observadas: firewalls, IDS, VPN, análise de tráfego e reconhecimento com nmap.

> **Regra de profundidade:** pelo menos 2 lições completas (`status: complete`) + o lab; as demais podem ficar `draft` com o rascunho abaixo expandido para ≥ 250 palavras e 2 exercícios.

---

## Módulo 4.1 — Defesa e visibilidade (`01-defesa-e-visibilidade`)

### 4.1.1 — Firewalls e segmentação
`firewalls-e-segmentacao` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Entender como filtrar tráfego e dividir a rede em zonas.

**Tópicos-chave:** filtro de pacotes vs. stateful vs. next-gen; regras allow/deny; política padrão "negar tudo"; DMZ; VLANs; segmentação e movimento lateral; `iptables`/`nftables`/`ufw` (conceito).

**Rascunho da explicação:** Um firewall é um porteiro com uma lista de regras: de onde para onde, em qual porta e protocolo. A boa prática é **negar por padrão** e liberar só o necessário. A segmentação divide a rede em zonas (usuários, servidores, DMZ para serviços públicos); assim, se um computador for comprometido, o atacante não alcança tudo facilmente. A ordem das regras importa: a primeira que casa vence.

**Exercícios sugeridos:**
1. (single_choice) "Política padrão mais segura?" → **Negar tudo e liberar o necessário**.
2. (order) Ordenar regras de firewall para o resultado esperado.
3. (fill_command) "Liberar SSH no ufw: `sudo ufw allow ___`" → **22/tcp** (ou `ssh`).

---

### 4.1.2 — IDS e IPS
`ids-ips` · dificuldade 2 · 10 min · 40 XP

**Objetivo:** Diferenciar detecção e prevenção de intrusão.

**Tópicos-chave:** IDS vs. IPS; baseado em assinatura vs. anomalia; NIDS vs. HIDS; falsos positivos/negativos; exemplos (Snort, Suricata, Wazuh — conceito).

**Rascunho da explicação:** O **IDS** observa e alerta; o **IPS** fica em linha e bloqueia. Detecção por assinatura reconhece padrões conhecidos (rápida, mas cega a novidades); por anomalia detecta desvios do normal (pega o novo, mas gera mais alarmes falsos). Alertas sem triagem viram ruído, então ajuste e contexto são essenciais.

**Exercícios sugeridos:**
1. (match) IDS/IPS ↔ comportamento.
2. (single_choice) "Qual bloqueia ativamente o tráfego?" → **IPS**.
3. (true_false) "Detecção por assinatura encontra ataques totalmente desconhecidos." → **Falso**.

---

### 4.1.3 — VPN e túneis
`vpn-e-tuneis` · dificuldade 2 · 10 min · 40 XP

**Objetivo:** Entender para que servem VPNs e seus limites.

**Tópicos-chave:** túnel criptografado; site-to-site e acesso remoto; WireGuard, IPsec, OpenVPN (visão geral); SSH tunneling (conceito); VPN comercial vs. corporativa; split tunneling.

**Rascunho da explicação:** Uma VPN cria um "tubo" criptografado entre dois pontos. Numa empresa, permite acesso seguro à rede interna. Em casa, uma VPN comercial só muda *em quem você confia* (o provedor em vez da rede local) e **não** protege contra malware ou phishing. Cuidado com o split tunneling: parte do tráfego fica fora do túnel.

**Exercícios sugeridos:**
1. (true_false) "Uma VPN comercial torna você anônimo e imune a malware." → **Falso**.
2. (single_choice) "Principal função de uma VPN corporativa?" → **Acesso seguro à rede interna por canal criptografado**.

---

### 4.1.4 — Segurança de Wi-Fi
`wifi-seguranca` · dificuldade 2 · 10 min · 40 XP

**Objetivo:** Conhecer protocolos e riscos de redes sem fio, em nível defensivo.

**Tópicos-chave:** WEP (quebrado), WPA2, WPA3; PSK vs. Enterprise (802.1X); WPS; "evil twin" (conceito); redes públicas; boas configurações do roteador.

**Rascunho da explicação:** WEP é inseguro; hoje se usa WPA2 com senha forte ou WPA3. Em empresas, o modo Enterprise autentica cada usuário. Redes abertas permitem que terceiros observem tráfego não cifrado, e um "gêmeo maligno" imita uma rede legítima para enganar. Desative WPS, use senha longa, atualize o firmware e separe uma rede de convidados.

**Exercícios sugeridos:**
1. (order) Ordenar WEP, WPA, WPA2, WPA3 do menos ao mais seguro.
2. (multi_choice) "Boas práticas no roteador?" → desativar WPS, atualizar firmware, rede de convidados.

---

### 4.1.5 — Captura e análise de tráfego
`captura-e-analise-de-trafego` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Capturar e ler pacotes com tcpdump/Wireshark em tráfego do lab.

**Tópicos-chave:** interfaces; filtros de captura vs. exibição; `tcpdump -i eth0 port 80`; seguir fluxo TCP; identificar credenciais em texto puro (no lab); arquivos `.pcap`; legalidade e ética de capturar tráfego.

**Rascunho da explicação:** Analisar pacotes é ver "o que realmente passa no fio". Com `tcpdump` você captura no terminal; com Wireshark, analisa visualmente. Em um protocolo sem criptografia (FTP, HTTP), a senha aparece em texto puro, o que mostra por que HTTPS e SSH existem. Só capture tráfego de redes que você administra ou tem autorização para analisar.

**Exercícios sugeridos:**
1. (fill_command) "Capturar tráfego da porta 21: `sudo tcpdump -i eth0 port ___`" → **21**.
2. (single_choice) "Por que FTP é arriscado?" → **Credenciais trafegam em texto puro**.
3. (true_false) "Capturar tráfego de uma rede alheia é permitido se for só para aprender." → **Falso**.

---

### 4.1.6 — Protocolos inseguros e alternativas
`protocolos-inseguros` · dificuldade 2 · 10 min · 40 XP

**Objetivo:** Reconhecer protocolos legados e substituí-los.

**Tópicos-chave:** Telnet → SSH; FTP → SFTP/FTPS; HTTP → HTTPS; SMBv1 → SMBv3; SNMPv1/2 → v3; POP3/IMAP sem TLS.

**Rascunho da explicação:** Muitos protocolos antigos foram criados quando a rede era "de confiança" e não cifram nada. A maioria das migrações é simples: trocar o protocolo por seu sucessor seguro e desativar o legado. Em auditorias, achar Telnet ou SMBv1 expostos é um achado clássico.

**Exercícios sugeridos:**
1. (match) Protocolo inseguro ↔ alternativa.
2. (single_choice) "Substituto seguro do Telnet?" → **SSH**.

---

## Módulo 4.2 — Reconhecimento prático (`02-reconhecimento-pratico`)

### 4.2.1 — Lab: Reconhecimento com nmap
`lab-recon-nmap` · dificuldade 3 · 30 min · 250 XP · **lab:** `recon-nmap`

**Objetivo:** Descobrir hosts, portas e serviços num ambiente fictício **autorizado**.

**Tópicos-chave:** descoberta de hosts (`-sn`); varredura de portas (`-p`, `-sS`/`-sT`); detecção de versão (`-sV`); scripts padrão (`-sC`, conceito); interpretar saídas; salvar resultados (`-oN`); ética: só em alvos autorizados.

**Rascunho da explicação:** O nmap pergunta à rede "quem está aí e o que oferece?". Primeiro você descobre os hosts vivos; depois varre portas; depois identifica versões, que ajudam a ligar o que roda a vulnerabilidades conhecidas (CVEs). Cada flag tem um custo: mais barulho, mais tempo. Em testes reais, o escopo define *quais IPs e com que agressividade* você pode varrer. No lab, a rede é isolada e é sempre segura praticar.

**Exercícios sugeridos (objetivos do lab):**
1. Descobrir qual IP do alvo responde na rede do lab. → 50 XP
2. Listar as portas abertas do `net-target`. → 60 XP
3. Identificar a versão do serviço web exposto e submeter como flag. → 70 XP
4. Encontrar o serviço em porta não padrão e ler seu banner. → 70 XP

**Lab/Missão:** manifesto `recon-nmap.yml` (attacker + `net-target` com SSH, HTTP, FTP anônimo e um serviço em porta alta).

---

### 4.2.2 — Boss: Segurança de Redes
`boss-seguranca-de-redes` · dificuldade 3 · 12 min · 100 XP · **boss**

**Rascunho da explicação:** 7 exercícios: ler regras de firewall e decidir se um pacote passa, interpretar uma saída de nmap, identificar protocolos inseguros e escolher IDS vs. IPS.
