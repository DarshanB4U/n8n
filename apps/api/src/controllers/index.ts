import { prisma } from "@repo/db";

interface cred {
  name: string;
  value: string;
}
type credData = Array<cred>;

export const getCredById = async (credId: string) => {
  const credentials = await prisma.credentials.findFirst({
    where: {
      id: credId,
    },
  });
  
  const credData = credentials?.credentialData as unknown as credData;
  return credData[0]?.value;
};
