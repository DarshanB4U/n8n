import { prisma } from "@repo/db";
import {
  Fields,
  FormField,
  INode,
  QworkflowObject,
  workflowBody,
} from "@repo/types/zodSchema";
import { Router } from "express";
import { authMiddleware } from "../middlware/authmiddlware";
import { redisClient } from "../redis/myredis";
import { json } from "zod";
const formRouter: Router = Router();

formRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const form = await prisma.form.findFirst({
      where: {
        workflowId: req.params.id,
      },
    });
    if (!form) {
      return res.status(400).json({ msg: "no form present " });
    }
    const formFields = form?.FormData;
    res.status(200).json({ formFields });
  } catch (error) {
    console.log("error fetching form ");
    res.status(400).json({ msg: "error fetching form " });
  }
});

type formBody = {
  [key: string]: string;
};
formRouter.post("/:id", async (req, res) => {
  console.log(req.body);
  const formBody: formBody = req.body;

  const form = await prisma.form.findFirst({
    where: {
      workflowId: req.params.id,
    },
  });
  if (!form) {
    return res.status(402).json({ msg: "form not  found " });
  }

  // const workflow = prisma.workflow.findFirst({
  //   where: {
  //     id: req.params.id,
  //   },
  // });

  // if (!workflow) {
  //   return res.status(402).json({ msg: "form workflow existed " });
  // }

  const formFields = form.FormData as unknown as Fields[];
  try {
    const data = formFields.reduce(
      (acc, field) => {
        acc[field.id] = formBody[field.id];
        return acc;
      },
      {} as Record<string, any>
    );
    console.log(data);
    const dataJson = JSON.stringify(data);
    const parsed = JSON.parse(dataJson);
    const formExecution = await prisma.execution.create({
      data: {
        WokflowID: req.params.id,
        nodeOutput: [parsed] as unknown as any,
        nodeId: form.id,
      },
    });

    const workflowData: QworkflowObject = {
      workflowId: req.params.id,
      formExecutionId: formExecution.id,
    };
    console.log(workflowData);

    const enqueue = await redisClient.LPUSH(
      "workflow",
      JSON.stringify(workflowData)
    );
    // return res.status(200).json(req.params.id);

    return res.status(200).json({ msg: "form submitted " });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "form fields mismatch  " });
  }
});
export { formRouter };
