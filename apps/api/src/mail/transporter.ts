import nodemailer from "nodemailer";
import { emailCred } from "../config";
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hitechdarshan0@gmail.com",
    pass: emailCred,
  },
});

transporter
  .verify()
  .then(() => console.log("Mailer ready"))
  .catch((err) => {
    console.error(
      "Mailer verify failed:",
      err && err.response ? err.response : err.message || err
    );
  });
