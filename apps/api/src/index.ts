import { prisma } from "@repo/db";

// import { INode, NodeServices } from "@repo/shared/types";
import express, { Router } from "express";
import cors from "cors";
import {
  CredentialsBody,
  signupBody,
  workflowBody,
} from "@repo/types/zodSchema";
import { authMiddleware, myPayload } from "./middlware/authmiddlware";
import { Backend_URL, emailCred, JWT_SECRET } from "./config";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/authRoute";
import { credentialRouter } from "./routes/credentialRoute";
import { workflowRouter } from "./routes/workflowRoute";

const PORT = 8000;

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  credentials: true, // Allow sending of cookies and authorization headers
};
app.use(cors(corsOptions));

app.use("/api/v0/auth", authRouter);
app.use("/api/v0/credential", credentialRouter);
app.use("/api/v0/workflow", authMiddleware, workflowRouter);

app.listen(PORT, () => {
  console.log("app is listning on port :", PORT);
});
