import { describe, expect, it } from 'vitest';
import { loadManifest, manifestSchema, resolveLabFile } from '../src/modules/labs/manifest';
import { generatedPassword } from '../src/utils/crypto';

describe('manifestos de labs', () => {
  it('continua aceitando manifestos antigos com attacker', () => {
    const manifest = loadManifest('ola-terminal');
    expect(manifest.containers.attacker?.image).toContain('cyberquest/attacker');
    expect(manifest.objectives[0]?.verify).toBeUndefined();
  });

  it('aceita manifestos DBA com workstation, verify e volumes', () => {
    const manifest = loadManifest('psql-primeiros-passos');
    expect(manifest.containers.workstation?.image).toBe('cyberquest/dba-workstation:latest');
    expect(manifest.terminal).toEqual({ container: 'workstation', user: 'student' });
    expect(manifest.containers.targets?.[0]?.ephemeral_volumes).toContain(
      '/var/lib/postgresql/data'
    );
    expect(manifest.containers.targets?.[0]?.healthcheck?.cmd).toContain('pg_isready');
    expect(manifest.objectives.every((objective) => Boolean(objective.verify))).toBe(true);
  });

  it('rejeita verify e flag_mode no mesmo objetivo', () => {
    const base = {
      slug: 'teste',
      title: 'Teste',
      description: 'Teste',
      difficulty: 1,
      ttl_minutes: 20,
      xp_reward: 100,
      containers: { workstation: { image: 'cyberquest/dba-workstation:latest' } },
      objectives: [
        {
          id: 'x',
          title: 'X',
          xp: 10,
          flag_mode: 'dynamic',
          verify: {
            type: 'cmd',
            container: 'db',
            query: 'true',
            expect: { exit_code: 0 }
          }
        }
      ]
    };
    expect(() => manifestSchema.parse(base)).toThrow(/mutuamente exclusivos/);
  });

  it('rejeita imagens fora da allowlist', () => {
    const base = {
      slug: 'teste',
      title: 'Teste',
      description: 'Teste',
      difficulty: 1,
      ttl_minutes: 20,
      xp_reward: 100,
      containers: { workstation: { image: 'nginx:latest' } },
      objectives: [{ id: 'x', title: 'X', xp: 10 }]
    };
    expect(() => manifestSchema.parse(base)).toThrow(/Imagem não permitida/);
  });

  it('resolve arquivos apenas dentro do projeto', () => {
    expect(resolveLabFile('labs/sql/clientes_old.sql')).toMatch(/clientes_old\.sql$/);
    expect(() => resolveLabFile('../../etc/passwd')).toThrow(/fora do projeto/);
  });

  it('gera a mesma senha para a mesma sessão', () => {
    expect(generatedPassword('abc')).toBe(generatedPassword('abc'));
    expect(generatedPassword('abc')).not.toBe(generatedPassword('def'));
  });
});
