import nodemailer from "nodemailer";

export const sendMail = async (
  emailCred: string,
  from: string,
  to: string,
  body: string,
  subject: string
) => {
  console.log("user:", from.trim());
  console.log("pass length:", emailCred.length);
  console.log(emailCred, from, to);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: from,
      pass: emailCred,
    },
  });

  transporter
    .verify()
    .then(() => console.log("gmail Service is ready  "))
    .catch((err) => {
      console.error(
        "Mailer verify failed:",
        err && err.response ? err.response : err.message || err
      );
    });

  const info = await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    text: body,
  });

  console.log(info);
};

export const SendTG = async function (
  TelegramToken: string,
  chat_id: string | number,
  text: string
) {
  console.log(TelegramToken);
  const base = `https://api.telegram.org/bot${TelegramToken}`;

  async function sendMessage(chatId: number | string, text: string) {
    const res = await fetch(`${base}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
    const data: any = await res.json();
    if (!data.ok) throw new Error(JSON.stringify(data));
    return data.result;
  }
  try {
    const res = await sendMessage(Number(chat_id), text);
    console.log("---------------------tg-res--------------------");
    console.log(res);
  } catch (error) {
    console.log("---------------------telegram-error--------------------");
    console.log(error);
  }
};
