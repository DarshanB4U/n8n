// src/nodes/ActionNode.tsx
import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { getIconComponent } from "@/utils/iconmap";

export function ActionNode({ data }: any) {
  const Icon = getIconComponent(data.icon);
  const [FormOpen, setFormOpen] = useState(false);

  return (
    <div className="p-3 border rounded-lg bg-white shadow-md w-48 text-center">
      <div className="flex flex-col items-center gap-1">
        {data.iconUrl ? (
          <img src={data.iconUrl} alt="" className="h-6 w-6" />
        ) : Icon ? (
          <Icon size={18} />
        ) : null}

        <strong className="text-sm text-green-600">Action</strong>
        <div className="text-xs text-gray-600">{data.label}</div>
      </div>

      <Handle type="target" position={Position.Left} id="in" />
      <Handle type="source" position={Position.Right} id="out" />
    </div>
  );
}
