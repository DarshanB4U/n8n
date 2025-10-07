// // PlusNode.tsx
// import { Handle, Position } from "@xyflow/react";

// export function PlusNode({ id, data }) {
//   return (
//     <div className="relative bg-gray-800 text-white px-4 py-3 rounded-lg shadow-md">
//       {/* Node content */}
//       <div className="flex flex-col items-center">
//         <span className="text-sm">{data.label || "Node"}</span>
//       </div>

//       {/* Left Handle */}
//       <Handle type="target" position={Position.Left} className="!bg-gray-400" />

//       {/* Right Handle */}
//       <Handle type="source" position={Position.Right} className="!bg-gray-400" />

//       {/* + Button at the right edge */}
//       <button
//         onClick={() => {
//           if (data.onAdd) data.onAdd(id);
//         }}
//         className="absolute -right-4 top-1/2 -translate-y-1/2 
//                    w-6 h-6 flex items-center justify-center rounded bg-gray-700 
//                    border border-gray-400 text-white hover:bg-blue-500"
//       >
//         +
//       </button>
//     </div>
//   );
// }