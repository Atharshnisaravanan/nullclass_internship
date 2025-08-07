const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendInvoiceMail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Plan System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("✅ Invoice email sent");
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};

module.exports = sendInvoiceMail;
