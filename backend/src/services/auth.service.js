import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const ACCESS_TTL = '15m';
const REFRESH_TTL = '30d';

export async function hashPassword(plain) {
  const saltRounds = 10;
  return bcrypt.hash(plain, saltRounds);
}

export async function verifyPassword(plain, hash) {
  if (!hash) return false;
  return bcrypt.compare(plain, hash);
}

export function signAccessToken(payload) {
  const secret = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
  return jwt.sign(payload, secret, { expiresIn: ACCESS_TTL });
}

export function signRefreshToken(payload) {
  const secret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
  return jwt.sign(payload, secret, { expiresIn: REFRESH_TTL });
}

export function verifyRefreshToken(token) {
  const secret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
  return jwt.verify(token, secret);
}

export async function hashToken(token) {
  const saltRounds = 10;
  return bcrypt.hash(token, saltRounds);
}


