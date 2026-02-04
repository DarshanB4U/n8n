import { prisma } from "@repo/db";
import { signupBody } from "@repo/types/zodSchema";
import { Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET, Backend_URL } from "../config";
import { myPayload } from "../middlware/authmiddlware";
import { transporter } from "../mail/transporter";
import { email } from "zod";

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
    console.log(userExists);

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
      name: user.name,
      email: user.email,
      userID: user.id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    const url = `${Backend_URL}/auth/signin/post?token=${token}`;
    console.log(url);

    const info = await transporter.sendMail({
      from: "hitechdarshan0@gmail.com",
      to: data.email,
      subject: "msg form tasker ",
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
      .redirect("http://localhost:3000/auth/signin");
  } catch (error) {
    console.log(error);

    return res.status(401).json("invalid token ");
  }
});

authRouter.post("/signin", async (req, res) => {
  const { email } = req.body; // You might want to zod-validate this

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found. Please sign up." });
    }

    const payload: myPayload = {
      name: user.name,
      email: user.email,
      userID: user.id,
    };

    const token = jwt.sign(payload, JWT_SECRET);
    const url = `${Backend_URL}/auth/signin/post?token=${token}`;

    await transporter.sendMail({
      from: "hitechdarshan0@gmail.com",
      to: email,
      subject: "Your Login Link for Tasker",
      html: `<p>Click <a href="${url}">here</a> to sign in to your account.</p>`,
    });

    res.status(200).json({ msg: "Login link sent to your email" });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});
authRouter.post("/me", async (req, res) => {
  const token = req.cookies.authToken as myPayload;
  if (!token) {
    return res.status(401).json("invalid  AuthToken");
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: token.userID,
      },
    });
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "userAuthFailed",
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  const token = req.cookies.authToken as myPayload;
});
export { authRouter };
