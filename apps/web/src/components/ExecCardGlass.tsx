import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Executions, IExecution } from "@repo/types/zodSchema";
import { useSidebar } from "@/components/ui/sidebar";
// Minimalistic dark glass shadcn component for executions
// Fields: id, status, nodesExecuted

type Props = React.PropsWithChildren<{
  executions: Executions;
}>;
export default function ExecutionsGlassList({ executions, children }: Props) {
  const statusStyle = {
    success: "bg-emerald-600/20 text-emerald-300 border-emerald-500/20",
    running: "bg-sky-600/20 text-sky-300 border-sky-500/20",
    failed: "bg-rose-600/20 text-rose-300 border-rose-500/20",
    stopped: "bg-yellow-600/20 text-yellow-200 border-yellow-500/20",
  };
  const { open } = useSidebar();

  return (
    <div
      className={`${open ? "w-[calc(100vw-272px)]" : "w-screen"} p-14 flex flex-col overflow-hi   m-2  justify-items-center `}
    >
      {executions.map((e) => {
        const badge =
          statusStyle[e.status] || "bg-white/10 text-gray-200 border-white/20";

        return (
          <Card
            key={e?.id as string}
            className=" w-[calc(100vw-272px)] h-22  backdrop-blur-xl   border-white/10 shadow-xl rounded-b-4xl m p-4 hover:bg-white/10 transition  m-2   "
          >
            <CardContent className="p-0 grid grid-cols-9   gap-4">
              <div className="flex  items-center justify-between col-span-1.5 mx-5">
                <div>
                  <p className="text-xs text-gray-300">Execution</p>
                  <p className="text-sm font-semibold text-gray-100 mt-1">
                    #{e.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm col-span-1 text-gray-200">
                <span className="text-md font-semibold opacity-80">
                  Nodes Executed :
                </span>
                <span className="font-semibold">{e.nodesExecuted}</span>
              </div>
              <div className="col-span- items-end">
                {" "}
                <span
                  className={`p-1 rounded-full text-xs font-medium border ${badge}`}
                >
                  {e.status}
                </span>
              </div>
              <div className="col-span-6 p-5  items-end flex ">
               
              </div>
            </CardContent>
          </Card>
        );
      })}

      {executions.length === 0 && (
        <div className="col-span-full text-center py-10 text-gray-300 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          No Executions Found
        </div>
      )}
    </div>
  );
}
