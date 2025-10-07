import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { string } from "zod";
import { request } from "http";
import { log } from "console";

const secret = JWT_SECRET as string;

export interface myPayload extends JwtPayload {
  userID: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.headers);
  const Authorization = req.cookies.authToken;
  console.log(Authorization);

  if (!Authorization) {
    return res.status(401).json({ msg: "token is not present" });
  }
  const token = Authorization;

  const verifiedToken = jwt.verify(token, secret) as myPayload;
  if (!verifiedToken) {
    return res.status(401).json({ msg: "invalid token " });
  }
  console.log(verifiedToken);

  req.userID = verifiedToken.userID;

  next();
};
