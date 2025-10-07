"use client";
import { InitialNode } from "./nodes/intialnode";
import { TelegramNode } from "./nodes/telegramNode";
import { Emailnode } from "./nodes/emailNode";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./pageComponents/sidebar";
import { manualTrigger } from "./nodes/manuClickNode";
import { Button } from "@/components/ui/button";

import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useState, useCallback, useEffect } from "react";
import SideDrawer from "./pageComponents/SideDrawer";
import { nanoid } from "nanoid";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000";

const initialNodes = [
  {
    id: "n3",
    type: "manualTrigger",
    position: { x: -136, y: 200 },
    data: { value: 123 },
  },
];
interface myNode extends Node {
  type: string;
}

const initialEdges = [{ id: "n1-n2", source: "n3", target: "n2" }];

export default function Home() {
  const [nodes, setNodes] = useState<Array<Node>>(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  // const [workflowExist, setWorkflowExist] = useState(false);
  const [dialogOpen, setDilogOpen] = useState(false);
  const addNode = useCallback((type: string) => {
    const newNodeID = nanoid(5);
    const newNode: myNode = {
      id: newNodeID,
      position: { x: Math.random() * 50, y: Math.random() * 200 },
      type: type + "node",
      data: {
        parameters: {
          msg: {
            dfsdfdf: "fdasfdsfdsf",
            sdfsdfdsfd: {
              fdsfdfdf: "dsfsdfdsf",
            },
          },
        },
        Credentials: {
          telegram: "uuid3434dsdf",
        },
      },
    };
    setNodes((prev) => {
      console.log(initialNodes);

      return [...prev, newNode];
    });
  }, []);

  const handelCreateOnclick = () => {};
  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
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

  const nodeTypes = {
    initialnode: InitialNode,
    Telegramnode: TelegramNode,
    Emailnode: Emailnode,
    manualTrigger: manualTrigger,
  };

  const handleSaveClick = () => {
    axios.post(BACKEND_URL + "/api/v0/workflow", {
      title: "myworkflow",
      nodes,
      edges,
    });
  };

  useEffect(() => console.log(nodes, edges), [nodes]);

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <div className=" grid grid-cols-12">
            <SidebarTrigger className="h-12 w-12 col-span-1" />

            <div className="flex  justify-center col-span-">
              <SideDrawer addNode={addNode} />
            </div>
            <div className="col-span-4 flex  justify-center ">
              <Button
                onClick={handleSaveClick}
                variant={"secondary"}
                className="flex hover:bg-blue-200  active:bg-green-700 font-bold items-center"
              >
                Save
              </Button>
            </div>
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
              onNodeClick={(event, node) => {
                if (node.type === "initialnode") {
                  console.log("Clicked Telegram node:", node);
                  // your custom logic here
                  const newId = `node-${Date.now()}`;
                  const tg = {
                    id: newId,
                    type: "tgnode",
                    position: { x: 0, y: 0 },
                    data: { value: 123 },
                  };
                  setNodes([tg]);
                }
                // console.log("clicked");

                // else{
                //   setNodes((prev)=>[...prev,emailnode])
                // }
              }}
            >
              <Background></Background>
            </ReactFlow>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
