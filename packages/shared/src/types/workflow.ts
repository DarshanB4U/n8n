export type OnError = "continue" | "stopWorkflow" | "retry";
export type INodeParameters = Record<string, any>;
export interface INodeCredentials {
  type: string;         // e.g., "TELEGRAM" | "RESEND"
  credentialId?: string;
}
export interface INode {
  id: string;
  name: string;
  typeVersion: number;
  type: string;
  position: [number, number];
  disabled?: boolean;
//   retryOnFail?: boolean;
//   maxTries?: number;
//   waitBetweenTries?: number;
//   alwaysOutputData?: boolean;
//   executeOnce?: boolean;
//   onError?: OnError;
//   continueOnFail?: boolean;
//   parameters: INodeParameters;
//   credentials?: INodeCredentials;
//   webhookId?: string;
}
