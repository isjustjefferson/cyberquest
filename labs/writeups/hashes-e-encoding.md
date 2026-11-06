# Writeup — Hashes, encoding e hashes fracos

## Objetivo

Diferenciar encoding de hash e reconhecer o uso inadequado de MD5 para senhas.

## Passos

1. Leia `http://target:8080/encoding.txt`.
2. Decodifique Base64: `echo 'VALOR' | base64 -d`.
3. Decodifique hexadecimal: `echo 'VALOR' | xxd -r -p`.
4. Aplique ROT13: `echo 'VALOR' | tr 'A-Za-z' 'N-ZA-Mn-za-m'`.
5. Leia `/hashes.txt` e identifique o MD5 fraco.

## Correção e defesa

Encoding não protege dados. Para senhas, use Argon2id, bcrypt ou scrypt com salt único e custo adequado. MD5 e SHA-1 não são adequados para armazenamento de senhas.
