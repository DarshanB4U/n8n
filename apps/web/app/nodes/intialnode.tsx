import { useCallback } from "react";

export function InitialNode(props:any) {
  const onChange = useCallback((evt:any) => {
    console.log(evt.target.value);
  }, []);
   


  return (
    <div className="initial-node ">
      <div className="nodrag">
        
         <button
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-500 
                   rounded-lg w-20 h-20 text-gray-300 hover:border-blue-400 hover:text-blue-400 transition"
            >
              <span className="text-3xl">+</span>
            </button>
            <p className="text-gray-300 mt-2 text-sm text-center">
              Add first step...
            </p>
      </div>
    </div>
  );
}