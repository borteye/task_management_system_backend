require("dotenv").config();
import nodemailer from "nodemailer";
import { IMailOptions } from "../types/Auth";
import { mailMessage } from "../utils/MailMessage";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASSWORD,
  },
});

const mailOptions = ({ email, verificationCode }: IMailOptions) => {
  const options = {
    from: "RestroBytes Restaurant",
    to: email,
    subject: "[RestroBytes] Reset Password Verification",
    html: mailMessage(verificationCode),
  };
  return options;
};

export { transporter, mailOptions };
