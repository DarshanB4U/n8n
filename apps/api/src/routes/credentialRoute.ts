import { prisma } from "@repo/db";
import { CredentialsBody, deleteCredentialBody } from "@repo/types/zodSchema";
import { Router } from "express";
import { authMiddleware } from "../middlware/authmiddlware";

const credentialRouter: Router = Router();

credentialRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { data, success } = CredentialsBody.safeParse(req.body);
    if (success !== true) {
      return res.status(401).json({ msg: "invalid credentialsBody" });
    }

    console.log(req.userID);

    const credentials = await prisma.credentials.create({
      data: {
        userId: req.userID,
        platform: data.type,
        title: data.title,
        CredentailData: data.credentialsData,
      },
    });

    console.log(credentials.platform);

    return res.status(201).json({
      msg: `added credentials for ${credentials.platform}`,
      credentialsId: credentials.id,
    });
  } catch (error) {
    console.log("this is error ", error);
    return res.status(400).json({ msg: "invalid signup body or error " });
  }
});

credentialRouter.delete("/", authMiddleware, async (req, res) => {
  console.log("fsdfdsfdsf");

  try {
    const { data, success } = deleteCredentialBody.safeParse(req.body);
    if (success !== true) {
      console.log(success);
      return res
        .status(401)
        .json({ msg: "invalid request deleteCredentialBody" });
    }
    const crednetial = await prisma.credentials.delete({
      where: {
        id: data.credentialsId,
      },
    });
    console.log("deleted the credential", crednetial);

    return res.status(202).json({ msg: "deleted the credential" });
  } catch (error) {
    console.log("error while deleting credential", error);
  }
});

export { credentialRouter };
