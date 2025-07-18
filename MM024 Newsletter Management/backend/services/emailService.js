import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,         // smtp.hostinger.com
  port: parseInt(process.env.EMAIL_PORT), // 465 or 587
  secure: process.env.EMAIL_SECURE === 'true', // true if port 465
  auth: {
    user: process.env.EMAIL_USER,       // info@yourdomain.com
    pass: process.env.EMAIL_PASS        // your password (e.g., Paris)
  }
});

export default async function sendNewsletterEmail(to, subject, html) {
  await transporter.sendMail({
    from: `"Man Matrimony" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}
