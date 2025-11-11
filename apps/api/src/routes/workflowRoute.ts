import { prisma } from "@repo/db";
import { workflowBody, TriggerNodetype } from "@repo/types/zodSchema";
import { Router } from "express";
import { error } from "node:console";
import { redisClient } from "../redis/myredis";

const workflowRouter: Router = Router();

workflowRouter.get("/", async (req, res) => {
  try {
    const Workflows = await prisma.workflow.findMany({
      where: {
        userId: req.userID,
      },
    });

    return res.status(200).json(Workflows);
  } catch (error) {}
});

workflowRouter.post("/", async (req, res) => {
  try {
    const workflow = workflowBody.safeParse(req.body);

    if (!workflow.success) {
      console.log(workflow);
      return res.status(422).json({ msg: "invalid workflow body" });
    }

    // const { nodes, edges }: { nodes: Nodes; edges: Edges } = workflow.data;

    const workflowRes = await prisma.workflow.create({
      data: {
        userId: req.userID,
        title: workflow.data.title ?? "untitled workflow ",
        nodes: workflow.data.nodes,
        edges: workflow.data.edges,
      },
    });
    const Trigger = workflow.data.nodes[0];
    if (Trigger?.type == TriggerNodetype.webhookTrigger) {
      const method = workflow.data.nodes[0]?.data.Parameters.method as string;
      const path = `/webhook/${workflowRes.id}`;
      const secret = workflow.data.nodes[0]?.data.Parameters.secret as string;
      const webhookTitle = workflow.data.nodes[0]?.data.Credentials
        .secret as string;
      const header = workflow.data.nodes[0]?.data.Parameters.header as string;
      const webhook = prisma.webhook.create({
        data: {
          method,
          path,
          workflowID: workflowRes.id,
          title: webhookTitle || "undefined",
          secret: secret,
          header: header,
        },
      });
    }
    return res.status(201).json(workflowRes);
  } catch (error) {}
  console.log(error);
});

workflowRouter.put("/:id", async (req, res) => {
  try {
    const workflowId = req.params.id;

    if (!workflowId) {
      return res.status(401).json({
        msg: "fsdfds",
      });
    }
    const { data, success } = workflowBody.safeParse(req.body);
    if (success != true) {
      return res.status(401).json({ msg: "invalid worflow body " });
    }
    const updatedWorkflow = await prisma.workflow.update({
      where: {
        id: workflowId,
      },
      data: data,
    });

    console.log(`updated the workflow ${updatedWorkflow.id}`);

    res.status(200).json({ msg: `updated the ${updatedWorkflow.title}` });
  } catch (error) {
    console.log("error while updating workflow  ", error);
  }
});

workflowRouter.get("/:id", async (req, res) => {
  try {
    const workflow = await prisma.workflow.findFirst({
      where: {
        userId: req.userID,
        id: req.params.id,
      },
    });

    res.status(400).json({ workflow });
  } catch (error) {
    console.log("error while getting the workflow ", error);
  }
});
workflowRouter.delete("/:id", async (req, res) => {
  try {
    const workflow = await prisma.workflow.delete({
      where: {
        userId: req.userID,
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "workflow deleted ", workflow });
  } catch (error) {}
});

workflowRouter.post("/run/:id", async (req, res) => {
  try {
    const workflowId = req.params.id;
    const workflow = await prisma.workflow.findFirst({
      where: {
        userId: req.userID,
        id: workflowId,
      },
    });

    const data = JSON.stringify(workflow);

    redisClient.lPush("workflow_q", JSON.stringify(workflow));
  } catch (error) {}
});

export { workflowRouter };
