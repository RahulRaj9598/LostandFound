import bcrypt from 'bcrypt';
import EmailOTP from '../models/EmailOTP.js';
import { sendEmail } from './email.service.js';

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function issueEmailOtp(userId, purpose, email) {
  const code = generateOtp();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await EmailOTP.deleteMany({ userId, purpose });
  await EmailOTP.create({ userId, purpose, codeHash, expiresAt });
  await sendEmail({ to: email, subject: 'Your verification code', text: `Code: ${code}`, html: `<p>Code: <b>${code}</b></p>` });
}

export async function verifyEmailOtp(userId, purpose, code) {
  const otp = await EmailOTP.findOne({ userId, purpose }).sort({ createdAt: -1 });
  if (!otp || otp.expiresAt < new Date()) return false;
  const ok = await bcrypt.compare(code, otp.codeHash);
  if (ok) await EmailOTP.deleteMany({ userId, purpose });
  return ok;
}


