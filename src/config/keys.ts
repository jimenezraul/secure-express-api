// src/config/keys.ts
import dotenv from 'dotenv';
dotenv.config();  // ← loads your .env into process.env

function decodeKey(envVar: string): string {
  const b64 = process.env[envVar];
  if (!b64) {
    throw new Error(`Missing env var ${envVar}`);
  }
  // Decode Base64 to UTF-8 PEM
  return Buffer.from(b64, 'base64').toString('utf-8');
}

export const ACCESS_PRIVATE_KEY  = Buffer.from(process.env.ACCESS_PRIVATE_KEY!, 'base64').toString('utf-8');
export const ACCESS_PUBLIC_KEY   = Buffer.from(process.env.ACCESS_PUBLIC_KEY!, 'base64').toString('utf-8');
export const REFRESH_PRIVATE_KEY = Buffer.from(process.env.REFRESH_PRIVATE_KEY!, 'base64').toString('utf-8');
export const REFRESH_PUBLIC_KEY  = Buffer.from(process.env.REFRESH_PUBLIC_KEY!, 'base64').toString('utf-8');
export const ACCESS_EXP = parseInt(process.env.ACCESS_EXP!);
export const REFRESH_EXP = parseInt(process.env.REFRESH_EXP!);

const accessExpirationMinutes = parseInt(process.env.ACCESS_EXPIRATION!);
const refreshExpirationDays = parseInt(process.env.REFRESH_EXPIRATION!);
export const accessExpSeconds = accessExpirationMinutes * 60;
export const refreshExpSeconds = refreshExpirationDays * 24 * 60 * 60;
