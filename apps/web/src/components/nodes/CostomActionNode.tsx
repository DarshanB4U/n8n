import { INode, INodeData } from "@repo/types/zodSchema";
import { Handle, Position } from "@xyflow/react";
import * as icons from "lucide-react";
import nodeRegistery from "@/node-registery.json";
const nodesReg = nodeRegistery
console.log(nodesReg);

export function CostomAction({ id, data }: { id: string; data: INodeData }) {
    const icon = nodeRegistery[]
  return (
    <div className="Costom_Action">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div
        className="flex flex-col items-center justify-center border-2  hover:border-neutral-500
                    rounded-lg w-20 h-20  hover:text-neutral-400 bg-neutral-800  border-orange-800 text-orange-400 transition"
      ></div>
    </div>
  );
}
