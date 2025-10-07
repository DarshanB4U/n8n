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
import { Plus, Pencil, Trash2, Play } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { log } from "console";

type Workflow = {
  id: string;
  title: string;
  description?: string;
  status?: "draft" | "active" | "paused";
  runs?: number;
  lastRunAt?: string;
};

const mockWorkflows: Workflow[] = [
  {
    id: "1",
    title: "Welcome Email Funnel",
    description: "Sends a welcome email + Telegram ping on signup.",
    status: "active",
    runs: 124,
    lastRunAt: "2025-10-02 14:22",
  },
  {
    id: "2",
    title: "Webhook Listener",
    description: "Captures events and pushes into queue.",
    status: "paused",
    runs: 48,
    lastRunAt: "2025-09-28 09:10",
  },
  {
    id: "3",
    title: "Webhook Listener",
    description: "Captures events and pushes into queue.",
    status: "draft",
    // runs: 48,
    lastRunAt: "2025-09-28 09:10",
  },
  {
    id: "3",
    title: "Webhook Listener",
    description: "Captures events and pushes into queue.",
    status: "draft",
    // runs: 48,
    lastRunAt: "2025-09-28 09:10",
  },
];

export default function WorkflowPage() {
  const { open } = useSidebar();
  console.log(open);
  return (
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
          <Button asChild>
            <Link href="/workflow/new">
              <Plus className="mr-2 h-4 w-4" />
              New workflow
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-6xl px-5 py-6">
        {/* Optional section title */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Your workflows</h2>
          <Separator className="mt-2" />
        </div>

        {/* Grid of workflow cards */}
        <div className="grid gap-4  sm:grid-cols-2 lg:grid-cols-3">
          {mockWorkflows.map((wf) => (
            <Card
              key={wf.id}
              className="group border-border transition-all hover:shadow-md hover:border-primary/40"
            >
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl leading-tight">
                    {wf.title}
                  </CardTitle>
                  <StatusBadge status={wf.status} />
                </div>
                {wf.description ? (
                  <CardDescription>{wf.description}</CardDescription>
                ) : null}
              </CardHeader>

              <CardContent className="text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Runs: {wf.runs ?? 0}</span>
                  <span>Last run: {wf.lastRunAt ?? "—"}</span>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/workflow/${wf.id}`}>
                      <Pencil className="mr-1.5 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    Delete
                  </Button>
                </div>

                <Button size="sm" variant="default">
                  <Play className="mr-1.5 h-4 w-4" />
                  Run
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status?: Workflow["status"] }) {
  if (status === "active")
    return (
      <Badge className="bg-emerald-600 hover:bg-emerald-600">Active</Badge>
    );
  if (status === "paused") return <Badge variant="outline">Paused</Badge>;
  return <Badge variant="secondary">Draft</Badge>;
}
