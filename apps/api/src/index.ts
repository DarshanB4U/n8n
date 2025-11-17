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
import { Backend_URL, emailCred, JWT_SECRET } from "./config";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/authRoute";
import { credentialRouter } from "./routes/credentialRoute";
import { workflowRouter } from "./routes/workflowRoute";
import { redisClient } from "./redis/myredis";
import { json, string, treeifyError } from "zod";
import { sendMail, SendTG } from "./execController";
import { format } from "path";
import { getCredById } from "./controllers";

const PORT = 8000;

const app = express();
app.use(express.json());

app.all("/api/v0/webhook/:workflowId", async (req, res) => {
  const method = req.method;
  const body = req.body;
  const secret = body.secret;
  console.log("body", req.body.secret);

  try {
    const webhook = await prisma.webhook.findFirst({
      where: {
        workflowID: req.params.workflowId,
      },
    });

    if (!webhook) {
      return res.status(404).json({ msg: "webhook not found " });
    }

    if (method != webhook.method && secret != webhook.secret) {
      return res.status(404).json({ msg: "invalid webhook method or secret" });
    }

    const workflow = await prisma.workflow.findFirst({
      where: {
        id: req.params.workflowId,
      },
    });

    if (!workflow) {
      return res.status(401).json({
        msg: "workflow not found",
      });
    }

    console.log(workflow);

    // interface WFNode {
    //   id: string;
    //   data: Array<>;
    //   type: "Action" | "Trigger_Webhook" | "Trigger_Manual" | "initial_node";
    //   dragging: boolean;
    //   measured: object;
    //   position: Array<object>;
    //   selected: boolean;
    // }

    type Wf = Array<INode>;

    const WorkdlowNodes = workflow.nodes as unknown as Wf;

    const nonTriggerNodes: Wf = WorkdlowNodes.filter(
      (n: INode) => n?.type !== "Trigger_Webhook"
    );

    console.log(nonTriggerNodes);

    for (const n of nonTriggerNodes) {
      if (n.data.nodeRegid === 1) {
        const cred = await getCredById(
          n.data.Credentials.CredentialId as string
        );
        console.log("gmail credentials ------", cred);
        if (!cred) {
          return res.status(401).json({
            msg: "Error while processing email credentials",
          });
        }

        try {
          sendMail(
            cred,
            n.data.Parameters.from as string,
            n.data.Parameters.to as string,
            n.data.Parameters.body as string,
            n.data.Parameters.subject as string
          );
        } catch (error) {
          console.log("----------------gmail-error-------------------------");
          console.log(error);
        }
      }

      if (n.data.nodeRegid === 2) {
        const cred = await getCredById(
          n.data.Credentials.CredentialId as string
        );
        if (!cred) {
          return res.status(401).json({
            msg: "Error while processing Telegram credentials",
          });
        }

        try {
          SendTG(
            cred,
            n.data.Parameters.chat_id as string | number,
            n.data.Parameters.text as string
          );
        } catch (error) {
          console.log("telegram error ");
          console.log(error);
        }
      }
    }
  } catch (error) {}

  res.send(req.params.workflowId);
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

app.listen(PORT, () => {
  console.log("app is listning on port :", PORT);
});
