const nodemailer = require("nodemailer");

const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "mail.religare.com",
  port: parseInt(process.env.SMTP_PORT) || 25,
  secure: process.env.SMTP_SECURE === "true"
};

// Only set auth if both EMAIL_USER and EMAIL_PASS are present
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  SMTP_CONFIG.auth = {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  };
}

const transporter = nodemailer.createTransport({
  ...SMTP_CONFIG,
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 5 * 60 * 1000,
  greetingTimeout: 5 * 60 * 1000,
  socketTimeout: 5 * 60 * 1000
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      ...(text && { text }),
      ...(html && { html })
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = {
  sendEmail
};