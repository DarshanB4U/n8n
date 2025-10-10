import { z } from "zod";

export const TriggerNodetype = {
  manualTrigger: "Trigger_Manual",
  emailAction: "Action_Email",
  webhookTrigger: "Trigger_Webhook",
  telegramAction: "Action_Telegram",
  initialNode: "initial_node",
  addNode: "addnode",
} as const;

export const nodeType = z.enum([
  TriggerNodetype.manualTrigger,
  TriggerNodetype.webhookTrigger,
  TriggerNodetype.emailAction,
  TriggerNodetype.telegramAction,
  TriggerNodetype.initialNode,
  TriggerNodetype.addNode,
]);
export const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});
export const nodeDataSchema = z.object({
  parameters: z.record(z.string(), z.string()).optional().default({}),
  Credentials: z.record(z.string(), z.string()).optional().default({}),
  outPut: z.record(z.string(), z.string()).optional().default({}),
});

export const nodeSchema = z.object({
  id: z.string(),
  type: nodeType,
  position: positionSchema,
  data: nodeDataSchema,
  measured: z.object(),
  selected: z.boolean().optional().default(false),
  dragging: z.boolean().optional().default(false),
});

export const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});

export const workflowBody = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
});

export const CredentialsBody = z.object({
  type: z.enum(["TELEGRAM", "EMAIL"]),
  title: z.string(),
  credentialsData: z.record(z.string(), z.string()),
});

export const deleteCredentialBody = z.object({
  credentialsId: z.string(),
});

export const signupBody = z.object({
  username: z.string(),
  email: z.email(),
});

// export type Workflow = z.infer<typeof workflowBody>;
export type INode = z.infer<typeof nodeSchema>;
export type IEdge = z.infer<typeof edgeSchema>;
export type Workflow = z.infer<typeof workflowBody>;
