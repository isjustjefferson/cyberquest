import { Mascot } from './Mascot';

export function Loading({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-muted">
      <Mascot size={88} className="animate-float" />
      <div className="flex items-center gap-2 text-sm">
        <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
        {label}
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card flex flex-col items-center gap-3 p-8 text-center">
      <Mascot size={76} mood="sad" />
      <p className="text-sm text-muted">{message}</p>
      {onRetry ? (
        <button className="btn-secondary" onClick={onRetry}>
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="panel flex flex-col items-center gap-2 p-8 text-center">
      <Mascot size={64} mood="thinking" />
      <h3 className="font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-muted">{description}</p>
      {action}
    </div>
  );
}
