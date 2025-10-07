// AddEdgeNode.tsx
import React, { memo } from "react";
import { Handle, Position, Node } from "@xyflow/react";
import "reactflow/dist/style.css";

type AddEdgeNodeData = {
  label?: string;
  onAddNode?: (sourceId: string, position?: { x: number; y: number }) => void;
};

const AddEdgeNode = ({ id, data }: Node<AddEdgeNodeData>) => {
  const { label = "Node", onAddNode } = data ?? {};

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // avoid starting a drag on the canvas
    if (!onAddNode) return;
    // ask the parent to create a new node; parent may compute position
    onAddNode(id);
  };

  return (
    <div
      style={{
        position: "relative",
        minWidth: 160,
        minHeight: 56,
        padding: 12,
        borderRadius: 10,
        background: "#111827",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
      }}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      {/* left target handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#9ca3af", width: 10, height: 10, left: -6 }}
      />

      {/* content */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 11, opacity: 0.8 }}>{`id: ${id}`}</div>
      </div>

      {/* right handle (keeps normal edge-creation behaviour) */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#9ca3af", width: 10, height: 10, right: -6 }}
      />

      {/* square + button positioned outside right edge */}
      <button
        onClick={handleAddClick}
        title="Add node"
        aria-label="Add node"
        style={{
          position: "absolute",
          right: -26,
          top: "50%",
          transform: "translateY(-50%)",
          width: 36,
          height: 36,
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.06)",
          background: "#0b1220",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 18,
        }}
      >
        +
      </button>
    </div>
  );
};

export default memo(AddEdgeNode);
