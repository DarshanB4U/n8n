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
import { useSidebar } from "@/components/ui/sidebar";


type Credential = {
  id: string;
  title: string;
  platform?: string;
  CredentailData?: { name: string; value: string }[]; // preserving original key casing
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
};

const credentials: Credential[] = [
  {
    id: "966a9965-8a9b-4a66-9b08-1fddd23440a2",
    title: "darshan gmail bot",
    platform: "EMAIL",
    CredentailData: [
      {
        name: "Gmail-Auth",
        value: "asdfkjlkj",
      },
    ],
    createdAt: "2025-10-14T17:12:15.340Z",
    updatedAt: "2025-10-14T17:12:15.340Z",
    userId: "7726e18e-31e2-4ba5-95ed-61f9590919c5",
  },
  {
    id: "2b2b2b2b-aaaa-4a66-9b08-000000000002",
    title: "twilio sms bot",
    platform: "SMS",
    CredentailData: [
      { name: "SID", value: "ACxxxxxxxx" },
      { name: "AuthToken", value: "sk_xxx" },
    ],
    createdAt: "2025-10-10T10:00:00.000Z",
    updatedAt: "2025-10-11T11:11:11.000Z",
    userId: "7726e18e-31e2-4ba5-95ed-61f9590919c5",
  },
];

export default function CredentialsPage() {
  const { open } = useSidebar();

  return (
    <div
      className={`text-foreground flex items-center flex-col ${
        open ? "w-[calc(100vw-272px)]" : "w-screen"
      }`}
    >
      {/* Page header */}
      <header className="sticky top-0 z-10 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-b flex justify-start w-full ">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Credentials
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage API keys, tokens and other credential entries.
            </p>
          </div>

          <Button asChild>
            <Link href="/credentials/new">
              <Plus className="mr-2 h-4 w-4" />
              New credential
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-6xl px-5 py-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Your credentials</h2>
          <Separator className="mt-2" />
        </div>

        {/* Grid of credential cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((cred, idx) => (
            <Card
              key={cred.id ?? idx}
              className="group border-border transition-all hover:shadow-md hover:border-primary/40"
            >
              <CardHeader className="space-y-1">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl leading-tight">
                    {cred.title}
                  </CardTitle>
                  <PlatformBadge platform={cred.platform} />
                </div>

                {cred.CredentailData && cred.CredentailData.length ? (
                  <CardDescription>
                    {cred.CredentailData.map((f) => f.name).join(", ")}
                  </CardDescription>
                ) : (
                  <CardDescription className="text-muted-foreground">
                    No fields
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="text-sm text-muted-foreground">
                <div className="mb-2">
                  {cred.CredentailData && cred.CredentailData.length ? (
                    <ul className="list-disc ml-5">
                      {cred.CredentailData.map((field, i) => (
                        <li key={field.name + i} className="break-all">
                          <strong>{field.name}:</strong>{" "}
                          <span className="text-xs">{maskValue(field.value)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs">No credential data available.</div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span>Created: {formatDate(cred.createdAt)}</span>
                  <span>Updated: {formatDate(cred.updatedAt)}</span>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/credentials/${cred.id ?? idx}`}>
                      <Pencil className="mr-1.5 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm">
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
  );
}

/* Helpers */

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString(); // respects user's locale; change format if needed
  } catch {
    return dateStr;
  }
}

function maskValue(val?: string) {
  if (!val) return "—";
  // show first 4 chars then masked dots
  if (val.length <= 8) return val.replace(/.(?=.{2})/g, "*");
  return `${val.slice(0, 4)}…${"*".repeat(Math.min(8, val.length - 6))}`;
}

function PlatformBadge({ platform }: { platform?: string }) {
  if (!platform)
    return <Badge variant="secondary">Unknown</Badge>;

  const p = platform.toUpperCase();
  const label = p === "EMAIL" ? "Email" : p === "SMS" ? "SMS" : p;
  // choose simple variants; adjust to match your design tokens
  if (p === "EMAIL") return <Badge className="bg-emerald-600 hover:bg-emerald-600">Email</Badge>;
  if (p === "SMS") return <Badge variant="outline">SMS</Badge>;
  return <Badge variant="secondary">{label}</Badge>;
}
