import sgMail from '@sendgrid/mail';
import logger from '../config/logger.js';

// Initialize SendGrid
let isInitialized = false;

export function initializeSendGrid() {
  if (isInitialized) return;
  
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY is required');
  }
  
  sgMail.setApiKey(apiKey);
  isInitialized = true;
  logger.info('SendGrid initialized successfully');
}

export async function sendEmail({ to, subject, html, text }) {
  try {
    // Initialize SendGrid if not already done
    initializeSendGrid();
    
    const from = process.env.EMAIL_FROM || 'FindMyStuff <no-reply@findmystuff.local>';
    
    const msg = {
      to,
      from,
      subject,
      text,
      html,
    };
    
    const response = await sgMail.send(msg);
    logger.info('Email sent successfully', { messageId: response[0]?.headers?.['x-message-id'] || 'ok' });
    return response;
  } catch (err) {
    logger.error('Email send failed', { error: err.message, code: err.code });
    throw err;
  }
}