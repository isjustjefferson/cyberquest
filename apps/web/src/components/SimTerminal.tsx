import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { CornerDownLeft, Terminal as TerminalIcon } from 'lucide-react';
import { SCENARIOS, listDirectory, resolvePath, type SimScenario } from '../lib/simshell/scenarios';

export interface SimState {
  history: string[];
  files: string[];
  cwd: string;
}

interface Line {
  kind: 'command' | 'output' | 'error' | 'system';
  text: string;
}

function getScenario(id: string): SimScenario {
  return (
    SCENARIOS[id] ?? {
      cwd: '/home/student',
      dirs: ['/', '/home', '/home/student'],
      files: { '/home/student/leia-me.txt': 'Cenário não encontrado. Use help para ver os comandos disponíveis.\n' }
    }
  );
}

export function SimTerminal({
  scenario: scenarioId,
  goal,
  allowedCommands,
  onChange
}: {
  scenario: string;
  goal: string;
  allowedCommands?: string[];
  onChange: (state: SimState) => void;
}) {
  const initial = useRef(getScenario(scenarioId));
  const [cwd, setCwd] = useState(initial.current.cwd);
  const [files, setFiles] = useState(initial.current.files);
  const [history, setHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<Line[]>([
    { kind: 'system', text: 'SimShell do CyberQuest — ambiente fictício e isolado.' },
    { kind: 'system', text: 'Digite help para ver os comandos. Nada aqui afeta seu computador.' },
    { kind: 'system', text: `Objetivo: ${goal}` }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChange({ history, files: Object.keys(files), cwd });
  }, [history, files, cwd, onChange]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  function scenarioState(): SimScenario {
    return { ...initial.current, cwd, files };
  }

  function run(raw: string): void {
    const command = raw.trim();
    if (!command) return;
    setHistory((prev) => [...prev, command]);
    setCommandHistory((prev) => [command, ...prev]);
    setHistoryIndex(-1);
    setLines((prev) => [...prev, { kind: 'command', text: `student@cq:${cwd}$ ${command}` }]);
    const output: Line[] = [];
    const scenario = scenarioState();
    const tokens = command.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)?.map((token) => token.replace(/^['"]|['"]$/g, '')) ?? [];
    const [name, ...args] = tokens;
    if (!name) return;

    const push = (text: string, kind: Line['kind'] = 'output') => output.push({ kind, text });
    switch (name) {
      case 'help':
        push(
          'Comandos: pwd, ls [-l] [dir], cd <dir>, cat <arquivo>, echo <texto> [> arquivo], find [dir] [-name padrao], grep <padrao> <arquivo>, head [-n N] <arquivo>, tail [-n N] <arquivo>, wc -l <arquivo>, whoami, id, chmod <modo> <arquivo>, ping <host>, dig <host>, nslookup <host>, curl <url>, clear.'
        );
        break;
      case 'pwd':
        push(cwd);
        break;
      case 'whoami':
        push('student');
        break;
      case 'id':
        push('uid=1000(student) gid=1000(student) grupos=1000(student),27(sudo_simulado)');
        break;
      case 'ls': {
        const flag = args.find((arg) => arg.startsWith('-')) ?? '';
        const target = args.find((arg) => !arg.startsWith('-')) ?? '.';
        const path = resolvePath(cwd, target);
        if (path in scenario.files) {
          if (flag.includes('l')) push(scenario.files[path] ? '-rw-r--r-- 1 student student 1024 nov  1 10:00 ' + target : target);
          else push(target);
          break;
        }
        const exists = scenario.dirs.includes(path) || scenario.dirs.some((dir) => dir.startsWith(`${path}/`));
        if (!exists) {
          push(`ls: não foi possível acessar '${target}': Arquivo ou diretório inexistente`, 'error');
          break;
        }
        const entries = listDirectory(scenario, path);
        if (flag.includes('a')) entries.unshift('../', './');
        if (flag.includes('l')) {
          entries.forEach((entry) => {
            const full = `${path === '/' ? '' : path}/${entry.replace(/\/$/, '')}`;
            const isDir = entry.endsWith('/');
            const content = scenario.files[full] ?? '';
            push(`${isDir ? 'drwxr-xr-x' : '-rw-r--r--'} 1 student student ${String(content.length).padStart(6)} nov  1 10:00 ${entry}`);
          });
        } else {
          push(entries.join('  '));
        }
        break;
      }
      case 'cd': {
        const target = resolvePath(cwd, args[0] ?? '/home/student');
        if (target === '/' || scenario.dirs.includes(target) || scenario.dirs.some((dir) => dir.startsWith(`${target}/`))) {
          setCwd(target);
        } else {
          push(`cd: ${args[0] ?? ''}: Arquivo ou diretório inexistente`, 'error');
        }
        break;
      }
      case 'cat': {
        if (args.length === 0) {
          push('cat: informe ao menos um arquivo', 'error');
          break;
        }
        for (const arg of args) {
          const path = resolvePath(cwd, arg);
          if (path in scenario.files) push(scenario.files[path]);
          else push(`cat: ${arg}: Arquivo ou diretório inexistente`, 'error');
        }
        break;
      }
      case 'echo': {
        const redirect = args.indexOf('>');
        if (redirect !== -1) {
          const content = args.slice(0, redirect).join(' ');
          const target = resolvePath(cwd, args[redirect + 1] ?? 'saida.txt');
          setFiles((prev) => ({ ...prev, [target]: `${content}\n` }));
          push(`Conteúdo gravado em ${target}`);
        } else {
          push(args.join(' '));
        }
        break;
      }
      case 'find': {
        const start = args[0] && !args[0].startsWith('-') ? resolvePath(cwd, args[0]) : cwd;
        const nameIndex = args.findIndex((arg) => arg === '-name');
        const pattern = nameIndex >= 0 ? args[nameIndex + 1] : undefined;
        const allDirs = scenario.dirs.filter((dir) => dir === start || dir.startsWith(`${start}/`));
        const allFiles = Object.keys(files).filter((file) => file.startsWith(`${start}/`) || start === '/');
        const matches = [...allDirs, ...allFiles].filter((item) => {
          if (!pattern) return true;
          const base = item.split('/').pop() ?? '';
          return new RegExp(`^${pattern.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`).test(base);
        });
        push(matches.length ? matches.join('\n') : 'Nenhum resultado encontrado.');
        break;
      }
      case 'grep': {
        const [pattern, ...fileArgs] = args;
        if (!pattern || fileArgs.length === 0) {
          push('grep: uso: grep <padrao> <arquivo>', 'error');
          break;
        }
        for (const fileArg of fileArgs) {
          const path = resolvePath(cwd, fileArg);
          const content = files[path];
          if (content === undefined) {
            push(`grep: ${fileArg}: Arquivo ou diretório inexistente`, 'error');
            continue;
          }
          const matches = content
            .split('\n')
            .filter((line) => line.toLowerCase().includes(pattern.toLowerCase()));
          matches.forEach((line) => push(`${fileArg}:${line}`));
        }
        break;
      }
      case 'head':
      case 'tail': {
        const nIndex = args.indexOf('-n');
        const count = nIndex >= 0 ? Number(args[nIndex + 1]) || 10 : 10;
        const fileArg = args.find((arg, index) => index !== nIndex && index !== nIndex + 1 && !arg.startsWith('-'));
        const path = resolvePath(cwd, fileArg ?? '');
        const content = files[path];
        if (content === undefined) {
          push(`${name}: ${fileArg ?? ''}: Arquivo ou diretório inexistente`, 'error');
          break;
        }
        const all = content.split('\n');
        push((name === 'head' ? all.slice(0, count) : all.slice(-count)).join('\n'));
        break;
      }
      case 'wc': {
        const fileArg = args.find((arg) => !arg.startsWith('-'));
        const path = resolvePath(cwd, fileArg ?? '');
        const content = files[path];
        if (content === undefined) {
          push(`wc: ${fileArg ?? ''}: Arquivo ou diretório inexistente`, 'error');
          break;
        }
        push(`${content.split('\n').length - 1} ${content.split(/\s+/).filter(Boolean).length} ${content.length} ${fileArg}`);
        break;
      }
      case 'chmod':
        if (args.length < 2) push('chmod: uso: chmod <modo> <arquivo>', 'error');
        else push(`Permissão ${args[0]} aplicada (simulação) em ${args[1]}.`);
        break;
      case 'ping': {
        const host = args[0];
        if (!host) {
          push('ping: informe um host', 'error');
          break;
        }
        const response = scenario.ping?.[host];
        push(`PING ${host} (10.10.0.10) 56(84) bytes of data.`);
        push(response ?? `Request timeout for icmp_seq 1`);
        push(`--- ${host} ping statistics ---`);
        push('1 packets transmitted, 1 received, 0% packet loss, time 0ms');
        break;
      }
      case 'dig':
      case 'nslookup': {
        const host = args[args.length - 1];
        if (!host) {
          push(`${name}: informe um host`, 'error');
          break;
        }
        const answer = scenario.dns?.[host];
        if (name === 'dig') {
          push(`; <<>> DiG 9.18 <<>> ${host}`);
          push(';; ANSWER SECTION:');
          push(answer ?? `${host}. 60 IN A 127.0.0.1`);
        } else {
          push(`Server: 10.10.0.1`);
          push(`Name: ${host}`);
          push(answer?.split(' ').slice(-1)[0] ?? 'Address: 127.0.0.1');
        }
        break;
      }
      case 'curl': {
        const url = args.find((arg) => arg.startsWith('http')) ?? args[0];
        if (!url) {
          push('curl: informe uma URL', 'error');
          break;
        }
        push(scenario.http?.[url] ?? 'HTTP/1.1 200 OK\r\nServer: simshell\r\n\r\nOK');
        break;
      }
      case 'clear':
        setLines([]);
        return;
      case 'sudo':
        push('student não está no arquivo sudoers. Este incidente será registrado.', 'error');
        break;
      case 'rm':
      case 'mv':
      case 'dd':
      case 'mkfs':
        push(`${name}: comando bloqueado no simulador por segurança.`, 'error');
        break;
      default:
        push(`${name}: comando não encontrado no simulador. Digite help.`, 'error');
    }
    if (output.length > 0) setLines((prev) => [...prev, ...output]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      run(input);
      setInput('');
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const nextIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex] ?? '');
      }
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setInput(nextIndex >= 0 ? commandHistory[nextIndex] ?? '' : '');
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0a0f15]">
      <div className="flex items-center justify-between border-b border-border bg-panel/70 px-3 py-2 text-xs">
        <span className="flex items-center gap-2 text-muted">
          <TerminalIcon size={13} className="text-accent" /> SimShell · {scenarioId}
        </span>
        <span className="text-[10px] text-muted">isolado · fictício</span>
      </div>
      <div
        ref={scrollRef}
        className="h-64 cursor-text overflow-y-auto p-3 font-mono text-xs leading-5"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, index) => (
          <pre
            key={`${index}-${line.text.slice(0, 12)}`}
            className={`whitespace-pre-wrap break-words ${
              line.kind === 'command'
                ? 'text-accent'
                : line.kind === 'error'
                  ? 'text-danger'
                  : line.kind === 'system'
                    ? 'text-cyber'
                    : 'text-text/85'
            }`}
          >
            {line.text || ' '}
          </pre>
        ))}
        <div className="flex items-center gap-1 text-accent">
          <span className="shrink-0">student@cq:{cwd}$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            className="min-w-0 flex-1 border-none bg-transparent p-0 font-mono text-xs text-text caret-accent outline-none"
            spellCheck={false}
            autoComplete="off"
            aria-label="Comando do terminal simulado"
          />
          <CornerDownLeft size={12} className="shrink-0 text-muted" />
        </div>
      </div>
      {allowedCommands && allowedCommands.length > 0 ? (
        <div className="flex flex-wrap gap-1 border-t border-border bg-panel/40 px-3 py-2">
          {allowedCommands.map((command) => (
            <button
              key={command}
              type="button"
              onClick={() => {
                setInput(command);
                inputRef.current?.focus();
              }}
              className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] text-muted hover:border-accent/40 hover:text-accent"
            >
              {command}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
