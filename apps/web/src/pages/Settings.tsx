import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, Clock, Save, UserRound } from 'lucide-react';
import { api, errorMessage, type AuthUser } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useUiStore } from '../lib/ui';
import { Loading } from '../components/Loading';

const commonTimezones = [
  'America/Sao_Paulo',
  'America/Manaus',
  'America/Belem',
  'America/Fortaleza',
  'America/Recife',
  'America/Cuiaba',
  'America/Rio_Branco',
  'America/Lisbon',
  'Europe/London',
  'UTC'
];

export function Settings() {
  const { user, setUser, refresh, logout } = useAuth();
  const queryClient = useQueryClient();
  const addToast = useUiStore((state) => state.addToast);
  const setSoundEnabled = useUiStore((state) => state.setSoundEnabled);
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [timezone, setTimezone] = useState(user?.timezone ?? 'America/Sao_Paulo');
  const [sounds, setSounds] = useState(user?.soundsEnabled ?? true);
  const [reduceMotion, setReduceMotion] = useState(user?.reduceMotion ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cosmetics = useQuery({ queryKey: ['cosmetics'], queryFn: api.cosmetics });

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName);
    setTimezone(user.timezone);
    setSounds(user.soundsEnabled);
    setReduceMotion(user.reduceMotion);
    setSoundEnabled(user.soundsEnabled);
  }, [user, setSoundEnabled]);

  const timezones = useMemo(() => {
    try {
      return Intl.supportedValuesOf('timeZone');
    } catch {
      return commonTimezones;
    }
  }, []);

  if (!user) return <Loading />;

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const result = await api.updateSettings({
        displayName: displayName.trim(),
        timezone,
        soundsEnabled: sounds,
        reduceMotion
      });
      setUser(result.user as AuthUser);
      setSoundEnabled(sounds);
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      addToast({ tone: 'success', title: 'Configurações salvas' });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function equipAvatar(avatarId: string) {
    try {
      await api.setAvatar(avatarId);
      await Promise.all([refresh(), queryClient.invalidateQueries({ queryKey: ['cosmetics'] })]);
      addToast({ tone: 'success', title: 'Avatar atualizado' });
    } catch (err) {
      addToast({ tone: 'error', title: 'Não foi possível trocar', description: errorMessage(err) });
    }
  }

  const ownedAvatars = cosmetics.data?.cosmetics.filter((item) => item.kind === 'avatar' && item.owned) ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Conta</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">Configurações</h1>
        <p className="mt-1 text-sm text-muted">Ajuste identidade, fuso, sons e acessibilidade.</p>
      </header>

      <form onSubmit={save} className="card space-y-5 p-5 md:p-6">
        <div>
          <label className="label" htmlFor="displayName">Nome de exibição</label>
          <div className="relative">
            <UserRound size={15} className="pointer-events-none absolute left-3 top-2.5 text-muted" />
            <input
              id="displayName"
              className="input pl-9"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={60}
              required
            />
          </div>
          <p className="mt-1 text-[11px] text-muted">Seu @{user.username} não pode ser alterado nesta versão.</p>
        </div>

        <div>
          <label className="label" htmlFor="timezone">Fuso horário</label>
          <div className="relative">
            <Clock size={15} className="pointer-events-none absolute left-3 top-2.5 text-muted" />
            <select
              id="timezone"
              className="input pl-9"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
            >
              {[...new Set([timezone, ...timezones])].map((zone) => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-[11px] text-muted">Usado para calcular o dia do streak e o desafio diário.</p>
        </div>

        <div className="space-y-3">
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-bg/40 p-3">
            <span>
              <span className="flex items-center gap-2 text-sm font-medium"><Bell size={15} /> Sons de feedback</span>
              <span className="mt-0.5 block text-[11px] text-muted">Efeitos suaves ao acertar, subir de nível e conquistas.</span>
            </span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#38f2a0]"
              checked={sounds}
              onChange={(event) => setSounds(event.target.checked)}
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-bg/40 p-3">
            <span>
              <span className="flex items-center gap-2 text-sm font-medium"><Check size={15} /> Reduzir animações</span>
              <span className="mt-0.5 block text-[11px] text-muted">Desativa confetes e transições mais intensas.</span>
            </span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#38f2a0]"
              checked={reduceMotion}
              onChange={(event) => setReduceMotion(event.target.checked)}
            />
          </label>
        </div>

        {error ? (
          <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>
        ) : null}
        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar alterações'} <Save size={15} />
          </button>
        </div>
      </form>

      <section className="card p-5">
        <h2 className="font-semibold">Avatar</h2>
        <p className="mt-1 text-xs text-muted">Você pode equipar qualquer avatar já adquirido na loja.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {ownedAvatars.map((item) => {
            const active = user.avatarId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => void equipAvatar(item.id)}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                  active ? 'border-accent/50 bg-accent/10' : 'border-border bg-bg/40 hover:border-accent/30'
                }`}
              >
                <span className="text-2xl">{item.preview}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{item.name}</span>
                  <span className="block text-[10px] text-muted">{active ? 'em uso' : 'equipar'}</span>
                </span>
                {active ? <Check size={15} className="text-accent" /> : null}
              </button>
            );
          })}
          {ownedAvatars.length === 0 ? <p className="text-xs text-muted">Nenhum avatar carregado ainda.</p> : null}
        </div>
      </section>

      <section className="card border-danger/20 p-5">
        <h2 className="font-semibold text-danger">Encerrar sessão</h2>
        <p className="mt-1 text-xs text-muted">Você pode sair a qualquer momento. O progresso fica salvo.</p>
        <button
          className="btn-danger mt-3"
          onClick={async () => {
            await logout();
            window.location.href = '/login';
          }}
        >
          Sair da conta
        </button>
      </section>
    </div>
  );
}
