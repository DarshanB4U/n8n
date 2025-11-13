"use client";

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
import { Plus, Pencil, Trash2 } from "lucide-react";
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

// const mockWorkflows: workflow[] = [
//   {
//     id: "1",
//     title: "Welcome Email Funnel",
//     description: "Sends a welcome email + Telegram ping on signup.",
//     isActive: false,
//     enabled: false,
//   },
// ];

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

  async function handleClickDelete(id: string) {
    const res = await api.delete(`/workflow/${id}`);
    // console.log(res.data.workflow.title);
    toast.success(`Deleted ${res.data.workflow.title}`);
    fetchWorkflows();
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
      <SidebarTrigger className="bg-teal-900" />
      <div
        className={` text-foreground  flex items-center flex-col  ${open ? "w-[calc(100vw-272px)]" : "w-screen"}`}
      >
        {/* Page header */}
        <header className="sticky top-0 z-10 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-b flex justify-start w-full ">
          <div
            className={`mx-auto max-w-6xl px-5 py-4  flex items-center justify-between`}
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                All Workflows
              </h1>
              <p className="text-sm text-muted-foreground">
                Create, manage, and monitor your automation workflows.
              </p>
            </div>
            <Button asChild onClick={handleCreateWorkflow}>
              <div className=" flex  justify-items-center">
                <Plus className="mr-2 h-4 w-4" />
                New workflow
              </div>
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 py-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Your workflows</h2>
            <Separator className="mt-2" />
          </div>

          {/* Grid of workflow cards */}
          <div className="grid gap-4  sm:grid-cols-2 lg:grid-cols-3">
            {workflows.map((wf) => (
              <Card
                key={wf.id}
                className="group border-border transition-all hover:shadow-md hover:border-primary/40"
              >
                <CardHeader className="space-y-1">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl leading-tight">
                      {wf.title}
                    </CardTitle>
                    {/* <StatusBadge status={wf.status} /> */}
                  </div>
                  {wf.description ? (
                    <CardDescription>{wf.description}</CardDescription>
                  ) : null}
                </CardHeader>

                <CardFooter className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" asChild>
                      <Link href={`/workflow/${wf.id}`}>
                        <Pencil className="mr-1.5 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      onClick={() => handleClickDelete(wf.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
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
