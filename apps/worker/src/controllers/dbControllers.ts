import { prisma } from "@repo/db";
import { error } from "console";

interface cred {
  name: string;
  value: string;
}
type credData = Array<cred>;

export const getCredById = async (credId: string) => {
  try {
    const credentials = await prisma.credentials.findFirst({
      where: {
        id: credId,
      },
    });

    const credData = credentials?.credentialData as unknown as credData;
    
    return credData[0]?.value;
  } catch (error) {}
  console.log("error finding credentials from db ", error);
};
