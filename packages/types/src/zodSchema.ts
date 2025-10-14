import { z } from "zod";

export const TriggerNodetype = {
  manualTrigger: "Trigger_Manual",
  webhookTrigger: "Trigger_Webhook",
  initialNode: "initial_node",
} as const;
export const ActionNodetype = {
  Action: "Action",
} as const;

export const nodeType = z.enum([
  TriggerNodetype.manualTrigger,
  TriggerNodetype.webhookTrigger,
  TriggerNodetype.initialNode,
  ActionNodetype.Action,
]);
export const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});
export const nodeDataSchema = z.object({
  nodeRegid: z.number(),
  Parameters: z.record(z.string(), z.string()).optional().default({}),
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
export type INodeData = z.infer<typeof nodeDataSchema>;
