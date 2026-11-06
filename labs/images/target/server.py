#!/usr/bin/env python3
"""Servidor dos alvos dos laboratórios CyberQuest.

Cada container recebe CQ_LAB e as flags dinâmicas CQ_FLAG_<OBJETIVO>.
O conteúdo é gerado em memória; nenhum dado de usuário é armazenado.
"""
from __future__ import annotations

import base64
import os
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

LAB = os.environ.get("CQ_LAB", "ola-terminal")
FLAGS = {
    key[len("CQ_FLAG_"):].lower().replace("_", "-"): value
    for key, value in os.environ.items()
    if key.startswith("CQ_FLAG_")
}


def flag(objective_id: str) -> str:
    return FLAGS.get(objective_id, "CQ{flag-indisponivel}")


def hexed(value: str) -> str:
    return value.encode().hex()


def b64(value: str) -> str:
    return base64.b64encode(value.encode()).decode()


def rot13(value: str) -> str:
    return "".join(
        chr((ord(char) - 65 + 13) % 26 + 65)
        if "A" <= char <= "Z"
        else chr((ord(char) - 97 + 13) % 26 + 97)
        if "a" <= char <= "z"
        else char
        for char in value
    )


COMMENTS: list[str] = []

INDEX = {
    "ola-terminal": """CyberQuest - Terminal de boas-vindas
Alvo: http://target:8080/
Tarefas:
- leia /flag.txt
- encontre o arquivo oculto em /home/ctf/.flag
- descubra o usuário do serviço em /whoami
Dica: use curl para conversar com o alvo.
""",
    "linux-basics": """CyberQuest - Servidor Linux simulado
Arquivos publicados: /relatorio.txt, /proc/net/tcp, /logs/access.log
Há um arquivo de configuração escondido. Use criatividade e curl.
""",
    "explorando-a-rede": """CyberQuest - Rede interna
Serviços: HTTP em 8080 e um serviço TCP em 2222.
Investigue /dns.txt, /headers e conecte no banner TCP.
""",
    "hashes-e-encoding": """CyberQuest - Codificação e hashes
Leia /encoding.txt e /hashes.txt. Decodifique os valores para obter as flags.
""",
    "recon-nmap": """CyberQuest - Reconhecimento
Faça um scan em target e descubra os serviços abertos.
Depois inspecione /flag-web, /headers e o banner na porta 2222.
""",
    "web-sqli-login": """CyberQuest - Painel da Loja Byte
Formulário de login em /login. O código do servidor concatena entrada em SQL.
Usuários em /users?id=1. Painel em /admin.
""",
    "web-xss-idor": """CyberQuest - Portal de Perfis
Busca em /search?q=... e comentários em /comments.
Perfis em /profile?id=1. Nem toda autorização é verificada.
""",
    "padaria-byte": """CyberQuest - Padaria Byte
Site institucional. Comece por /robots.txt.
O backup e o painel administrativo guardam segredos.
""",
    "analise-de-logs": """CyberQuest - Servidor comprometido
Logs disponíveis: /logs/auth.log e /logs/access.log.
Encontre o IP suspeito, a exploração web e a persistência.
""",
    "auditar-dockerfile": """CyberQuest - Auditoria de containers
Leia /Dockerfile.insecure e /docker-compose.insecure.yml.
Aponte configurações perigosas e encontre o segredo exposto.
""",
}

AUTH_LOG = """Jan 10 03:12:01 srv sshd[4101]: Failed password for admin from 203.0.113.66 port 51234 ssh2
Jan 10 03:12:04 srv sshd[4101]: Failed password for admin from 203.0.113.66 port 51236 ssh2
Jan 10 03:12:09 srv sshd[4101]: Failed password for admin from 203.0.113.66 port 51238 ssh2
Jan 10 03:12:15 srv sshd[4101]: Failed password for admin from 203.0.113.66 port 51240 ssh2
Jan 10 03:12:21 srv sshd[4101]: Accepted password for admin from 203.0.113.66 port 51244 ssh2
Jan 10 03:13:02 srv useradd[4200]: new user: name=svcbackup, UID=1002
Jan 10 03:13:05 srv usermod[4201]: add 'svcbackup' to group 'sudo'
Jan 10 03:13:09 srv CRON[4210]: (svcbackup) CMD (/tmp/.cache/update --silent)
"""

ACCESS_LOG = """10.0.0.7 - - [10/Jan/2026:03:13:40] "GET /produtos HTTP/1.1" 200 812
203.0.113.66 - - [10/Jan/2026:03:14:02] "GET /login?user=admin%27%20OR%20%271%27%3D%271 HTTP/1.1" 302 0
203.0.113.66 - - [10/Jan/2026:03:14:08] "GET /admin HTTP/1.1" 200 1204
10.0.0.7 - - [10/Jan/2026:03:14:20] "GET /produtos/12 HTTP/1.1" 200 640
"""


