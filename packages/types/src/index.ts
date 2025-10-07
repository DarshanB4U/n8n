export type OnError = "continue" | "stopWorkflow" | "retry";
export type INodeParameters = Record<string, any>;

export interface INodeCredentialsDetails {
  [key: string]: string;
}

export enum NodeServices {
  TELEGRAM = "TELEGRAM",
  RESEND = "RESEND",
}

export interface INodeCredentials {
  type: NodeServices; // e.g., "TELEGRAM" | "RESEND"
  credentialId?: string;
  details: INodeCredentialsDetails;
}

export interface INode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: INodeParameters;
  credentials?: INodeCredentials;
  disabled?: boolean;
  alwaysOutputData?: boolean;
  executeOnce?: boolean;
  onError?: OnError;
  webhookId?: string;
  // typeVersion: number;
  // notes?: string;
  // notesInFlow?: boolean;
  // retryOnFail?: boolean;
  // maxTries?: number;
  // waitBetweenTries?: number;
  // continueOnFail?: boolean;
}



