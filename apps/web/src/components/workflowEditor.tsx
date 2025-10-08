import React, { useContext, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  Connection,
  EdgeTypes,
  Edge,
  Node

} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { workflowContext } from "@/context/workflowContext";
const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

type OnConnect = (connection: Connection) => void;

const WorkflowEditor = () => {
  const context = useContext(workflowContext);

  if (!context) {
    throw Error("cann not use eorkflow context outside workflow context ");
    return;
  }

  // const { nodes, addNode, deleteNode, removeEdge, edges } = context;
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect: OnConnect = useCallback(
    (params) =>
      setEdges((edgesSnapshot): EdgeTypes => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div>
      <div>workflowEditor </div>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          // onNodesChange={onNodesChange}
          // onEdgesChange={onEdgesChange}
          // onConnect={onConnect}
          fitView
        />
      </div>
    </div>
  );
};

export default WorkflowEditor;
