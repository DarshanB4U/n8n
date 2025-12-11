import { array, float64, z } from "zod";
export const FieldTypes = [
  "text",
  "number",
  "email",
  "file",
  "textarea",
] as const;
export const TriggerNodetype = {
  manualTrigger: "Trigger_Manual",
  webhookTrigger: "Trigger_Webhook",
  initialNode: "initial_node",
  From: "Trigger_Form",
} as const;
export const ActionNodetype = {
  Action: "Action",
} as const;

export const nodeType = z.enum([
  TriggerNodetype.manualTrigger,
  TriggerNodetype.webhookTrigger,
  TriggerNodetype.initialNode,
  ActionNodetype.Action,
  TriggerNodetype.From,
]);
export const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const fields = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(FieldTypes),
});
export const formField = z.array(z.object());
export const nodeDataSchema = z.object({
  nodeRegid: z.number(),
  Parameters: z.record(z.string(), z.string()).optional().default({}),
  Credentials: z.record(z.string(), z.string()).optional().default({}),
  outPut: z.record(z.string(), z.string()).optional().default({}),
  Form: z.array(fields).optional().default([]),
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
export const ICredentialbody = z.object({
  name: z.string(),
  value: z.string(),
});

export const CredentialsBody = z.object({
  id: z.string().optional(),
  platform: z.enum(["TELEGRAM", "EMAIL"]),
  title: z.string(),
  credentialsData: z.array(ICredentialbody),
});

export const deleteCredentialBody = z.object({
  credentialsId: z.string(),
});

export const signupBody = z.object({
  username: z.string(),
  email: z.email(),
});

export interface IExecution {
  id: String;
  status: "running" | "success" | "failed" | "stopped";
  nodesExecuted: number;
  nodeData: {};
  WofklowID: String;
}

export type Executions = Array<IExecution>;

export type FieldType = "text" | "number" | "email" | "file" | "textarea";
export interface FormField {
  id: string;
  title: string;
  type: FieldType;
  placeholder: string;
}

// export type Workflow = z.infer<typeof workflowBody>;
export type INode = z.infer<typeof nodeSchema>;
export type IEdge = z.infer<typeof edgeSchema>;
export type Workflow = z.infer<typeof workflowBody>;
export type INodeData = z.infer<typeof nodeDataSchema>;
export type ICredentials = z.infer<typeof ICredentialbody>;
export type Credentials = z.infer<typeof CredentialsBody>;
export type Fields = z.infer<typeof fields>;
export interface QworkflowObject {
  workflowId: string;
  formExecutionId?: string;
}
