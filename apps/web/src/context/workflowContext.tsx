"use client";
import React, {
  createContext,
  useState,
  SetStateAction,
  useEffect,
  useCallback,
} from "react";
import {
  ActionNodetype,
  Executions,
  IEdge,
  INode,
  TriggerNodetype,
  Workflow,
} from "@repo/types/zodSchema";
import { OnNodesChange, useNodesState } from "@xyflow/react";
import api from "@/lib/api";
import { workerData } from "worker_threads";

interface WorkflowContext extends Workflow {
  nodes: INode[];
  edges: IEdge[];

  title: string;
  description: string;
  enabled: boolean;
  isActive: boolean;
  // addNode: (node: INode) => void;
  // addEdge: (edge: IEdge) => void;
  // deleteNode: (id: string) => void;
  // removeEdge: (edge: string) => void;

  actionSheetOpen: boolean;

  SetActionSheetOpen: React.Dispatch<SetStateAction<boolean>>;
  setNodes: React.Dispatch<React.SetStateAction<INode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<IEdge[]>>;
  onNodesChange: OnNodesChange<INode>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  fetchWorkflow: (id: string) => Promise<React.JSX.Element | undefined>;
  // setExecutions: React.Dispatch<React.SetStateAction<Executions >>;
}

export const workflowContext = createContext<WorkflowContext | undefined>(
  undefined
);

export const WorkflowProivider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [actionSheetOpen, SetActionSheetOpen] = useState(false);
  const [title, setTitle] = useState("utitled workflow");
  const [description, setDescription] = useState<string>(" ");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [enabled, setEnabled] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([
    {
      id: "0-initial",
      type: TriggerNodetype.From,
      position: { x: -136, y: 200 },
      data: {
        nodeRegid: 1,
        Parameters: {},
        Credentials: {},
        outPut: {},
        Form: [],
      },
      measured: {},
      selected: false,
      dragging: false,
    },
  ]);
  const [edges, setEdges] = useState<IEdge[]>([]);
  const fetchWorkflow = useCallback(async (id: string) => {
    const res = await api.get(`/workflow/${id}`);
    const workflow: Workflow = res.data.workflow;

    if (!workflow) {
      return <div>unable to fetch workflow data </div>;
    }

    console.log(workflow);
    setTitle(workflow.title || "undefined");
    setNodes(workflow.nodes);
    setEdges(workflow.edges);
  }, []);

  useEffect(() => {
    if (nodes.length == 0) {
      setNodes([
        {
          id: "0-initial",
          type: TriggerNodetype.initialNode,
          position: { x: -136, y: 200 },
          data: {
            nodeRegid: 1,
            Parameters: {},
            Credentials: {},
            outPut: {},
            Form: [],
          },
          measured: {},
          selected: false,
          dragging: false,
        },
      ]);
    }
  }, [nodes]);
  // const addNode = (node: INode) => setNodes((prev) => [...prev, node]);
  // const addEdge = (edge: IEdge) => setEdges((prev) => [...prev, edge]);

  // const deleteNode = (id: string) => {
  //   setNodes((prev) => prev.filter((n) => n.id !== id));
  //   setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
  // };
  // const removeEdge = (id: string) =>
  // setEdges((prev) => prev.filter((e) => e.id !== id));

  return (
    <workflowContext.Provider
      value={{
        actionSheetOpen,
        nodes,
        edges,
        title,
        description,
        isActive,
        enabled,
        setTitle,
        setDescription,
        setIsActive,
        setEnabled,
        setNodes,
        setEdges,
        onNodesChange,
        SetActionSheetOpen,
        fetchWorkflow,
      }}
    >
      {children}
    </workflowContext.Provider>
  );
};
