import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, AtSign, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { errorMessage } from '../lib/api';
import { Mascot } from '../components/Mascot';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        displayName: displayName.trim() || username.trim()
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between border-r border-border bg-surface/40 p-10 lg:flex">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted hover:text-text">
          <ArrowLeft size={15} /> Voltar para a página inicial
        </Link>
        <div className="mx-auto max-w-sm">
          <Mascot size={170} mood="happy" className="mx-auto animate-float" />
          <h1 className="mt-6 text-center text-2xl font-bold">Sua jornada começa aqui.</h1>
          <ul className="mt-6 space-y-3 text-sm text-muted">
            {[
              'Progresso salvo, XP e níveis a cada missão.',
              'Trilhas guiadas do terminal básico ao red team.',
              'Labs isolados com terminal no navegador.',
              'Conquistas, ranking semanal e revisão inteligente.'
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-0.5 text-accent">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-center text-xs text-muted">Sem cartão de crédito. Comece pelo fundamento.</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-text lg:hidden">
            <ArrowLeft size={15} /> Início
          </Link>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Nova conta</p>
            <h1 className="mt-2 text-3xl font-bold">Começar a jornada</h1>
            <p className="mt-2 text-sm text-muted">Leva menos de um minuto. O Byte já separou um terminal.</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="displayName">Nome de exibição</label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-2.5 text-muted" size={16} />
                <input
                  id="displayName"
                  className="input pl-9"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Como podemos te chamar?"
                  maxLength={60}
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="username">Usuário</label>
              <div className="relative">
                <AtSign className="pointer-events-none absolute left-3 top-2.5 text-muted" size={16} />
                <input
                  id="username"
                  className="input pl-9"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="byte_hacker"
                  minLength={3}
                  maxLength={24}
                  pattern="[a-zA-Z0-9_-]+"
                  autoComplete="username"
                  required
                />
              </div>
              <p className="mt-1 text-[11px] text-muted">Letras, números, hífen e sublinhado. 3 a 24 caracteres.</p>
            </div>
            <div>
              <label className="label" htmlFor="email">E-mail</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-2.5 text-muted" size={16} />
                <input
                  id="email"
                  type="email"
                  className="input pl-9"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="password">Senha</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-2.5 text-muted" size={16} />
                  <input
                    id="password"
                    type="password"
                    className="input pl-9"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={10}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="confirm">Confirmar senha</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-2.5 text-muted" size={16} />
                  <input
                    id="confirm"
                    type="password"
                    className="input pl-9"
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    minLength={10}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted">A senha precisa ter ao menos 10 caracteres.</p>
            {error ? (
              <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>
            ) : null}
            <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar conta'} <ArrowRight size={16} />
            </button>
            <p className="text-center text-[11px] leading-5 text-muted">
              Ao continuar, você concorda em praticar apenas em ambientes autorizados e seguir o código de ética.
            </p>
          </form>
          <p className="mt-5 text-center text-sm text-muted">
            Já tem conta? <Link to="/login" className="link">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
