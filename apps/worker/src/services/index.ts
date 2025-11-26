import nodemailer from "nodemailer";

export async function sendMail(
  emailCred: string,
  from: string,
  to: string,
  body: string,
  subject: string
) {
  try {
    console.log("user:", from.trim(), from.length);
    console.log("pass length:", emailCred.length);
    console.log(emailCred, from, to);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      pool: true,

      auth: {
        user: from,
        pass: emailCred,
      },
    });

    try {
      await transporter.verify();

      const info = await transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: body,
      });

      console.log(info);
      transporter.close();
      return;
    } catch (err: any) {
      console.error(
        "Mailer verify failed:",
        err && err.response ? err.response : err.message || err
      );
    }
  } catch (error) {
    console.log("---------------------email-error--------------------");
    console.log(error);
    return;
  }
}

export async function SendTG(
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
}
