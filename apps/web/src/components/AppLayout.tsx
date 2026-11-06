import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Award,
  BookOpen,
  ChevronRight,
  Crown,
  FlaskConical,
  Gauge,
  LogOut,
  Menu,
  RotateCcw,
  Settings,
  ShoppingBag,
  Terminal,
  User,
  X,
  Zap
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { formatNumber } from '../lib/format';
import { Mascot } from './Mascot';
import { XpBar } from './XpBar';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/trilhas', label: 'Trilhas', icon: BookOpen },
  { to: '/labs', label: 'Labs', icon: FlaskConical },
  { to: '/revisao', label: 'Revisão', icon: RotateCcw },
  { to: '/ranking', label: 'Ranking', icon: Crown },
  { to: '/conquistas', label: 'Conquistas', icon: Award },
  { to: '/loja', label: 'Loja', icon: ShoppingBag },
  { to: '/perfil', label: 'Perfil', icon: User }
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dashboard = useQuery({ queryKey: ['dashboard'], queryFn: api.dashboard, staleTime: 30_000 });
  const dueCount = dashboard.data?.dueCount ?? 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30">
          <Terminal size={20} />
        </div>
        <div>
          <p className="text-base font-bold leading-none">
            Cyber<span className="text-accent">Quest</span>
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted">hacking ético</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-accent/10 text-accent ring-1 ring-accent/25'
                  : 'text-muted hover:bg-panel hover:text-text'
              }`
            }
          >
            <item.icon size={17} />
            <span className="flex-1">{item.label}</span>
            {item.to === '/revisao' && dueCount > 0 ? (
              <span className="rounded-full bg-warn px-1.5 py-0.5 text-[10px] font-bold text-bg">{dueCount}</span>
            ) : null}
            <ChevronRight size={13} className="opacity-0 transition group-hover:opacity-60" />
          </NavLink>
        ))}
      </nav>

      {user ? (
        <div className="border-t border-border p-3">
          <div className="panel mb-2 flex items-center gap-3 p-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/10 text-2xl">
              <Mascot size={34} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.displayName}</p>
              <p className="text-[11px] text-muted">@{user.username} · Nv. {user.level}</p>
            </div>
            <NavLink to="/configuracoes" className="text-muted hover:text-text" aria-label="Configurações">
              <Settings size={16} />
            </NavLink>
          </div>
          <button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted transition hover:bg-panel hover:text-danger"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
          >
            <LogOut size={14} /> Sair da conta
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const dashboard = useQuery({ queryKey: ['dashboard'], queryFn: api.dashboard, staleTime: 30_000 });

  return (
    <div className="min-h-screen lg:flex">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-surface/60 backdrop-blur lg:block">
        <SidebarContent />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-bg/80 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Fechar menu" />
          <aside className="relative h-full w-72 border-r border-border bg-surface">
            <button
              className="absolute right-3 top-3 text-muted hover:text-text"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-bg/85 px-4 backdrop-blur md:px-6">
          <button className="btn-ghost p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu">
            <Menu size={20} />
          </button>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-medium text-muted">
              {dashboard.data?.continueLesson
                ? `Continue: ${dashboard.data.continueLesson.title}`
                : 'Bem-vindo ao CyberQuest'}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 md:gap-4">
            <div className="hidden items-center gap-1.5 rounded-full border border-warn/30 bg-warn/10 px-3 py-1.5 text-xs font-bold text-warn sm:flex">
              <Zap size={13} /> {formatNumber(user?.bits ?? 0)} bits
            </div>
            <div className="hidden items-center gap-1.5 rounded-full border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-bold text-danger sm:flex">
              <span>🔥</span> {user?.streakCurrent ?? 0} dias
            </div>
            <div className="w-32 md:w-44">
              <XpBar
                compact
                percent={user?.levelPercent ?? 0}
                xpIntoLevel={user?.xpIntoLevel ?? 0}
                xpToNextLevel={user?.xpToNextLevel ?? 1}
              />
            </div>
            <div className="hidden rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1.5 text-xs font-bold text-accent md:block">
              Nv. {user?.level ?? 1}
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6 md:py-8">
          <Outlet />
        </main>
        <footer className="border-t border-border px-6 py-4 text-center text-[11px] text-muted">
          CyberQuest · hacking ético com responsabilidade · ambiente 100% controlado
        </footer>
      </div>
    </div>
  );
}
