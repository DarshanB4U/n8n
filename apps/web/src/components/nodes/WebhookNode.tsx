import { Handle, Position } from "@xyflow/react";
import { useCallback } from "react";
import { Webhook } from "lucide-react";
export function WebhookNode(props: any) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="manualTrigger">
      <Handle type="source" position={Position.Right} />
      <div
        className="flex flex-col items-center justify-center border-2 border-gray-300 
                   rounded-tl-4xl rounded-bl-4xl w-20 h-20 text-gray-300 hover:border-teal-800 hover:text-teal-800 "
      >
        <Webhook ></Webhook>
      </div>
    </div>
  );
}
