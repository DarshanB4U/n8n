"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { nanoid } from "nanoid";
import axios from "axios";
import { TriggerSheetWithForm } from "@/components/TriggerSheetWithForm";
import { useSidebar } from "./ui/sidebar";
import { workflowContext } from "@/context/workflowContext";
import { INode } from "@repo/types/zodSchema";

import { WebhookNode } from "./nodes/WebhookNode";
import { ManualTrigger } from "@/components/nodes/ManualClickNode";
import { CostomAction } from "./nodes/CostomActionNode";
import MyActionSheet from "./MyActionSheet";

const BACKEND_URL = "http://localhost:8000";

// const initialNodes = [
//   {
//     id: "-1",
//     type: "addnode",
//     position: { x: -500, y: 200 },
//     data: { value: 123 },
//   },
// ];
interface myNode extends Node {
  type: string;
}

const initialEdges = [{ id: "n1-n2", source: "n3", target: "n2" }];

const AddNode = () => (
  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer">
    <Plus size={12} />
  </div>
);

export default function workflowEditor() {
  const { open } = useSidebar();

  const WorkflowContext = useContext(workflowContext);
  if (!WorkflowContext) {
    console.log("error in WorkflowContext");
    return;
  }
 
  const { nodes, edges, setNodes, setEdges, onNodesChange } = WorkflowContext;

  const [dialogOpen, setDilogOpen] = useState(false);

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
    initial_node: TriggerSheetWithForm,
    Trigger_Webhook: WebhookNode,
    Trigger_Manual: ManualTrigger,
    Action: CostomAction,
  };

  const handleSaveClick = () => {
    // axios.post(BACKEND_URL + "/api/v0/workflow", {
    //   title: "myworkflow",
    //   nodes,
    //   edges,
    // });
    alert("workflow Saved");
  };

  useEffect(() => console.log(nodes, edges), [nodes]);

  return (
    <div
      className={`  overflow-hidden text-foreground  flex items-center flex-col  ${open ? "w-[calc(100vw-272px)]" : "w-screen"}`}
    >
      <main>
        <div className=" grid grid-cols-12 ">
          <div className="col-span-4 flex  justify-center "></div>
        </div>
        <div className="h-screen w-screen  ">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
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

          <Button
            onClick={handleSaveClick}
            variant={"secondary"}
            className="absolute top-1 right-10 flex hover:bg-teal-700  font-bold items-center "
          >
            Save
          </Button>
        </div>
      </main>
    </div>
  );
}
