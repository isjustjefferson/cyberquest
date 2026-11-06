# Trilha 3 — Criptografia e Autenticação
**slug da trilha:** `03-criptografia-e-autenticacao` · **cor:** roxo · **ícone:** 🔑
**Descrição:** Como proteger segredos e provar identidade: hashes, chaves, certificados, senhas, MFA e sessões.

---

## Módulo 3.1 — Criptografia (`01-criptografia`)

### 3.1.1 — Hash, criptografia e encoding: não confunda
`hash-encoding-criptografia` · dificuldade 1 · 12 min · 30 XP

**Objetivo:** Diferenciar três conceitos que iniciantes misturam.

**Tópicos-chave:** encoding (Base64, URL, hex) não é segurança; hash é via de mão única; criptografia é reversível com chave; exemplos (SHA-256, AES); colisões; uso de cada um.

**Rascunho da explicação:** **Encoding** só muda a representação (Base64 de "oi" é `b2k=`), qualquer um reverte, então **não protege nada**. **Hash** transforma um dado em uma "impressão digital" de tamanho fixo e não tem volta: serve para verificar integridade e guardar senhas (com cuidados). **Criptografia** embaralha dados de forma reversível para quem tem a chave. Se alguém "protege" uma senha com Base64, não protegeu: só disfarçou.

**Exercícios sugeridos:**
1. (match) Conceito ↔ característica (reversível sem chave / via de mão única / reversível com chave).
2. (true_false) "Base64 é uma forma de criptografia." → **Falso**.
3. (fill_command) "Calcular SHA-256 de um arquivo: `___ arquivo.txt`" → **sha256sum**.

---

### 3.1.2 — Criptografia simétrica
`criptografia-simetrica` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Entender cifras com a mesma chave para cifrar e decifrar.

**Tópicos-chave:** AES (128/256); modos (ECB inseguro, CBC, GCM); IV/nonce; desafio da distribuição de chaves; cifras de fluxo (ChaCha20).

**Rascunho da explicação:** Na criptografia simétrica, a mesma chave tranca e destranca, como uma chave de casa. É rápida e ideal para volumes grandes de dados. O difícil é combinar a chave com o outro lado sem que alguém a intercepte. O **modo** importa: o ECB repete padrões (a famosa imagem do pinguim ainda visível após "cifrar"), enquanto modos como GCM também garantem integridade. Nunca reutilize o nonce com a mesma chave.

**Exercícios sugeridos:**
1. (single_choice) "Qual é o maior desafio da simétrica?" → **Compartilhar a chave com segurança**.
2. (single_choice) "Modo que não deve ser usado por vazar padrões?" → **ECB**.
3. (true_false) "AES-256 é um algoritmo assimétrico." → **Falso**.

---

### 3.1.3 — Criptografia assimétrica
`criptografia-assimetrica` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Entender par de chaves pública/privada e troca de chaves.

**Tópicos-chave:** RSA, ECC; chave pública cifra, privada decifra; Diffie-Hellman; criptografia híbrida; tamanhos de chave; computação quântica (visão geral).

**Rascunho da explicação:** Aqui cada pessoa tem duas chaves: a **pública** (pode divulgar) e a **privada** (guarda a sete chaves). Quem quer enviar algo secreto cifra com a pública do destinatário; só a privada abre. É mais lenta, então na prática se usa **criptografia híbrida**: a assimétrica troca uma chave simétrica de sessão, e a simétrica protege o resto da conversa (é assim que o TLS funciona).

**Exercícios sugeridos:**
1. (single_choice) "Para enviar uma mensagem secreta a Ana, uso…" → **A chave pública de Ana**.
2. (true_false) "A chave privada pode ser compartilhada sem problemas." → **Falso**.
3. (order) Etapas de uma troca híbrida simplificada.

---

### 3.1.4 — Assinaturas digitais
`assinaturas-digitais` · dificuldade 3 · 12 min · 50 XP

**Objetivo:** Entender como garantir autoria e integridade.

**Tópicos-chave:** hash + chave privada; verificação com chave pública; não repúdio; assinatura de código e commits; diferença entre assinar e cifrar.

