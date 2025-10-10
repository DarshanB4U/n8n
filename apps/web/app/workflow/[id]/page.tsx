import { WorkflowProivider } from "@/context/workflowContext";

import WorkflowEditor from "@/components/workflowEditor";
import { useSidebar } from "@/components/ui/sidebar";

// import { WorkflowProivider } from "@/context/workflowContext";
interface WorkflowPageProps {
  params: { id: string };
}

export default function SingleWorkflowPage({ params }: WorkflowPageProps) {
  const id = params.id;
  return (
    <div>
      <WorkflowProivider>
        <div className="flex-col">
          <WorkflowEditor></WorkflowEditor>
        </div>

        {/* Render workflow editor here */}
      </WorkflowProivider>
    </div>
  );
}
