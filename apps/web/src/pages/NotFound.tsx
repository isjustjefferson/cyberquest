import { Link } from 'react-router-dom';
import { Mascot } from '../components/Mascot';

export function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <Mascot size={150} mood="thinking" className="mx-auto" />
        <p className="mt-4 font-mono text-sm text-danger">404: rota não encontrada</p>
        <h1 className="mt-2 text-2xl font-bold">Esse diretório não existe.</h1>
        <p className="mt-2 text-sm text-muted">Talvez o caminho tenha sido movido, ou o comando digitado errado.</p>
        <Link to="/dashboard" className="btn-primary mt-6">Voltar ao painel</Link>
      </div>
    </div>
  );
}