**Rascunho da explicação:** Para assinar, você calcula o hash do documento e o "assina" com sua **chave privada**. Qualquer um verifica com sua **chave pública**: se bater, o documento não foi alterado e foi você quem assinou. É o inverso do fluxo de cifrar. Usado em atualizações de software, certificados e commits assinados.

**Exercícios sugeridos:**
1. (single_choice) "Qual chave é usada para assinar?" → **A privada do signatário**.
2. (true_false) "Assinar um documento o deixa ilegível." → **Falso**.

---

### 3.1.5 — TLS, HTTPS e PKI
`tls-e-pki` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Entender o que acontece ao abrir um site HTTPS e o papel das autoridades certificadoras.

**Tópicos-chave:** handshake TLS (visão geral); certificados X.509; cadeia de confiança; CA raiz e intermediária; validade e revogação; erros de certificado; HSTS.

**Rascunho da explicação:** No handshake, o servidor mostra seu **certificado**, assinado por uma Autoridade Certificadora em que seu navegador confia. O cliente verifica a cadeia, o domínio e a validade; depois negociam uma chave de sessão. Ignorar avisos de certificado é abrir a porta ao MITM. O **HSTS** instrui o navegador a só usar HTTPS naquele site.

**Exercícios sugeridos:**
1. (single_choice) "O que valida o certificado de um site?" → **Uma cadeia de confiança até uma CA raiz**.
2. (true_false) "Clicar em 'continuar mesmo assim' num erro de certificado é seguro em redes públicas." → **Falso**.
3. (fill_command) "Ver o certificado de um servidor: `openssl s_client -connect exemplo.com:___`" → **443**.

---

### 3.1.6 — Lab: Hashes, encoding e hashes fracos
`lab-hashes-e-encoding` · dificuldade 2 · 25 min · 200 XP · **lab:** `hashes-e-encoding`

**Objetivo:** Decodificar encodings, calcular hashes e quebrar hashes fracos **fictícios** do ambiente.

**Rascunho da explicação:** O alvo contém mensagens em Base64/hex, arquivos com hashes e uma lista fictícia de senhas fracas. Você aprende na prática que Base64 não protege e que hashes sem *salt* de senhas comuns caem rápido com uma wordlist. Lição: usar hashes lentos e com salt (argon2/bcrypt).

**Exercícios sugeridos (objetivos):**
1. Decodificar a mensagem em Base64 do arquivo `msg.txt`. → 40 XP
2. Identificar o tipo de hash de `hash1.txt`. → 50 XP
3. Recuperar a senha fraca fictícia a partir de um hash MD5 usando a wordlist do lab. → 110 XP

---

## Módulo 3.2 — Autenticação e senhas (`02-autenticacao-e-senhas`)

### 3.2.1 — Armazenamento seguro de senhas
`armazenamento-seguro-de-senhas` · dificuldade 3 · 12 min · 50 XP

**Objetivo:** Saber como um sistema deve guardar senhas.

**Tópicos-chave:** nunca texto puro; hashes rápidos (MD5/SHA-1) são inadequados; salt; pepper; argon2id, bcrypt, scrypt; custo ajustável; rainbow tables.

**Rascunho da explicação:** Se o banco vaza, as senhas não devem vazar junto. Hash simples e rápido (MD5, SHA-256 direto) é fácil de atacar com milhões de tentativas por segundo. Use algoritmos **lentos de propósito** (argon2id, bcrypt) com **salt** único por usuário, que torna tabelas pré-calculadas inúteis e impede identificar senhas iguais.

**Exercícios sugeridos:**
1. (single_choice) "Qual é o mais adequado para senhas?" → **argon2id**.
2. (true_false) "SHA-256 simples, sem salt, é adequado para senhas." → **Falso**.
3. (code_review) Achar o erro em código que guarda `md5(senha)`.

---

### 3.2.2 — Políticas de senha e gerenciadores
`politicas-de-senha-e-gerenciadores` · dificuldade 1 · 8 min · 30 XP

**Objetivo:** Boas práticas para usuários e administradores.

**Tópicos-chave:** comprimento > complexidade; frases-senha; senha única por serviço; gerenciador de senhas; verificação de vazamentos; evitar rotação forçada sem motivo.

