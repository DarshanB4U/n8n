"use client";
import React, { createContext, useState, useContext } from "react";
import { IEdge, INode, Workflow } from "@repo/types/zodSchema";

interface WorkflowContext extends Workflow {
  nodes: INode[];
  edges: IEdge[];
  addNode: (node: INode) => void;
  addEdge: (edge: IEdge) => void;
  deleteNode: (id: string) => void;
  removeEdge: (edge: string) => void;
}

const worfklwoContext = createContext<WorkflowContext | undefined>(undefined);

export const WorkflowProivider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [nodes, setNodes] = useState<INode[]>([]);
  const [edges, setEdges] = useState<IEdge[]>([]);

  const addNode = (node: INode) => setNodes((prev) => [...prev, node]);
  const addEdge = (edge: IEdge) => setEdges((prev) => [...prev, edge]);
  const deleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
  };
  const removeEdge = (id: string) =>
    setEdges((prev) => prev.filter((e) => e.id !== id));

  return (
    <worfklwoContext.Provider
      value={{ nodes, edges, addNode, addEdge, deleteNode, removeEdge }}
    >
      {children}
    </worfklwoContext.Provider>
  );
};