def lab_body(path: str, query: dict[str, list[str]], headers) -> tuple[str, int, dict[str, str]]:
    extra: dict[str, str] = {}

    if path == "/health":
        return "ok", 200, extra
    if path == "/" or path == "":
        return INDEX.get(LAB, "CyberQuest lab\n"), 200, extra

    if LAB == "ola-terminal":
        if path == "/flag.txt":
            return f"Parabéns! {flag('find-file')}\n", 200, extra
        if path == "/home/ctf/.flag":
            return f"Arquivo oculto lido. {flag('read-hidden')}\n", 200, extra
        if path == "/whoami":
            return f"usuario=ctf\n{flag('identify-user')}\n", 200, extra

    if LAB == "linux-basics":
        if path == "/.config_secreta":
            return f"DB_PASSWORD=nao-use-em-producao\n{flag('find-secret')}\n", 200, extra
        if path == "/relatorio.txt":
            return f"Relatorio trimestral\nDono: ctf\nGrupo: financeiro\n{flag('owner-report')}\n", 200, extra
        if path == "/proc/net/tcp":
            return "sl local_address rem_address st\n 0: 00000000:1F90 00000000:0000 0A\n" + flag("find-port") + "\n", 200, extra
        if path == "/logs/access.log":
            lines = [f"10.0.0.7 - GET /{i} 200" for i in range(1, 8)]
            lines.insert(3, f"10.0.0.7 - GET /admin {flag('count-log')}")
            lines.append("10.0.0.9 - GET / 200")
            return "\n".join(lines) + "\n", 200, extra

    if LAB == "explorando-a-rede":
        if path == "/dns.txt":
            return f"intranet.lab -> 172.18.0.2\n{flag('resolve-host')}\n", 200, extra
        if path == "/headers":
            extra["X-CyberQuest"] = flag("custom-header")
            return "Cabecalho customizado enviado. Use curl -i.\n", 200, extra
        if path == "/banner":
            return f"Banner HTTP: {flag('tcp-banner')}\n", 200, extra

    if LAB == "hashes-e-encoding":
        if path == "/encoding.txt":
            return (
                f"base64: {b64(flag('decode-base64'))}\n"
                f"hex: {hexed(flag('decode-hex'))}\n"
                f"rot13: {rot13(flag('decode-rot13'))}\n"
            ), 200, extra
        if path == "/hashes.txt":
            return (
                "usuario: admin\nhash: 5f4dcc3b5aa765d61d8327deb882cf99 (MD5 de uma senha fraca)\n"
                f"observacao: {flag('weak-hash')}\n"
            ), 200, extra

    if LAB == "recon-nmap":
        if path == "/flag-web":
            return f"Servico web encontrado. {flag('find-web')}\n", 200, extra
        if path == "/headers":
            extra["X-Recon"] = flag("find-header")
            return "Inspecione os cabecalhos da resposta.\n", 200, extra
        if path == "/banner":
            return f"Banner: {flag('find-banner')}\n", 200, extra

    if LAB == "web-sqli-login":
        if path == "/login":
            return (
                "<html><body><h1>Login da Loja Byte</h1>"
                "<form method='post' action='/login'>"
                "Usuario: <input name='username'> Senha: <input name='password'>"
                "<button>Entrar</button></form>"
                "<p>Os campos sao concatenados na consulta SQL.</p></body></html>",
                200,
                extra,
            )
        if path == "/admin":
            if (query.get("admin") or [""])[0] == "1" or headers.get("X-Admin") == "1":
                return (
                    "<html><body><h1>Painel administrativo</h1>"
                    f"<p>{flag('admin-panel')}</p></body></html>",
                    200,
                    extra,
                )
            return "Acesso negado. O painel exige uma sessao administrativa.\n", 401, extra
        if path == "/users":
            user_id = (query.get("id") or ["1"])[0]
            if user_id == "2":
                return f"<html><body><h1>Usuario 2</h1><p>{flag('idor-user')}</p></body></html>", 200, extra
            return "<html><body><h1>Usuario 1</h1><p>Perfil publico.</p></body></html>", 200, extra

    if LAB == "web-xss-idor":
        if path == "/search":
            term = (query.get("q") or [""])[0]
            proof = flag("reflected-xss") if "<script" in term.lower() else "Nenhum script detectado."
            return (
                f"<html><body><h1>Resultados</h1><p>Voce buscou: {term}</p>"
                f"<p>{proof}</p></body></html>",
                200,
                extra,
            )
        if path == "/comments":
            body = "".join(f"<li>{item}</li>" for item in COMMENTS) or "<li>Sem comentarios.</li>"
            proof = flag("stored-xss") if any("<script" in item.lower() for item in COMMENTS) else ""
            return f"<html><body><h1>Comentarios</h1><ul>{body}</ul><p>{proof}</p></body></html>", 200, extra
        if path == "/profile":
            user_id = (query.get("id") or ["1"])[0]
            if user_id == "2":
                return f"<html><body><h1>Perfil privado</h1><p>{flag('idor-profile')}</p></body></html>", 200, extra
            return "<html><body><h1>Perfil publico</h1><p>Nada sensivel por aqui.</p></body></html>", 200, extra

    if LAB == "padaria-byte":
        if path == "/robots.txt":
            return "User-agent: *\nDisallow: /backup/\n# pista: " + flag("recon") + "\n", 200, extra
        if path == "/backup/config.txt":
            return (
                "APP_USER=padaria\nAPP_PASS=pao2024\n"
                f"backup_id=2026-01\n{flag('backup-creds')}\n"
            ), 200, extra
        if path == "/admin":
            header = headers.get("Authorization", "")
            if header.startswith("Basic "):
                try:
                    decoded = base64.b64decode(header[6:]).decode()
                except Exception:
                    decoded = ""
                if decoded == "padaria:pao2024":
                    return f"<html><body><h1>Admin</h1><p>{flag('admin-access')}</p></body></html>", 200, extra
            return "Acesso negado. Use autenticacao basica.\n", 401, extra
        if path.startswith("/api/orders/"):
            order_id = path.rsplit("/", 1)[-1]
            if order_id == "2":
                return f'{{"order":2,"customer":"outro cliente","note":"{flag("idor-orders")}"}}', 200, extra
            return '{"order":1,"customer":"voce","items":["pao"]}', 200, extra

    if LAB == "analise-de-logs":
        if path == "/logs/auth.log":
            lines = AUTH_LOG.strip().splitlines()
            lines.insert(4, f"Jan 10 03:12:21 srv sshd[4101]: session opened for admin {flag('suspicious-ip')}")
            lines.append(f"Jan 10 03:13:09 srv CRON[4210]: persistence indicator {flag('persistence')}")
            return "\n".join(lines) + "\n", 200, extra
        if path == "/logs/access.log":
            lines = ACCESS_LOG.strip().splitlines()
            lines.insert(1, f"203.0.113.66 - - [10/Jan/2026:03:14:02] \"GET /login SQLi {flag('web-exploit')}\" 302 0")
            return "\n".join(lines) + "\n", 200, extra

    if LAB == "auditar-dockerfile":
        if path == "/Dockerfile.insecure":
            return (
                "FROM node:18\n"
                "ENV NODE_ENV=production\n"
                "COPY . /app\n"
                "WORKDIR /app\n"
                f"# sem USER: {flag('root-user')}\n"
                "CMD [\"node\", \"server.js\"]\n"
            ), 200, extra
        if path == "/docker-compose.insecure.yml":
            return (
                "services:\n  api:\n    build: .\n    privileged: true\n"
                "    environment:\n      DB_PASSWORD=super-secreto\n"
                f"    # {flag('privileged')}\n"
                f"    # {flag('hardcoded-secret')}\n"
            ), 200, extra

    return "404 - recurso nao encontrado\n", 404, extra


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def _send(self, body: str, status: int = 200, extra: dict[str, str] | None = None) -> None:
        payload = body.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        for key, value in (extra or {}).items():
            self.send_header(key, value)
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        body, status, extra = lab_body(parsed.path, parse_qs(parsed.query), self.headers)
        self._send(body, status, extra)

    def do_POST(self) -> None:  # noqa: N802
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length).decode("utf-8", errors="replace")
        form = parse_qs(raw)
        parsed = urlparse(self.path)

        if LAB == "web-sqli-login" and parsed.path == "/login":
            username = (form.get("username") or [""])[0]
            lowered = username.lower()
            if ("'" in username and "or" in lowered) or "1=1" in lowered.replace(" ", ""):
                self._send(
                    "<html><body><h1>Login efetuado como admin</h1>"
                    f"<p>{flag('bypass-login')}</p>"
                    "<p><a href='/admin?admin=1'>Abrir painel</a></p></body></html>"
                )
            else:
                self._send("<html><body><p>Credenciais invalidas.</p></body></html>", 401)
            return

        if LAB == "web-xss-idor" and parsed.path == "/comment":
            comment = (form.get("comment") or [""])[0]
            if comment:
                COMMENTS.append(comment)
            self._send("<html><body><p>Comentario salvo. Veja /comments.</p></body></html>", 201)
            return

        self._send("404 - recurso nao encontrado\n", 404)

    def log_message(self, format: str, *args) -> None:  # noqa: A003
        return


class BannerHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def do_GET(self) -> None:  # noqa: N802
        name = "CyberQuest Lab Service"
        detail = ""
        if LAB == "explorando-a-rede":
            detail = flag("tcp-banner")
        elif LAB == "recon-nmap":
            detail = flag("find-banner")
        body = f"{name}\nporta=2222\n{detail}\n".encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args) -> None:  # noqa: A003
        return


def serve(port: int, handler) -> None:
    server = ThreadingHTTPServer(("0.0.0.0", port), handler)
    server.daemon_threads = True
    server.serve_forever()


if __name__ == "__main__":
    threading.Thread(target=serve, args=(2222, BannerHandler), daemon=True).start()
    serve(8080, Handler)
