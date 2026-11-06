import crypto from 'node:crypto';
import { config } from '../config';

export function sha256Hex(value: string): string {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

export function hmacHex(secret: string, value: string): string {
  return crypto.createHmac('sha256', secret).update(value, 'utf8').digest('hex');
}

export function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return crypto.timingSafeEqual(bufferA, bufferB);
}

export function dynamicFlag(userId: number, objectiveId: string, nonce: string): string {
  const digest = hmacHex(config.LAB_FLAG_SECRET, `${userId}:${objectiveId}:${nonce}`).slice(0, 24);
  return `CQ{${digest}}`;
}

export function newNonce(): string {
  return crypto.randomBytes(16).toString('hex');
}
