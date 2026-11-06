import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { errorMessage } from '../lib/api';
import { Mascot } from '../components/Mascot';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(identifier, password);
      navigate(from, { replace: true });
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
        <div className="mx-auto max-w-sm text-center">
          <Mascot size={190} mood="happy" className="mx-auto animate-float" />
          <h1 className="mt-6 text-2xl font-bold">O terminal está esperando.</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Continue de onde parou, mantenha o streak e desbloqueie o próximo laboratório.
          </p>
        </div>
        <p className="text-center text-xs text-muted">Use apenas em ambientes autorizados.</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-text lg:hidden">
            <ArrowLeft size={15} /> Início
          </Link>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Acesso</p>
            <h1 className="mt-2 text-3xl font-bold">Entrar na conta</h1>
            <p className="mt-2 text-sm text-muted">Bom te ver de novo. O progresso fica salvo automaticamente.</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="identifier">Usuário ou e-mail</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-2.5 text-muted" size={16} />
                <input
                  id="identifier"
                  className="input pl-9"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>
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
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>
            {error ? (
              <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>
            ) : null}
            <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'} <ArrowRight size={16} />
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-muted">
            Ainda não tem conta?{' '}
            <Link to="/register" className="link">Criar conta gratuita</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
