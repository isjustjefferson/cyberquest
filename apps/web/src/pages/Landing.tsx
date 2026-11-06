import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  BookOpen,
  FlaskConical,
  Gamepad2,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
  Users
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { Mascot } from '../components/Mascot';

export function Landing() {
  const { user } = useAuth();
  const tracksQuery = useQuery({ queryKey: ['public-tracks'], queryFn: api.tracks, staleTime: 60_000 });
  const tracks = tracksQuery.data?.tracks ?? [];
  const totalLessons = tracks.reduce((sum, track) => sum + track.totalLessons, 0);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/30">
              <Terminal size={18} />
            </div>
            <span className="font-bold">
              Cyber<span className="text-accent">Quest</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            <a href="#como-funciona" className="hover:text-text">Como funciona</a>
            <a href="#trilhas" className="hover:text-text">Trilhas</a>
            <a href="#labs" className="hover:text-text">Laboratórios</a>
            <a href="#etica" className="hover:text-text">Ética</a>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/dashboard" className="btn-primary">
                Ir para o painel <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost hidden sm:inline-flex">Entrar</Link>
                <Link to="/register" className="btn-primary">Começar grátis</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="badge border-accent/30 bg-accent/5 text-accent">
              <Sparkles size={13} /> Hacking ético do zero ao avançado
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              Aprenda segurança ofensiva <span className="text-accent">na prática</span>, não no slide.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">
              Lições curtas, exercícios interativos e laboratórios Docker isolados. Você aprende a pensar como
              atacante — e a corrigir como defensor — em um ambiente seguro, em português e com progressão de jogo.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={user ? '/dashboard' : '/register'} className="btn-primary px-5 py-3">
                {user ? 'Continuar jornada' : 'Criar minha conta'} <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn-secondary px-5 py-3">
                Já tenho conta
              </Link>
            </div>
            <div className="mt-9 grid max-w-lg grid-cols-3 gap-3 text-center">
              {[
                { value: totalLessons || '105', label: 'lições guiadas' },
                { value: tracks.length || '11', label: 'trilhas' },
                { value: '100%', label: 'ambiente seguro' }
              ].map((stat) => (
                <div key={stat.label} className="panel px-3 py-3">
                  <p className="text-xl font-bold text-accent">{stat.value}</p>
                  <p className="text-[11px] text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 -z-10 rounded-full bg-accent/10 blur-3xl" />
            <Mascot size={210} mood="happy" className="relative z-10 mx-auto animate-float" />
            <div className="card relative z-20 -mt-8 overflow-hidden p-0 font-mono text-xs">
              <div className="flex items-center gap-1.5 border-b border-border bg-panel/80 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-warn/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
                <span className="ml-2 text-muted">byte@cyberquest:~</span>
              </div>
              <div className="space-y-1.5 p-4">
                <p><span className="text-accent">student@cq</span>:<span className="text-cyber">~</span>$ whoami</p>
                <p className="text-muted">aprendiz-de-seguranca</p>
                <p><span className="text-accent">student@cq</span>:<span className="text-cyber">~</span>$ nmap -sV 10.10.0.10</p>
                <p className="text-muted">22/tcp open ssh OpenSSH 8.9</p>
                <p className="text-muted">80/tcp open http nginx 1.24</p>
                <p><span className="text-accent">student@cq</span>:<span className="text-cyber">~</span>$ <span className="animate-blink">▊</span></p>
              </div>
            </div>
            <div className="absolute -right-2 top-10 z-30 rounded-xl border border-warn/40 bg-surface px-3 py-2 text-xs shadow-card">
              <p className="flex items-center gap-1.5 font-semibold text-warn"><Trophy size={13} /> +120 XP</p>
              <p className="text-muted">Missão concluída</p>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="border-y border-border bg-surface/40 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-2xl font-bold md:text-3xl">Três passos para sair do zero</h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted">
              A plataforma combina teoria curta com prática imediata. Sem instalar nada e sem apontar para sistemas reais.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: BookOpen,
                  title: 'Aprenda o fundamento',
                  text: 'Lições de 5 a 10 minutos explicam o conceito, o risco e a defesa correspondente.'
                },
                {
                  icon: Gamepad2,
                  title: 'Pratique com exercícios',
                  text: 'Quiz, completar comandos, analisar código e simular um terminal. Feedback imediato e XP.'
                },
                {
                  icon: FlaskConical,
                  title: 'Invasão controlada',
                  text: 'Labs com containers isolados reproduzem cenários reais. Você encontra a flag; ninguém sai machucado.'
                }
              ].map((item) => (
                <div key={item.title} className="card p-6">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-accent/10 text-accent">
                    <item.icon size={20} />
                  </div>
                  <h3 className="mt-4 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="trilhas" className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Uma trilha para cada obsessão</h2>
              <p className="mt-2 text-sm text-muted">Do terminal básico ao red team. Você escolhe o caminho.</p>
            </div>
            <Link to={user ? '/trilhas' : '/register'} className="btn-secondary">
              Ver todas <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.slice(0, 6).map((track) => (
              <Link
                key={track.slug}
                to={user ? `/trilhas/${track.slug}` : '/register'}
                className="card group p-5 transition hover:-translate-y-0.5 hover:border-accent/40"
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{track.icon}</span>
                  <span className={`badge ${track.status === 'coming_soon' ? 'text-warn' : 'text-accent'}`}>
                    {track.status === 'coming_soon' ? 'Em breve' : `${track.totalLessons} lições`}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold group-hover:text-accent">{track.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{track.description}</p>
              </Link>
            ))}
            {tracks.length === 0 ? (
              <div className="panel p-6 text-sm text-muted sm:col-span-2 lg:col-span-3">
                As trilhas estão sendo carregadas. Se você está rodando localmente, rode o seed de conteúdo.
              </div>
            ) : null}
          </div>
        </section>

        <section id="labs" className="border-y border-border bg-surface/40 py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
            <div>
              <span className="badge border-cyber/30 bg-cyber/5 text-cyber"><ShieldCheck size={13} /> Labs isolados</span>
              <h2 className="mt-4 text-2xl font-bold md:text-3xl">Um alvo realista. Zero risco real.</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                Cada laboratório sobe containers descartáveis em uma rede interna, sem privilégios e com tempo limitado.
                Você ataca apenas o alvo da plataforma — e aprende a fechar a falha logo depois.
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  'Containers sem privilégios, com limites de CPU, memória e processos.',
                  'Flags únicas por sessão para evitar compartilhamento de resposta.',
                  'Dicas opcionais que custam bits — sem entregar a resposta de graça.',
                  'Terminal web integrado, sem expor o Docker do seu computador.'
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-muted">
                    <span className="mt-1 text-accent">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card overflow-hidden p-0">
              <div className="flex items-center justify-between border-b border-border bg-panel/80 px-4 py-3">
                <span className="flex items-center gap-2 text-xs font-semibold"><FlaskConical size={14} className="text-cyber" /> lab / web-recon</span>
                <span className="badge border-accent/30 text-accent">TTL 30:00</span>
              </div>
              <div className="space-y-2 bg-[#0a0f15] p-4 font-mono text-xs">
                <p className="text-muted">[+] Iniciando containers isolados...</p>
                <p className="text-accent">[ok] attacker · proxy · alvo-web</p>
                <p className="text-muted">student@attacker:~$ curl http://alvo-web</p>
                <p className="text-cyber">&lt;html&gt;&lt;title&gt;Painel Interno&lt;/title&gt;...</p>
                <p className="text-muted">student@attacker:~$ find /var/www -name config.php</p>
                <p className="text-warn">/var/www/html/config.php</p>
                <p className="text-muted">student@attacker:~$ cat config.php</p>
                <p className="text-text">DB_PASSWORD=••••••</p>
                <p className="mt-2 rounded border border-accent/30 bg-accent/5 p-2 text-accent">
                  CQ{'{'}flag-unica-da-sua-sessao{'}'} → validar na plataforma
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="etica" className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="card border-warn/30 p-8 md:p-10">
            <ShieldCheck className="mx-auto text-warn" size={34} />
            <h2 className="mt-4 text-2xl font-bold">Ética antes de exploits</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted">
              Aqui você pratica apenas contra os alvos descartáveis da plataforma. Acesso a sistemas sem autorização
              é crime, mesmo que “só para testar”. Toda técnica ofensiva é ensinada junto com detecção e correção.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn-primary">Quero aprender com responsabilidade</Link>
              <a href="#trilhas" className="btn-secondary">Ver trilhas</a>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface/40 py-12">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
            <div className="flex items-center gap-3">
              <Mascot size={56} />
              <div>
                <p className="font-semibold">Pronto para o primeiro comando?</p>
                <p className="text-sm text-muted">Crie sua conta e entre no terminal.</p>
              </div>
            </div>
            <Link to={user ? '/dashboard' : '/register'} className="btn-primary">
              {user ? 'Voltar ao painel' : 'Começar agora'} <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 text-xs text-muted">
          <p>CyberQuest · conteúdo educativo de segurança · PT-BR</p>
          <p className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Users size={13} /> comunidade</span>
            <span className="flex items-center gap-1"><ShieldCheck size={13} /> ética</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
