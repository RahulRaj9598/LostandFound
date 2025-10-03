import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

let transporter;

export async function getTransporter() {
  if (transporter) return transporter;

  // Use Gmail SMTP configuration from .env
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || 'false') === 'true';
  const auth = process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined;
  
  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth,
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,   // 10 seconds
    socketTimeout: 10000      // 10 seconds
  });
  return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  const from = process.env.EMAIL_FROM || 'FindMyStuff <no-reply@findmystuff.local>';
  const mail = { from, to, subject, text, html };
  try {
    const tx = await getTransporter();
    const info = await tx.sendMail(mail);
    logger.info('email sent', info.messageId || 'ok');
    return info;
  } catch (err) {
    logger.error('email send failed', err.message);
    throw err;
  }
}