import { prisma } from "@repo/db";
import { Fields } from "@repo/types/zodSchema";

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

export async function createOrUpdateFormForWorkflow(
  workflowId: string,

  FormData: Fields[] // adapt shape
) {
  // upsert ensures idempotency: if a Form exists for the workflow it will be updated otherwise created
  const form = await prisma.form.upsert({
    where: { workflowId }, // unique field
    create: {
      title: "untitled",
      FormData: FormData,
      workflowId, // connects implicitly
    },
    update: {
      title: "untiled",
      FormData: FormData,
    },
  });

  return form;
}
