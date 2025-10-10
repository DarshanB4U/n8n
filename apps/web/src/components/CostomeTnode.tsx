import { Handle, Position } from "@xyflow/react";
import { Plus } from "lucide-react";

export default   () => {
  return (
    <div className="bg-gray-800 p-4 rounded-2xl text-white relative">
      <div className="flex flex-col items-center">
        <span className="text-2xl">🖱️</span>
        <p className="text-sm mt-2">Execute Workflow</p>
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!bg-transparent w-4 h-4"
      />

      {/* Plus button next to handle */}
      <button
        onClick={() => alert("Add new node")}
        className="absolute -right-4 top-1/2 -translate-y-1/2 bg-gray-700 border border-gray-500 rounded-md w-5 h-5 flex items-center justify-center hover:bg-gray-600"
      >
        <Plus size={12} />
      </button>
    </div>
  );
};
