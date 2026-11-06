import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Palette, ShoppingBag, Snowflake, Sparkles, UserRound, Zap } from 'lucide-react';
import { api, errorMessage } from '../lib/api';
import { useAuth } from '../lib/auth';
import { formatNumber } from '../lib/format';
import { useUiStore } from '../lib/ui';
import { Loading, ErrorState } from '../components/Loading';

export function Shop() {
  const queryClient = useQueryClient();
  const { user, refresh } = useAuth();
  const addToast = useUiStore((state) => state.addToast);
  const [tab, setTab] = useState<'avatar' | 'terminal_theme'>('avatar');
  const [busy, setBusy] = useState<string | null>(null);
  const query = useQuery({ queryKey: ['cosmetics'], queryFn: api.cosmetics });

  function notifyError(error: unknown) {
    addToast({ tone: 'error', title: 'Compra não concluída', description: errorMessage(error) });
  }

  async function refreshAll() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['cosmetics'] }),
      queryClient.invalidateQueries({ queryKey: ['me'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      refresh()
    ]);
  }

  async function buy(id: string) {
    setBusy(id);
    try {
      await api.buyCosmetic(id);
      await refreshAll();
      addToast({ tone: 'success', title: 'Item adquirido!', description: 'Ele já está disponível no seu inventário.' });
    } catch (error) {
      notifyError(error);
    } finally {
      setBusy(null);
    }
  }

  async function equip(avatarId: string) {
    setBusy(avatarId);
    try {
      await api.setAvatar(avatarId);
      await refreshAll();
      addToast({ tone: 'success', title: 'Avatar equipado!' });
    } catch (error) {
      notifyError(error);
    } finally {
      setBusy(null);
    }
  }

  async function buyFreeze() {
    setBusy('freeze');
    try {
      await api.buyStreakFreeze();
      await refreshAll();
      addToast({ tone: 'success', title: 'Congelamento comprado', description: 'Sua streak está mais protegida.' });
    } catch (error) {
      notifyError(error);
    } finally {
      setBusy(null);
    }
  }

  if (query.isLoading) return <Loading label="Abrindo a loja..." />;
  if (query.isError || !query.data) return <ErrorState message={errorMessage(query.error)} onRetry={() => void query.refetch()} />;
  const items = query.data.cosmetics.filter((item) => item.kind === tab);
  const bits = user?.bits ?? 0;

  return (
    <div className="space-y-6">
      <header className="card p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-warn">
              <ShoppingBag size={14} /> Loja do Byte
            </p>
            <h1 className="mt-1 text-2xl font-bold md:text-3xl">Personalize sem perder o foco</h1>
            <p className="mt-1 text-sm text-muted">Bits são ganhos concluindo lições, labs e desafios. Nada aqui vende vantagem competitiva.</p>
          </div>
          <div className="rounded-xl border border-warn/30 bg-warn/10 px-4 py-3 text-right">
            <p className="flex items-center justify-end gap-1 text-xs text-warn"><Zap size={13} /> seu saldo</p>
            <p className="text-2xl font-bold text-warn">{formatNumber(bits)}</p>
            <p className="text-[10px] text-muted">bits</p>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg border border-border bg-panel p-1">
          {[
            { id: 'avatar' as const, label: 'Avatares', icon: UserRound },
            { id: 'terminal_theme' as const, label: 'Temas de terminal', icon: Palette }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                tab === item.id ? 'bg-accent text-bg' : 'text-muted hover:text-text'
              }`}
            >
              <item.icon size={13} /> {item.label}
            </button>
          ))}
        </div>
        <div className="panel flex items-center gap-3 px-3 py-2">
          <Snowflake size={18} className="text-cyber" />
          <div>
            <p className="text-xs font-semibold">Congelamento de streak</p>
            <p className="text-[10px] text-muted">{user?.streakFreezes ?? 0} em estoque · 80 bits</p>
          </div>
          <button className="btn-secondary px-2.5 py-1.5 text-xs" onClick={() => void buyFreeze()} disabled={busy === 'freeze'}>
            Comprar
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const canAfford = bits >= item.priceBits;
          const isEquipped = item.kind === 'avatar' && query.data.avatarId === item.id;
          return (
            <div key={item.id} className="panel flex flex-col p-4">
              <div className="flex items-start justify-between">
                <div className="grid h-16 w-16 place-items-center rounded-xl bg-bg text-4xl ring-1 ring-border">
                  {item.kind === 'avatar' ? item.preview : <span className="h-8 w-8 rounded-full" style={{ background: item.preview }} />}
                </div>
                <span className={`badge ${item.owned ? 'border-accent/30 text-accent' : 'text-warn'}`}>
                  {item.owned ? <><Check size={11} /> adquirido</> : <><Zap size={11} /> {formatNumber(item.priceBits)}</>}
                </span>
              </div>
              <h2 className="mt-3 font-semibold">{item.name}</h2>
              <p className="mt-1 flex-1 text-xs leading-5 text-muted">{item.description}</p>
              {item.kind === 'avatar' ? (
                item.owned ? (
                  <button
                    className={isEquipped ? 'btn-secondary mt-3 w-full' : 'btn-primary mt-3 w-full'}
                    onClick={() => void equip(item.id)}
                    disabled={isEquipped || busy === item.id}
                  >
                    {isEquipped ? 'Em uso' : 'Equipar avatar'}
                  </button>
                ) : (
                  <button
                    className="btn-primary mt-3 w-full"
                    onClick={() => void buy(item.id)}
                    disabled={!canAfford || busy === item.id}
                  >
                    {canAfford ? 'Comprar' : 'Bits insuficientes'}
                  </button>
                )
              ) : item.owned ? (
                <span className="mt-3 rounded-lg border border-border bg-bg/40 py-2 text-center text-xs text-muted">
                  Tema disponível no terminal
                </span>
              ) : (
                <button
                  className="btn-primary mt-3 w-full"
                  onClick={() => void buy(item.id)}
                  disabled={!canAfford || busy === item.id}
                >
                  {canAfford ? 'Comprar' : 'Bits insuficientes'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="panel border-accent/20 bg-accent/5 p-4 text-sm">
        <p className="flex items-center gap-2 font-semibold text-accent"><Sparkles size={15} /> Como ganhar bits</p>
        <p className="mt-1 text-xs leading-5 text-muted">
          Cada lição concluída rende bits; labs completos rendem um bônus maior. Dicas de lab custam bits — escolha bem
          entre gastar em ajuda ou em cosméticos.
        </p>
      </div>
    </div>
  );
}
