"use client";
import { Button } from "@/components/ui/button";
import { PencilIcon, Plus } from "lucide-react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Node,
  NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useState, useCallback, useEffect, useContext } from "react";
import axios from "axios";
import { TriggerSheetWithForm } from "@/components/TriggerSheetWithForm";
import { SidebarInset, SidebarTrigger, useSidebar } from "./ui/sidebar";
import { workflowContext } from "@/context/workflowContext";
import { INode } from "@repo/types/zodSchema";

import { WebhookNode } from "./nodes/WebhookNode";
import { fromTrigger } from "./nodes/formBuilderTrigger";

import { ManualTrigger } from "@/components/nodes/ManualClickNode";
import { CostomAction } from "./nodes/CostomActionNode";
import MyActionSheet from "./MyActionSheet";
import { Params } from "next/dist/server/request/params";
import api from "@/lib/api";
import { toast } from "sonner";
import { Separator } from "./ui/separator";

const AddNode = () => (
  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer">
    <Plus size={12} />
  </div>
);

export default function workflowEditor({ workflowId }: { workflowId: string }) {
  const { open } = useSidebar();

  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = () => setIsEditing(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setIsEditing(false);
  };

  const WorkflowContext = useContext(workflowContext);
  if (!WorkflowContext) {
    console.log("error in WorkflowContext");
    return;
  }

  const {
    nodes,
    edges,
    title,
    isActive,
    description,
    setDescription,
    fetchWorkflow,
    setNodes,
    setEdges,
    onNodesChange,
    setTitle,
  } = WorkflowContext;

  // const [dialogOpen, setDilogOpen] = useState(false);

  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );
  // onNodesChange()  use this for save on change

  const nodeTypes = {
    initial_node: () => (
      <TriggerSheetWithForm WorkflowId={workflowId}></TriggerSheetWithForm>
    ),
    Trigger_Webhook: WebhookNode,
    Trigger_Manual: ManualTrigger,
    Action: CostomAction,
    Trigger_Form: fromTrigger,
  };

  const handleSaveClick = async () => {
    const data = {
      title,
      nodes,
      edges,
    };

    const res = await api.put(`/workflow/${workflowId}`, data);
    toast.success("Saved Workflow");
  };

  useEffect(() => console.log(nodes, edges), [nodes]);
  useEffect(() => {
    fetchWorkflow(workflowId);
  }, []);

  return (
    <div className="overflow-hidden ">
      <div className="pb-2 mt-0 ] overflow-hidden">
        <div className="flex items-center overflow-hidden gap-2">
          <SidebarTrigger className="bg-[#1a2438] overflow-hidden" />
          {isEditing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="border-b  overflow-hidden border-[#172433] bg-transparent text-xl font-semibold focus:outline-none px-2"
            />
          ) : (
            <div
              className="flex justify-items-center gap-2 overflow-hidden"
              onClick={() => setIsEditing(true)}
            >
              <h1 className="text-xl font-semibold cursor-pointer overflow-hidden hover:text-[#cdc5b7] transition">
                {title}
              </h1>
              <div className="flex justify-center border-2 items-center p-1 rounded-md ">
                <PencilIcon size={18}></PencilIcon>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator className="overflow-hidden"></Separator>
      <div
        className={` flex-1 overflow-hidden text-foreground  flex items-center flex-col  ${open ? "w-[calc(100vw-272px)]" : "w-screen"}`}
      >
        <main className="flex-1">
          <div className=" grid grid-cols-12 overflow-hidden "></div>

          <div className="h-screen w-screen  overflow-hidden  ">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              zoomOnScroll={true}
              zoomOnPinch={true}
              onConnect={onConnect}
              fitView
           
            >
              <Background></Background>
            </ReactFlow>

            {nodes[0]?.type !== "initial_node" && (
              <div className="absolute bottom-1 right-10 z-50 shadow-xl text-white ">
                <MyActionSheet></MyActionSheet>
              </div>
            )}

            <div className="absolute overflow-hidden top-1  bg-red-700 right-50 flex m-2 font-bold items-center "></div>
            <Button
              onClick={handleSaveClick}
              variant={"secondary"}
              className="absolute top-1 right-10 flex hover:bg-orange-600  font-bold items-center "
            >
              Save
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
