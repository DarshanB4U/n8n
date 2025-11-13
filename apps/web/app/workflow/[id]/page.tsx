import { WorkflowProivider } from "@/context/workflowContext";

import WorkflowEditor from "@/components/workflowEditor";
import { SidebarTrigger } from "@/components/ui/sidebar";

// import { WorkflowProivider } from "@/context/workflowContext";
interface WorkflowPageProps {
  params: { id: string };
}

export default function SingleWorkflowPage({ params }: WorkflowPageProps) {
  const id = params.id;
  return (
    <div>
      <WorkflowProivider>
        {/* <SidebarTrigger className="bg-teal-900" /> */}
        <div className="flex-col">
          <WorkflowEditor workflowId={id}></WorkflowEditor>
        </div>
        {/* Render workflow editor here */}
      </WorkflowProivider>
    </div>
  );
}
