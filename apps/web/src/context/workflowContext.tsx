"use client";
import React, { createContext, useState, useContext, SetStateAction } from "react";
import {
  ActionNodetype,
  IEdge,
  INode,
  TriggerNodetype,
  Workflow,
} from "@repo/types/zodSchema";
import { OnNodesChange, useNodesState } from "@xyflow/react";

interface WorkflowContext extends Workflow {
  nodes: INode[];
  edges: IEdge[];
  // addNode: (node: INode) => void;
  // addEdge: (edge: IEdge) => void;
  // deleteNode: (id: string) => void;
  // removeEdge: (edge: string) => void;
  actionSheetOpen: boolean;
  SetActionSheetOpen:React.Dispatch<SetStateAction<boolean>>
  setNodes: React.Dispatch<React.SetStateAction<INode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<IEdge[]>>;
  onNodesChange: OnNodesChange<INode>;
}

export const workflowContext = createContext<WorkflowContext | undefined>(
  undefined
);

export const WorkflowProivider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const [nodes, setNodes] = useState<INode[]>([
  //   {
  //     id: "0-initial",
  //     type: TriggerNodetype.initialNode,
  //     position: { x: -136, y: 200 },
  //     data: { parameters: {}, Credentials: {}, outPut: {} },
  //     measured: {},
  //     selected: false,
  //     dragging: false,
  //   },
  // ]);
  const [actionSheetOpen, SetActionSheetOpen] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([
    {
      id: "0-initial",
      type: TriggerNodetype.initialNode,
      position: { x: -136, y: 200 },
      data: { parameters: {}, Credentials: {}, outPut: {} },
      measured: {},
      selected: false,
      dragging: false,
    },
  ]);
  const [edges, setEdges] = useState<IEdge[]>([]);

  // const addNode = (node: INode) => setNodes((prev) => [...prev, node]);
  // const addEdge = (edge: IEdge) => setEdges((prev) => [...prev, edge]);

  // const deleteNode = (id: string) => {
  //   setNodes((prev) => prev.filter((n) => n.id !== id));
  //   setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
  // };
  // const removeEdge = (id: string) =>
  //   setEdges((prev) => prev.filter((e) => e.id !== id));

  return (
    <workflowContext.Provider
      value={{
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        actionSheetOpen,
        SetActionSheetOpen

      }}
    >
      {children}
    </workflowContext.Provider>
  );
};
