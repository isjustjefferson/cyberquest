export interface SimScenario {
  cwd: string;
  dirs: string[];
  files: Record<string, string>;
  ping?: Record<string, string>;
  dns?: Record<string, string>;
  http?: Record<string, string>;
}

const baseDirs = ['/', '/home', '/home/student', '/etc', '/var', '/var/log', '/tmp'];

export const SCENARIOS: Record<string, SimScenario> = {
  'basico-terminal': {
    cwd: '/home/student',
    dirs: [...baseDirs, '/home/student/lab'],
    files: {
      '/home/student/leia-me.txt':
        'Bem-vindo ao laboratório simulado do CyberQuest.\nLeia os arquivos com cat e explore os diretórios com ls e cd.\nNenhum comando aqui afeta o seu computador de verdade.\n',
      '/home/student/lab/objetivo.txt':
        'Objetivo: encontre a palavra-chave no arquivo /etc/motd.\nUse cat /etc/motd para ler o conteúdo.\n',
      '/etc/motd': 'CyberQuest SimShell\nPalavra-chave: disciplina\nPratique apenas em ambientes autorizados.\n',
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\nstudent:x:1000:1000:Aluno CyberQuest:/home/student:/bin/bash\n',
      '/var/log/auth.log':
        'Nov 1 10:12:01 cq sshd[120]: Accepted password for student from 10.10.0.2 port 41422\nNov 1 10:15:44 cq sshd[133]: Failed password for invalid user admin from 10.10.0.77 port 55210\nNov 1 10:15:49 cq sshd[133]: Failed password for invalid user admin from 10.10.0.77 port 55216\n'
    },
    ping: { '10.10.0.10': '64 bytes from 10.10.0.10: icmp_seq=1 ttl=64 time=0.42 ms' },
    http: { 'http://alvo': 'HTTP/1.1 200 OK\r\nServer: nginx/1.24.0\r\nContent-Type: text/html\r\n\r\n<h1>Servidor de treinamento</h1>' }
  },
  'logs-auth': {
    cwd: '/home/student',
    dirs: [...baseDirs],
    files: {
      '/var/log/auth.log':
        'Nov 1 09:01:12 cq sshd[800]: Accepted password for student from 10.10.0.2 port 40100\nNov 1 09:04:14 cq sshd[812]: Failed password for invalid user oracle from 203.0.113.9 port 33122\nNov 1 09:04:16 cq sshd[812]: Failed password for invalid user oracle from 203.0.113.9 port 33124\nNov 1 09:04:18 cq sshd[812]: Failed password for invalid user oracle from 203.0.113.9 port 33126\nNov 1 09:05:02 cq sshd[815]: Failed password for root from 203.0.113.9 port 33140\nNov 1 09:07:44 cq sshd[820]: Accepted password for student from 10.10.0.2 port 40210\nNov 1 09:09:10 cq sshd[831]: Failed password for invalid user teste from 198.51.100.23 port 22001\n',
      '/home/student/notas.txt':
        'Analise /var/log/auth.log e conte tentativas falhas por IP.\nComando útil: grep "Failed password" /var/log/auth.log\n'
    }
  },
  'web-recon': {
    cwd: '/home/student',
    dirs: [...baseDirs, '/home/student/evidencias'],
    files: {
      '/home/student/notas.txt':
        'Alvo autorizado: alvo-web (10.10.0.20).\nDescubra o arquivo exposto em http://alvo-web/robots.txt e registre o nome.\n',
      '/home/student/evidencias/.keep': ''
    },
    http: {
      'http://alvo-web': 'HTTP/1.1 200 OK\r\nServer: nginx/1.24.0\r\n\r\n<h1>Portal de Treinamento</h1><p>Ambiente controlado.</p>',
      'http://alvo-web/robots.txt':
        'HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nUser-agent: *\nDisallow: /backup/\nDisallow: /admin/\n',
      'http://alvo-web/backup/': 'HTTP/1.1 403 Forbidden\r\nServer: nginx/1.24.0\r\n'
    },
    ping: { '10.10.0.20': '64 bytes from 10.10.0.20: icmp_seq=1 ttl=64 time=0.61 ms' }
  },
  'permissoes': {
    cwd: '/home/student',
    dirs: [...baseDirs, '/home/student/compartilhado'],
    files: {
      '/home/student/relatorio.txt': 'Relatório interno. Contém dados fictícios de treinamento.\n',
      '/home/student/compartilhado/aviso.txt': 'Arquivo de outro usuário do grupo student.\n',
      '/etc/shadow': 'root:*:19000:0:99999:7:::\nstudent:$6$ficticio$hash-de-exemplo:19000:0:99999:7:::\n',
      '/home/student/notas.txt':
        'O arquivo /etc/shadow é sensível. Leia apenas em laboratórios autorizados.\nUse ls -l para inspecionar permissões simuladas.\n'
    }
  },
  'rede-basica': {
    cwd: '/home/student',
    dirs: [...baseDirs],
    files: {
      '/etc/hosts': '127.0.0.1 localhost\n10.10.0.10 alvo-web\n10.10.0.11 banco\n',
      '/home/student/notas.txt':
        'Resolva alvo-web com dig e teste conectividade com ping.\nDepois leia /etc/hosts para confirmar o IP.\n'
    },
    ping: {
      'alvo-web': '64 bytes from 10.10.0.10: icmp_seq=1 ttl=64 time=0.38 ms',
      '10.10.0.10': '64 bytes from 10.10.0.10: icmp_seq=1 ttl=64 time=0.38 ms'
    },
    dns: {
      'alvo-web': 'alvo-web. 60 IN A 10.10.0.10',
      'banco': 'banco. 60 IN A 10.10.0.11'
    }
  }
};

export function resolvePath(cwd: string, target: string): string {
  if (!target) return cwd;
  const raw = target === '~' ? '/home/student' : target.startsWith('~') ? `/home/student${target.slice(1)}` : target;
  const parts = (raw.startsWith('/') ? raw.split('/') : `${cwd}/${raw}`.split('/')).filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') stack.pop();
    else stack.push(part);
  }
  return `/${stack.join('/')}` || '/';
}

export function listDirectory(scenario: SimScenario, path: string): string[] {
  const prefix = path === '/' ? '/' : `${path}/`;
  const entries = new Set<string>();
  for (const dir of scenario.dirs) {
    if (dir !== path && dir.startsWith(prefix)) {
      const rest = dir.slice(prefix.length);
      if (rest && !rest.includes('/')) entries.add(`${rest}/`);
    }
  }
  for (const file of Object.keys(scenario.files)) {
    if (file.startsWith(prefix)) {
      const rest = file.slice(prefix.length);
      if (rest && !rest.includes('/')) entries.add(rest);
    }
  }
  return [...entries].sort();
}
