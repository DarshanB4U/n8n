"use client";
import React, { MouseEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Pencil,
  Trash2,
  TableProperties,
  CircleFadingPlus,
} from "lucide-react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { Workflow, workflowBody } from "@repo/types/zodSchema";
import { useRouter } from "next/navigation";
import CreatingWorkflowLoader from "@/components/creatingWorkflowLoader";
import { toast } from "sonner";

type workflow = {
  id: string;
  title: string;
  isActive: boolean;
  description?: string;
  enabled: boolean;
};

export default function WorkflowPage() {
  const [workflows, SetWorkflows] = useState<workflow[]>([]);
  const { open } = useSidebar();
  console.log(open);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWorkflows = useCallback(async () => {
    const workflows = await api.get("/workflow");
    console.log(workflows.data);
    SetWorkflows(workflows.data);
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  async function handleClickDelete(id: string, event: React.MouseEvent) {
    event.preventDefault();
    const res = await api.delete(`/workflow/${id}`);
    // console.log(res.data.workflow.title);
    toast.success(`Deleted ${res.data.workflow.title}`);
    fetchWorkflows();
  }
  async function handleExeClick(id: string) {
    router.push(`/workflow/executions/${id}`);
  }

  async function handleCreateWorkflow() {
    setLoading(true);
    const Data = {
      title: "utitledWorfkow",
      nodes: [],
      edges: [],
    };

    try {
      const workflowRes = await api.post("/workflow/", Data);

      const id = workflowRes.data.id;
      console.log(workflowRes);

      if (!id) {
        throw console.error("error while creating workflow");
      }
      console.log(id);
      // setLoading(false);

      router.push(`/workflow/${id}`);
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <div
        className={` text-foreground  flex items-center flex-col  ${open ? "w-[calc(100vw-272px)]" : "w-screen"}`}
      >
        <CreatingWorkflowLoader></CreatingWorkflowLoader>
      </div>
    );
  }

  return (
    <div>
      <SidebarTrigger className="bg-[#213448]" />

      {/* {create workflow } */}

      <div
        className={` text-foreground  flex items-center flex-col  ${open ? "w-[calc(100vw-272px)]" : "w-screen"}`}
      >
        {/* Page header */}

        <main className="mx-auto w-full max-w-6xl px-5 py-6">
          <div className="mb-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Your workflows</h2>
              <div
                onClick={handleCreateWorkflow}
                className="bg-[#244eaa] w-12 h-12 ml-8  rounded-xl flex justify-center items-center hover:bg-blue-900"
              >
                <CircleFadingPlus size="35" />
              </div>
            </div>

            <Separator className="mt-2" />
          </div>

          {/* Grid of workflow cards */}
          <div className="grid gap-4  sm:grid-cols-2 lg:grid-cols-3 ">
            {workflows.map((wf) => (
              <div className="p-1   border-1 rounded-2xl">
                <Link href={`/workflow/${wf.id}`}>
                  <Card
                    key={wf.id}
                    className="group rounded-lg bg-linear-to-t from-[#17181f] to-[#202329] border-border transition-all hover:shadow-md hover:border-primary/40"
                  >
                    <CardHeader className="space-y-1 flex justify-between">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl leading-tight">
                          {wf.title}
                        </CardTitle>
                        {/* <StatusBadge status={wf.status} /> */}
                      </div>
                      {wf.description ? (
                        <CardDescription>{wf.description}</CardDescription>
                      ) : null}
                      <Button
                        variant="outline"
                        className="  hover:bg-neutral-700"
                        onClick={(e) => handleClickDelete(wf.id, e)}
                        size="sm"
                      >
                        <Trash2 className=" h-7 w-7 text-red-900  " />
                      </Button>
                    </CardHeader>

                    <CardFooter className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          className="bg-linear-to-t from-[#224ead] to-[#224ead]  "
                          size="sm"
                          asChild
                        ></Button>

                        <Button
                          onClick={() => handleExeClick(wf.id)}
                          variant="outline"
                          size="sm"
                        >
                          <TableProperties className="mr-1.5 h-4 w-4" />
                          Executions
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: workflow["isActive"] }) {
  if (status === true)
    return (
      <Badge className="bg-emerald-600 hover:bg-emerald-600">Active</Badge>
    );
  else return <Badge variant="outline">Paused</Badge>;
  // return <Badge variant="secondary">Draft</Badge>;
}
