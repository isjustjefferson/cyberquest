export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  priceBits: number;
  kind: 'avatar' | 'terminal_theme';
  preview: string;
}

export const COSMETICS: CosmeticItem[] = [
  {
    id: 'byte-default',
    name: 'Byte padrão',
    description: 'O gatinho de capuz original do CyberQuest.',
    priceBits: 0,
    kind: 'avatar',
    preview: '🐱'
  },
  {
    id: 'byte-neon',
    name: 'Byte neon',
    description: 'Byte com óculos de sol e brilho verde.',
    priceBits: 120,
    kind: 'avatar',
    preview: '😎'
  },
  {
    id: 'byte-ninja',
    name: 'Byte ninja',
    description: 'Silencioso como um pacote sem log.',
    priceBits: 180,
    kind: 'avatar',
    preview: '🥷'
  },
  {
    id: 'byte-hacker',
    name: 'Byte hacker',
    description: 'Capuz, café e um terminal aberto.',
    priceBits: 220,
    kind: 'avatar',
    preview: '👨‍💻'
  },
  {
    id: 'theme-green',
    name: 'Terminal Matrix',
    description: 'Verde neon clássico no terminal dos labs.',
    priceBits: 100,
    kind: 'terminal_theme',
    preview: '#00ff9c'
  },
  {
    id: 'theme-cyan',
    name: 'Terminal Glacial',
    description: 'Ciano frio para sessões noturnas.',
    priceBits: 100,
    kind: 'terminal_theme',
    preview: '#22d3ee'
  },
  {
    id: 'theme-amber',
    name: 'Terminal Âmbar',
    description: 'Destaques em âmbar como um CRT antigo.',
    priceBits: 100,
    kind: 'terminal_theme',
    preview: '#fbbf24'
  },
  {
    id: 'theme-purple',
    name: 'Terminal Ultravioleta',
    description: 'Roxo profundo para quem curte criptografia.',
    priceBits: 160,
    kind: 'terminal_theme',
    preview: '#a78bfa'
  }
];

export function cosmeticById(id: string): CosmeticItem | undefined {
  return COSMETICS.find((item) => item.id === id);
}
