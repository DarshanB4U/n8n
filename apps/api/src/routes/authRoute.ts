import { prisma } from "@repo/db";
import { signupBody } from "@repo/types/zodSchema";
import { Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET, Backend_URL } from "../config";
import { myPayload } from "../middlware/authmiddlware";
import { transporter } from "../mail/transporter";

const authRouter: Router = Router();

authRouter.post("/signup", async (req, res) => {
  const { data, success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(401).json({ msg: "invalid signupBody" });
  }

  try {
    const userExists = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (userExists) {
      return res.status(409).json({ msg: "user already exists" });
    }
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.username,
      },
    });
    console.log(user);
    const payload: myPayload = {
      name: user.email,
      email: user.name,
      userID: user.id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    const url = `${Backend_URL}/api/v0/auth/signin/post?token=${token}`;
    console.log(url);

    const info = await transporter.sendMail({
      from: "hitechdarshan0@gmail.com",
      to: "darshanbondre0@gmail.com",
      subject: "Test message",
      text: "I hope this message gets delivered",
      html: `<p>Click <a href=${url}>here</a> to verify</p>`,
    });
    console.log(info.envelope);
    console.log(info.messageId);

    res.status(201).json({ msg: "link sent to your email" });
  } catch (error) {
    console.log("error while user Signup or Sending email ", error);
    res.status(400).json({ msg: "error while signup" });
  }
});

authRouter.get("/signin/post", async (req, res) => {
  const token = req.query.token;
  if (typeof token !== "string") {
    return res.status(401).json({
      msg: "invalid url",
    });
  }

  try {
    const { email, name, userID } = jwt.verify(token, JWT_SECRET) as myPayload;
    console.log(email, name, userID);
    const payload = {
      email,
      name,
      userID,
    };

    const newToken = jwt.sign(payload, JWT_SECRET);
    return res
      .cookie("authToken", newToken, {
        httpOnly: true,
        secure: false, // true in prod (HTTPS); false in dev (localhost)
        sameSite: "lax", // good default for most apps
        path: "/", // cookie available to whole domain
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      })
      .json({ msg: "verfied" });
  } catch (error) {
    console.log(error);

    return res.status(401).json("invalid token ");
  }
});

authRouter.post("/signin", async (req, res) => {
  console.log("signin hit");

  res.send("msg form signin");
});

export { authRouter };
