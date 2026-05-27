const nodemailer = require('nodemailer');

let transporter;
let usingTestAccount = false;
let initializationError = null;

const initTransporter = async () => {
  const emailHost = process.env.EMAIL_HOST || process.env.SMTP_HOST;
  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD || process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const emailPort = parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '587', 10);
  const emailSecure = process.env.EMAIL_SECURE === 'true' || emailPort === 465;

  console.log('📧 Email Service: Initializing...');
  console.log(`   HOST: ${emailHost || 'not set'}`);
  console.log(`   PORT: ${emailPort}`);
  console.log(`   USER: ${emailUser || 'not set'}`);
  console.log(`   SECURE: ${emailSecure ? 'SSL/TLS (465)' : 'STARTTLS (587)'}`);

  if (emailUser && emailPass && emailHost) {
    try {
      transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: emailSecure,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
        logger: false,
        debug: false
      });
      
      // Verify SMTP connection
      try {
        await transporter.verify();
        console.log('✅ Email service connected successfully');
        console.log(`📧 SMTP: ${emailHost}:${emailPort} (${emailSecure ? 'secure' : 'STARTTLS'}) | User: ${emailUser}`);
        initializationError = null;
      } catch (verifyErr) {
        console.error('❌ Email service connection failed:', verifyErr.message);
        console.error('   Troubleshooting tips:');
        console.error('   - Check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD in .env');
        console.error('   - For Gmail: Use an app password (not your regular password)');
        console.error('   - For Gmail on port 587: Ensure STARTTLS is enabled (EMAIL_SECURE should not be set)');
        console.error('   - Verify your app password has not been revoked in Google Account settings');
        console.error('   - Check if "Less secure apps" access needs to be enabled');
        initializationError = verifyErr;
        throw verifyErr;
      }
    } catch (err) {
      initializationError = err;
      throw err;
    }
  } else if (process.env.NODE_ENV === 'production') {
    const error = new Error('SMTP credentials are required in production to send emails. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD in .env');
    initializationError = error;
    throw error;
  } else {
    // Fallback: create Ethereal test account for local development
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      usingTestAccount = true;
      console.log('⚠️ No real SMTP credentials found — using Ethereal test account for emails.');
      console.log('📧 Ethereal preview URL: https://ethereal.email/messages');
      console.log('💡 Tip: Set EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD in .env to use real email');
      initializationError = null;
    } catch (err) {
      initializationError = err;
      throw err;
    }
  }
};

const ensureTransporter = async () => {
  if (!transporter) await initTransporter();
};

exports.sendOTPEmail = async (email, name, otp) => {
  await ensureTransporter();

  const mailOptions = {
    from: `"CampusConnect" <${process.env.EMAIL_USER || 'no-reply@example.com'}>` ,
    to: email,
    subject: 'CampusConnect — Email Verification OTP',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1e; color: #e2e8f0; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #60a5fa; font-size: 28px; margin: 0;">Campus<span style="color: #a78bfa;">Connect</span></h1>
        </div>
        <h2 style="color: #f1f5f9; font-size: 22px;">Hello, ${name}! 👋</h2>
        <p style="color: #94a3b8; line-height: 1.6;">Your email verification OTP for CampusConnect is:</p>
        <div style="background: linear-gradient(135deg, #1e3a5f, #1e1b4b); border: 1px solid #3b82f6; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #60a5fa;">${otp}</span>
        </div>
        <p style="color: #94a3b8;">This OTP is valid for <strong style="color: #f1f5f9;">10 minutes</strong>. Do not share it with anyone.</p>
        <hr style="border-color: #1e293b; margin: 32px 0;" />
        <p style="color: #475569; font-size: 12px; text-align: center;">CampusConnect — Your College Event Portal</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    const previewUrl = usingTestAccount ? nodemailer.getTestMessageUrl(info) : null;
    console.log(`📧 OTP email sent to ${email} | Message ID: ${info.messageId}`);
    if (usingTestAccount) {
      console.log('Ethereal preview URL:', previewUrl);
    }
    return previewUrl;
  } catch (err) {
    console.error(`❌ Failed to send OTP email to ${email}:`, err.message);
    throw err;
  }
};

