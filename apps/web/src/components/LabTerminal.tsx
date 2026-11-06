import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { Loader2, TerminalSquare, WifiOff } from 'lucide-react';
import { useUiStore } from '../lib/ui';

export function LabTerminal({ sessionId, accent }: { sessionId: string; accent: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'connecting' | 'open' | 'closed' | 'error'>('connecting');
  const terminalTheme = useUiStore((state) => state.terminalTheme);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const terminal = new Terminal({
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 13,
      lineHeight: 1.35,
      theme: {
        background: '#0a0f15',
        foreground: '#e6edf6',
        cursor: accent,
        selectionBackground: 'rgba(56, 242, 160, 0.25)',
        black: '#0a0f15',
        green: accent
      },
      convertEol: true,
      scrollback: 3000
    });
    const fit = new FitAddon();
    terminal.loadAddon(fit);
    terminal.open(container);
    fit.fit();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws/lab-sessions/${sessionId}/terminal`);
    socket.binaryType = 'arraybuffer';

    socket.onopen = () => {
      setStatus('open');
      terminal.focus();
    };
    socket.onmessage = (event) => {
      const data = typeof event.data === 'string' ? event.data : new TextDecoder().decode(event.data as ArrayBuffer);
      terminal.write(data);
    };
    socket.onclose = () => {
      setStatus('closed');
      terminal.write('\r\n\x1b[33m[CyberQuest] Conexão encerrada. Inicie uma nova sessão para continuar.\x1b[0m\r\n');
    };
    socket.onerror = () => {
      setStatus('error');
      terminal.write('\r\n\x1b[31m[CyberQuest] Falha na conexão com o terminal do lab.\x1b[0m\r\n');
    };

    const dataDisposable = terminal.onData((data) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'input', data }));
      }
    });

    const sendSize = () => {
      try {
        fit.fit();
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'resize', cols: terminal.cols, rows: terminal.rows }));
        }
      } catch {
        // ignore
      }
    };
    const observer = new ResizeObserver(() => sendSize());
    observer.observe(container);
    const initialTimer = window.setTimeout(sendSize, 300);

    return () => {
      window.clearTimeout(initialTimer);
      observer.disconnect();
      dataDisposable.dispose();
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) socket.close();
      terminal.dispose();
    };
  }, [sessionId, accent]);

  useEffect(() => {
    // mantém o tema do terminal sincronizado sem recriar a sessão
    const element = containerRef.current;
    if (element) element.style.setProperty('--terminal-accent', terminalTheme);
  }, [terminalTheme]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-[#0a0f15]">
      <div className="flex items-center justify-between border-b border-border bg-panel/70 px-3 py-2 text-xs">
        <span className="flex items-center gap-2 text-muted">
          <TerminalSquare size={13} className="text-accent" /> terminal do lab
        </span>
        <span className={`flex items-center gap-1.5 ${status === 'open' ? 'text-accent' : status === 'connecting' ? 'text-warn' : 'text-danger'}`}>
          {status === 'connecting' ? <Loader2 size={11} className="animate-spin" /> : status === 'open' ? <span className="h-1.5 w-1.5 rounded-full bg-accent" /> : <WifiOff size={11} />}
          {status === 'open' ? 'conectado' : status === 'connecting' ? 'conectando' : 'desconectado'}
        </span>
      </div>
      <div ref={containerRef} className="h-[420px] w-full p-2" />
    </div>
  );
}
