import { prisma } from "@repo/db";
import { Router } from "express";
const executionRouter: Router = Router();

executionRouter.get("/:id", async (req, res) => {
  try {
    const executions = await prisma.execution.findMany({
      where: {
        Workflow: {
          is: {
            id: req.params.id,
            userId: req.userID,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!executions) {
      res.status(400).json({ msg: "no execution fund for this worfkflow" });
    }

    res.status(200).json(executions);
  } catch (error) {
    console.log(error);
  }
});

export { executionRouter };
