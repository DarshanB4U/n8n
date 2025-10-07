import { WorkflowProivider } from "@/context/workflowContext";

import WorkflowEditor from "@/components/workflowEditor";

// import { WorkflowProivider } from "@/context/workflowContext";
interface WorkflowPageProps {
  params: { id: string };
}

export default function SingleWorkflowPage({ params }: WorkflowPageProps) {
  const id = params.id;
  return (
    <div>
      <WorkflowProivider>
        <h1>Workflow ID: {id}</h1>

        <WorkflowEditor></WorkflowEditor>

        {/* Render workflow editor here */}
      </WorkflowProivider>
    </div>
  );
}
