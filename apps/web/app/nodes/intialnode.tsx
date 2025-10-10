// import { useCallback, useState } from "react";
// import { Icon, Webhook ,MousePointerClick} from "lucide-react";

// function TriggerModal() {
//   return (
//     <div>
//       Trigger Modal Content
//       <div>manual <MousePointerClick/></div>
//       <div className="flex p-1">
//         webhook
//         <span>
//           <Webhook />
//         </span>
//       </div>
//     </div>
//   );
// }

// export function InitialNode(props: any) {
//   const [trigModalOpen, setTriggermodalOpen] = useState(false);

//   const handleOpenModal = useCallback(() => {
//     setTriggermodalOpen(true);
//   }, []);

//   return (
//     <div>
//       {trigModalOpen ? (
//         <TriggerModal />
//       ) : (
//         <div className="initial-node ">
//           <div className="nodrag">
//             <button
//               className="flex flex-col items-center justify-center border-2 border-dashed border-gray-500 
//                    rounded-lg w-20 h-20 text-gray-300 hover:border-blue-400 hover:text-blue-400 transition"
//               // Add the click handler to open the modal
//               onClick={handleOpenModal}
//             >
//               <span className="text-3xl">+</span>
//             </button>
//             <p className="text-gray-300 mt-2 text-sm text-center">
//               Add Trigger
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
