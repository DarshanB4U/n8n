import { useCallback, useState } from "react";
import { Icon, Webhook ,MousePointerClick} from "lucide-react";

export function TriggerModal() {
  return (
    <div className="p-5 bg-white rounded-2xl shadow-xl w-80 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Choose a Trigger</h2>

      <div className="space-y-3">
        {/* Manual Trigger */}
        <button
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-400 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <MousePointerClick className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
              Manual Trigger
            </span>
          </div>
          <span className="text-xs text-gray-400 group-hover:text-blue-500">→</span>
        </button>

        {/* Webhook Trigger */}
        <button
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:bg-green-50 hover:border-green-400 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Webhook className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">
              Webhook Trigger
            </span>
          </div>
          <span className="text-xs text-gray-400 group-hover:text-green-500">→</span>
        </button>
      </div>
    </div>
  );
}


export function InitialNode(props: any) {
  const [trigModalOpen, setTriggermodalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setTriggermodalOpen(true);
  }, []);

  return (
    <div>
      {trigModalOpen ? (
        <TriggerModal />
      ) : (
        <div className="initial-node ">
          <div className="nodrag">
            <button
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-500 
                   rounded-lg w-20 h-20 text-gray-300 hover:border-blue-400 hover:text-blue-400 transition"
              // Add the click handler to open the modal
              onClick={handleOpenModal}
            >
              <span className="text-3xl">+</span>
            </button>
            <p className="text-gray-300 mt-2 text-sm text-center">
              Add Trigger
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
