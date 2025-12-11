import { prisma, Workflow } from "@repo/db";

// import { INode, NodeServices } from "@repo/shared/types";
import express, { Router } from "express";
import cors from "cors";
import {
  CredentialsBody,
  INode,
  INodeData,
  signupBody,
  TriggerNodetype,
  workflowBody,
} from "@repo/types/zodSchema";
import { authMiddleware, myPayload } from "./middlware/authmiddlware";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/authRoute";
import { credentialRouter } from "./routes/credentialRoute";
import { workflowRouter } from "./routes/workflowRoute";
import { redisClient } from "./redis/myredis";
import { executionRouter } from "./routes/executionRoute";
import { formRouter } from "./routes/formRoute";

const PORT = 8000;

const app = express();
app.use(express.json());

app.all("/api/v0/webhook/:workflowId", async (req, res) => {
  const method = req.method;
  const body = req.body;
  const secret = body.secret;

  try {
    const webhook = await prisma.webhook.findFirst({
      where: {
        workflowID: req.params.workflowId,
      },
    });

    if (!webhook) {
      return res.status(404).json({ msg: "webhook not found " });
    }

    if (method != webhook.method || secret != webhook.secret) {
      return res.status(404).json({ msg: "invalid webhook method or secret" });
    }

    const data = JSON.stringify({
      workflow: {
        id: req.params.workflowId,
      },
    });

    const enqueue = await redisClient.LPUSH("workflow", data);
    return res.status(200).json(req.params.workflowId);
  } catch (error) {}
});

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
  // allowedHeaders: [
  //   "Content-Type",
  //   "Authorization",
  //   "application/json",
  //   "application/*+json",
  // ], // Specify allowed headers
  credentials: true, // Allow sending of cookies and authorization headers
};
app.use(cors(corsOptions));

app.use("/api/v0/auth", authRouter);
app.use("/api/v0/credential", credentialRouter);
app.use("/api/v0/workflow", authMiddleware, workflowRouter);
app.use("/api/v0/execution", authMiddleware, executionRouter);
app.use("/api/v0/form", formRouter);

app.listen(PORT, () => {
  console.log("app is listning on port :", PORT);
});
