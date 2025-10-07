import dotenv from "dotenv";
import { string } from "zod";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const emailCred = process.env.emailCred as string;
const Backend_URL = process.env.Backend_URL as string;
const isProd = process.env.NODE_ENV as string

if (!emailCred) {
  throw new Error("NodeMailerEmailPass env error");
}
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET env error ");
}
if (!Backend_URL) {
  throw new Error("Backend_URL env error");
}


export { JWT_SECRET, emailCred, Backend_URL,isProd };