**Rascunho da explicação:** Uma frase longa e única ("cafe-azul-trem-12-lua") é mais forte e mais fácil de lembrar que `P@ssw0rd!`. O maior risco real é **reutilizar** a mesma senha, e o remédio é um gerenciador de senhas. Diretrizes modernas recomendam checar senhas contra listas de vazamentos e não forçar trocas periódicas sem evidência de comprometimento.

**Exercícios sugeridos:**
1. (single_choice) "O que mais fortalece uma senha?" → **Comprimento e unicidade**.
2. (true_false) "Reutilizar senhas é aceitável se ela for forte." → **Falso**.

---

### 3.2.3 — MFA e TOTP
`mfa-e-totp` · dificuldade 2 · 12 min · 40 XP

**Objetivo:** Entender segundo fator, TOTP e chaves de segurança.

**Tópicos-chave:** SMS vs. app autenticador vs. chave física (FIDO2/passkeys); TOTP (segredo compartilhado + tempo); fadiga de MFA; códigos de recuperação.

**Rascunho da explicação:** O MFA exige mais de um tipo de prova. O **TOTP** gera um código de 6 dígitos a partir de um segredo e do horário, válido por ~30 s. **Passkeys/FIDO2** resistem a phishing porque a credencial é vinculada ao domínio real. SMS é melhor que nada, mas é o mais fraco (troca de chip, interceptação).

**Exercícios sugeridos:**
1. (order) Ordenar métodos do menos ao mais resistente a phishing.
2. (single_choice) "O TOTP depende de…" → **Segredo compartilhado e horário**.
3. (true_false) "MFA por SMS é o método mais forte." → **Falso**.

---

### 3.2.4 — Sessões, cookies e JWT
`sessoes-cookies-e-jwt` · dificuldade 3 · 15 min · 50 XP

**Objetivo:** Entender como aplicações mantêm o usuário logado e os erros comuns.

**Tópicos-chave:** sessão no servidor vs. token; cookies seguros; JWT (header.payload.assinatura); `alg=none` e segredos fracos (conceito); expiração e revogação; onde guardar tokens.

**Rascunho da explicação:** HTTP não tem memória; a sessão resolve isso. Cookie de sessão com `HttpOnly`, `Secure` e `SameSite` é uma boa base. Um **JWT** carrega dados assinados; **não é criptografado** (o payload é só Base64), então não coloque segredos nele. Erros clássicos: segredo de assinatura fraco, aceitar algoritmo `none`, tokens que nunca expiram e guardá-los em locais acessíveis a scripts.

**Exercícios sugeridos:**
1. (true_false) "O conteúdo de um JWT é criptografado por padrão." → **Falso**.
2. (multi_choice) "Boas práticas de sessão?" → cookie HttpOnly, expiração curta, regenerar sessão no login.
3. (code_review) Achar problema em código que aceita qualquer algoritmo ao verificar JWT.

---

### 3.2.5 — SSO, OAuth2 e OIDC
`sso-oauth-oidc` · dificuldade 3 · 12 min · 50 XP

**Objetivo:** Visão geral de login federado.

**Tópicos-chave:** SSO; OAuth2 (autorização delegada) vs. OIDC (identidade); papéis (usuário, cliente, servidor de autorização); escopos; fluxo authorization code (visão geral); SAML (menção).

**Rascunho da explicação:** Quando você usa "Entrar com Google", o site não vê sua senha: o provedor autentica e entrega ao site um token. **OAuth2** trata de *autorização* (o que o app pode acessar); **OIDC** adiciona *identidade* (quem você é). Erros típicos: validar mal o `redirect_uri`, não usar `state` e escopos excessivos.

**Exercícios sugeridos:**
1. (match) Sigla ↔ função (OAuth2, OIDC, SSO).
2. (single_choice) "O que OIDC acrescenta ao OAuth2?" → **Camada de identidade**.

---

### 3.2.6 — Boss: Criptografia e Autenticação
`boss-cripto-e-autenticacao` · dificuldade 3 · 12 min · 100 XP · **boss**

**Rascunho da explicação:** 8 exercícios cronometrados: identificar hash/encoding/cripto, escolher algoritmo para senhas, ordenar handshake TLS, avaliar uma política de senhas e achar falhas em uso de JWT.
