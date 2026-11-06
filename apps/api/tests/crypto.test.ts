import { describe, expect, it } from 'vitest';
import { dynamicFlag, hmacHex, safeEqual } from '../src/utils/crypto';

describe('flags dinâmicas', () => {
  it('gera flag determinística no formato CQ{...}', () => {
    const first = dynamicFlag(7, 'root', 'nonce-fixo');
    expect(first).toBe(dynamicFlag(7, 'root', 'nonce-fixo'));
    expect(first).toMatch(/^CQ\{[a-f0-9]{24}\}$/);
  });

  it('muda por usuário, objetivo e nonce', () => {
    const base = dynamicFlag(7, 'root', 'nonce-a');
    expect(dynamicFlag(8, 'root', 'nonce-a')).not.toBe(base);
    expect(dynamicFlag(7, 'logs', 'nonce-a')).not.toBe(base);
    expect(dynamicFlag(7, 'root', 'nonce-b')).not.toBe(base);
  });

  it('compara hashes em tempo constante', () => {
    const hash = hmacHex('segredo', 'valor');
    expect(safeEqual(hash, hash)).toBe(true);
    expect(safeEqual(hash, `${hash}0`)).toBe(false);
  });
});
