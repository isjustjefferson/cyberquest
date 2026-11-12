const BLOCK = 512;

function octal(value: number, length: number): string {
  return value.toString(8).padStart(length - 1, '0') + '\0';
}

function header(name: string, size: number, mode = 0o644): Buffer {
  const buffer = Buffer.alloc(BLOCK, 0);
  buffer.write(name.slice(0, 100), 0, 100, 'utf8');
  buffer.write(octal(mode, 8), 100, 8, 'ascii');
  buffer.write(octal(0, 8), 108, 8, 'ascii');
  buffer.write(octal(0, 8), 116, 8, 'ascii');
  buffer.write(octal(size, 12), 124, 12, 'ascii');
  buffer.write(octal(Math.floor(Date.now() / 1000), 12), 136, 12, 'ascii');
  buffer.write('        ', 148, 8, 'ascii');
  buffer.write('0', 156, 1, 'ascii');
  buffer.write('ustar\0', 257, 6, 'ascii');
  buffer.write('00', 263, 2, 'ascii');
  let sum = 0;
  for (const byte of buffer) sum += byte;
  buffer.write(octal(sum, 7) + ' ', 148, 8, 'ascii');
  return buffer;
}

export function createTarFile(name: string, content: Buffer | string, mode = 0o644): Buffer {
  const data = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
  const padding = (BLOCK - (data.length % BLOCK)) % BLOCK;
  return Buffer.concat([
    header(name, data.length, mode),
    data,
    Buffer.alloc(padding, 0),
    Buffer.alloc(BLOCK * 2, 0)
  ]);
}
