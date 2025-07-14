import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendNewsletterEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Man Matrimony" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

export default sendNewsletterEmail;
