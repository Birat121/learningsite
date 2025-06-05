import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    ciphers: "TLSv1.2",  // enforce modern TLS version
  },
});

export const sendEmail = async (to, subject, message, fromName = "Your App", isHtml = false) => {
  const mailOptions = {
    from: `"${fromName}" <support@koffeewithkirren.com>`,
    to,
    subject,
  };

  if (isHtml) {
    mailOptions.html = message; // send HTML content
  } else {
    mailOptions.text = message; // fallback to plain text
  }

  await transporter.sendMail(mailOptions);
};


export default sendEmail;

