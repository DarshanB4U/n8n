import { getIconComponent } from "@/utils/iconmap";
import { Handle, Position } from "@xyflow/react";


export function TriggerNode({ data }: any) {
  const Icon = getIconComponent(data.icon);

  return (
    <div className="p-3 border rounded-lg bg-white shadow-md w-48 text-center">
      <div className="flex flex-col items-center gap-1">
        {data.iconUrl ? (
          <img src={data.iconUrl} alt="" className="h-6 w-6" />
        ) : Icon ? (
          <Icon size={18} />
        ) : null}

        <strong className="text-sm text-blue-600">Trigger</strong>
        <div className="text-xs text-gray-600">{data.label}</div>
      </div>

      <Handle type="source" position={Position.Right} id="out" />
    </div>
  );
}
