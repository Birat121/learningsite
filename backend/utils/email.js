import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to, subject, text, fromName = "Your App") => {
  const mailOptions = {
    from: `"${fromName}" <kirren@koffeewithkirren.com>`, // ✅ fixed format
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;

