import { WorkflowProivider } from "@/context/workflowContext";

import WorkflowEditor from "@/components/workflowEditor";
import Execution from "@/components/Execution";

// import { WorkflowProivider } from "@/context/workflowContext";
interface WorkflowPageProps {
  params: { id: string };
}

export default function SingleWorkflowPage({ params }: WorkflowPageProps) {
  const id = params.id;
  return (
    <WorkflowProivider>
      <div className="flex flec-col w-[calc(100vw-272px)] overflow-hidden    p-2 ">
        <div className="flex-col   justify-items-center m-2 ">
          <header className="sticky top-0 z-10 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-b flex justify-start w-full ">
            <div
              className={`mx-auto max-w-6xl px-5 py-4  flex items-center justify-between`}
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Executions
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitor your Executions.
                </p>
              </div>
            </div>
          </header>
          <Execution WorkflowId={id}></Execution>
        </div>
      </div>
    </WorkflowProivider>
  );
}
