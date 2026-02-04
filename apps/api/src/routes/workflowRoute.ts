import { prisma } from "@repo/db";
import { workflowBody, TriggerNodetype } from "@repo/types/zodSchema";
import { Router } from "express";
import { error } from "node:console";
import { redisClient } from "../redis/myredis";
import { createOrUpdateFormForWorkflow } from "../controllers";

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
        title: workflow.data.title ?? " workflow ",
        nodes: workflow.data.nodes,
        edges: workflow.data.edges,
      },
    });

    return res.status(201).json(workflowRes);
  } catch (error) {}
  console.log(error);
});

workflowRouter.put("/:id", async (req, res) => {
  try {
    const workflowId = req.params.id;

    if (!workflowId) {
      return res.status(401).json({
        msg: "nok worfkolow id exiet ",
      });
    }
    console.log(req.body.nodes.data);

    // const result = workflowBody.safeParse(req.body);
    // if (!result.success) {
    //   console.log(result.error.issues); // shows exactly which field failed
    // } else {
    //   console.log("ok", result.data);
    // }
    const { data, success } = workflowBody.safeParse(req.body);

    // console.log("this is parsed data", data);

    if (success !== true) {
      return res.status(422).json({ msg: "invalid worflow body " });
    }

    const updatedWorkflow = await prisma.workflow.update({
      where: {
        id: workflowId,
        userId: req.userID,
      },
      data: data,
    });

    console.log("updated ", updatedWorkflow);

    const Trigger = data.nodes.filter(
      (node) =>
        node.type === TriggerNodetype.From || TriggerNodetype.webhookTrigger,
    );

    console.log("----------->trigger", Trigger);

    if (Trigger[0]?.type == TriggerNodetype.From) {
      const fields = data.nodes[0]?.data.Form;
      if (!fields) {
        return res.status(400).json({ msg: "no form fields existed " });
      }

      const form = await createOrUpdateFormForWorkflow(workflowId, fields);

      // const form = await prisma.form.create({
      //   data: {
      //     title: data.title as string,
      //     workflowId: req.params.id,
      //     FormData: fields,
      //   },
      // });
      console.log("form created ", form);
    } else {
      try {
        console.log("form deleted workflow Id", workflowId);
      } catch (error) {
        console.log("no form exist to delete ");
      }
    }

    if (Trigger[0]?.type === TriggerNodetype.webhookTrigger) {
      const method = data.nodes[0]?.data.Credentials.method as string;

      const secret = data.nodes[0]?.data.Credentials.secret as string;
      // const webhookTitle = data.nodes[0]?.data.Credentials.secret as string;
      // const header = data.nodes[0]?.data.Parameters.header as string;

      const path = `/webhook/${updatedWorkflow.id}`;
      const webhookExisted = await prisma.webhook.findFirst({
        where: {
          path: path,
          workflowID: req.params.id,
        },
      });

      if (webhookExisted) {
        const WF = await prisma.webhook.update({
          where: {
            id: webhookExisted.id,
          },
          data: {
            // title: webhookTitle,
            path,
            method,
            secret,
            // header,
          },
        });
        console.log(WF);
      } else {
        const webhook = await prisma.webhook.create({
          data: {
            method,
            path,
            workflowID: updatedWorkflow.id,
            // title: webhookTitle || "undefined",
            secret: secret,
            // header: header,
          },
        });
        console.log(webhook);
      }
    } else {
      const path = `/webhook/${updatedWorkflow.id}`;
      const webhookExisted = await prisma.webhook.findFirst({
        where: {
          path: path,
          workflowID: req.params.id,
        },
      });
      if (webhookExisted) {
        const deletedWebhook = await prisma.webhook.delete({
          where: { id: webhookExisted.id },
        });
        console.log(
          "Deleted webhook because trigger is not webhook:",
          deletedWebhook,
        );
      }
    }

    // if (webhookExisted) {
    //     const deletedWebhook = await prisma.webhook.delete({
    //       where: { id: webhookExisted.id },
    //     });
    //   }

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

    res.status(200).json({ workflow });
  } catch (error) {
    console.log("error while getting the workflow ", error);
  }
});
workflowRouter.delete("/:id", async (req, res) => {
  try {
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: req.params.id,
        userId: req.userID,
      },
    });

    if (!workflow) {
      return res.status(404).json({ msg: "workflow not found" });
    }

    await prisma.$transaction([
      prisma.form.deleteMany({ where: { workflowId: req.params.id } }),
      prisma.webhook.deleteMany({ where: { workflowID: req.params.id } }),
      prisma.workflow.delete({ where: { id: req.params.id } }),
    ]);

    res.status(200).json({ msg: "workflow deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "delete failed" });
  }
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
