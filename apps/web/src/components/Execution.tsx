"use client";
import api from "@/lib/api";
import { Executions } from "@repo/types/zodSchema";
import { useCallback, useEffect, useState } from "react";
import ExecutionsGlassList from "./ExecCardGlass";

export default function Execution({ WorkflowId }: { WorkflowId: string }) {
  const [executions, setExecutions] = useState<Executions>();

  const fetchExecutions = useCallback(async () => {
    const response = await api.get(`/execution/${WorkflowId}`);

    console.log(response.data);
    setExecutions(response.data);
  }, []);
  useEffect(() => {
    fetchExecutions();
  }, []);

  if (!executions || executions.length === 0) {
    return <div className="p-4  text-gray-400">No executions yet</div>;
  }
  return <ExecutionsGlassList executions={executions}> </ExecutionsGlassList>;
}
