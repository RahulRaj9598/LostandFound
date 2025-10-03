// Simple test script to verify SendGrid email service
import dotenv from 'dotenv';
import { sendEmail } from './src/services/email.service.js';

// Load environment variables
dotenv.config();

async function testEmail() {
  try {
    console.log('🧪 Testing SendGrid email service...');
    console.log('');
    
    // Check if required environment variables are set
    if (!process.env.SENDGRID_API_KEY) {
      console.error('❌ SENDGRID_API_KEY is not set in environment variables');
      console.log('💡 Please add SENDGRID_API_KEY to your .env file');
      return;
    }
    
    if (!process.env.EMAIL_FROM) {
      console.error('❌ EMAIL_FROM is not set in environment variables');
      console.log('💡 Please add EMAIL_FROM to your .env file');
      return;
    }
    
    console.log('✅ Environment variables are set');
    console.log('📧 From:', process.env.EMAIL_FROM);
    console.log('🔑 API Key:', process.env.SENDGRID_API_KEY.substring(0, 10) + '...');
    console.log('');
    
    // Get test email from user input or use default
    const testEmail = process.argv[2] || process.env.TEST_EMAIL;
    
    if (!testEmail) {
      console.log('💡 Usage: node test-email.js your-email@example.com');
      console.log('💡 Or set TEST_EMAIL in your .env file');
      return;
    }
    
    console.log('📤 Sending test email to:', testEmail);
    console.log('');
    
    const result = await sendEmail({
      to: testEmail,
      subject: '🧪 SendGrid Test Email - FindMyStuff',
      text: 'This is a test email from FindMyStuff using SendGrid. If you receive this, the email service is working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🧪 SendGrid Test Email</h2>
          <p>This is a test email from <strong>FindMyStuff</strong> using SendGrid.</p>
          <p>If you receive this email, your email service is working correctly! 🎉</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            Sent at: ${new Date().toLocaleString()}<br>
            From: ${process.env.EMAIL_FROM}
          </p>
        </div>
      `
    });
    
    console.log('✅ Email sent successfully!');
    console.log('📋 Response:', JSON.stringify(result, null, 2));
    console.log('');
    console.log('🎉 Your SendGrid email service is working!');
    console.log('💡 Check your inbox (and spam folder) for the test email.');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('');
    
    if (error.response) {
      console.error('📋 Error details:', JSON.stringify(error.response.body, null, 2));
    }
    
    // Common error messages and solutions
    if (error.message.includes('SENDGRID_API_KEY is required')) {
      console.log('💡 Solution: Add SENDGRID_API_KEY to your .env file');
    } else if (error.message.includes('does not match a verified Sender Identity')) {
      console.log('💡 Solution: Verify your sender email in SendGrid dashboard');
    } else if (error.message.includes('Invalid API key')) {
      console.log('💡 Solution: Check your SendGrid API key');
    }
  }
}

testEmail();