exports.sendResetPasswordEmail = async (email, name, resetUrl) => {
  await ensureTransporter();

  const mailOptions = {
    from: `"CampusConnect" <${process.env.EMAIL_USER || 'no-reply@example.com'}>`,
    to: email,
    subject: 'CampusConnect — Password Reset Request',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1e; color: #e2e8f0; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #60a5fa; font-size: 28px; margin: 0;">Campus<span style="color: #a78bfa;">Connect</span></h1>
        </div>
        <h2 style="color: #f1f5f9; font-size: 22px;">Hi ${name},</h2>
        <p style="color: #94a3b8; line-height: 1.6;">We received a request to reset your password. Click the button below to choose a new password.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 16px 28px; background: #60a5fa; color: #0f172a; border-radius: 10px; font-weight: 700; text-decoration: none;">Reset Password</a>
        </div>
        <p style="color: #94a3b8;">If you didn't request a password reset, you can safely ignore this email.</p>
        <hr style="border-color: #1e293b; margin: 32px 0;" />
        <p style="color: #475569; font-size: 12px; text-align: center;">CampusConnect — Your College Event Portal</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    const previewUrl = usingTestAccount ? nodemailer.getTestMessageUrl(info) : null;
    console.log(`📧 Password reset email sent to ${email} | Message ID: ${info.messageId}`);
    if (usingTestAccount) {
      console.log('Ethereal preview URL:', previewUrl);
    }
    return previewUrl;
  } catch (err) {
    console.error(`❌ Failed to send password reset email to ${email}:`, err.message);
    throw err;
  }
};

exports.sendEventReminderEmail = async (email, name, eventTitle, eventDate, venue) => {
  await ensureTransporter();

  const mailOptions = {
    from: `"CampusConnect" <${process.env.EMAIL_USER || 'no-reply@example.com'}>` ,
    to: email,
    subject: `Reminder: ${eventTitle} is Tomorrow!`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1e; color: #e2e8f0; padding: 40px; border-radius: 12px;">
        <h1 style="color: #60a5fa;">Campus<span style="color: #a78bfa;">Connect</span></h1>
        <h2>Event Reminder 🔔</h2>
        <p>Hi ${name}, this is a reminder for the upcoming event:</p>
        <div style="background: #1e293b; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #60a5fa; margin: 0 0 10px 0;">${eventTitle}</h3>
          <p style="margin: 4px 0; color: #94a3b8;">📅 Date: ${new Date(eventDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style="margin: 4px 0; color: #94a3b8;">📍 Venue: ${venue}</p>
        </div>
        <p style="color: #94a3b8;">Don't miss it! See you there. 🎉</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Event reminder email sent to ${email} | Message ID: ${info.messageId}`);
    if (usingTestAccount) {
      console.log('Ethereal preview URL:', nodemailer.getTestMessageUrl(info));
    }
  } catch (err) {
    console.error(`❌ Failed to send event reminder email to ${email}:`, err.message);
    throw err;
  }
};

exports.sendContactEmail = async (fromEmail, name, subject, message) => {
  await ensureTransporter();

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'no-reply@example.com';

  const mailOptions = {
    from: `"CampusConnect" <${process.env.EMAIL_USER || 'no-reply@example.com'}>`,
    to: adminEmail,
    replyTo: `${name} <${fromEmail}>`,
    subject: subject || 'CampusConnect — Contact Form Message',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} &lt;${fromEmail}&gt;</p>
        <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        <hr />
        <div>${message.replace(/\n/g, '<br/>')}</div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Contact email sent to ${adminEmail} from ${fromEmail} | Message ID: ${info.messageId}`);
    const previewUrl = usingTestAccount ? nodemailer.getTestMessageUrl(info) : null;
    if (usingTestAccount) {
      console.log('Ethereal preview URL:', previewUrl);
    }
    return previewUrl;
  } catch (err) {
    console.error(`❌ Failed to send contact email to ${adminEmail}:`, err.message);
    throw err;
  }
};

// Initialize email service at startup
exports.initializeEmailService = async () => {
  try {
    await initTransporter();
    return { success: true, message: 'Email service initialized successfully' };
  } catch (err) {
    console.error('❌ Email service connection failed:', err.message);
    console.error('   Check your .env file:');
    console.error('   - EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD');
    console.error('   - PASSWORD should be a 16-character Gmail app password (not your regular password)');
    console.error('   - See GMAIL_APP_PASSWORD_SETUP.md for complete instructions\n');
    return { success: false, error: err.message };
  }
};

// Export status check function
exports.getEmailServiceStatus = () => {
  return {
    isInitialized: !!transporter,
    hasError: !!initializationError,
    error: initializationError ? initializationError.message : null,
    usingTestAccount,
  };
};
