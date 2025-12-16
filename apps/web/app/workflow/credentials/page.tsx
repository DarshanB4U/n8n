"use client";
import React, { useContext, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CredentialContext } from "@/context/credentialContext";
import { useSidebar } from "@/components/ui/sidebar";
import CredCreate from "@/components/CredCreate";

export default function CredentialPage() {
  const CredContext = useContext(CredentialContext);
  const { open } = useSidebar();
  if (!CredContext) return <div>error while loading CredContext</div>;

  // removed createCredential-related code — only read/delete now
  const { credentials, deleteCredentials } = CredContext as any;

  useEffect(() => {
    console.log("credential", credentials);
  }, [credentials]);

  return (
    <div
      className={`min-h-screen flex items-startbg-linear-to-t from-[#17181f] to-[#202329] text-foreground overflow-auto py-12 px-6 ${
        open ? "w-[calc(100vw-272px)]" : "w-screen"
      }`}
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* header / minimal toolbar area */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-100">
              My Credentials
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Securely stored — click any card to view details
            </p>
          </div>

          {/* NOTE: Create button removed */}
          <CredCreate></CredCreate>
        </div>

        {/* grid centered cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {credentials?.map((c: any) => {
            const itemFields = c.credentialsData ?? c.credentialData ?? [];

            return (
              <Dialog key={c.id}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="w-full max-w-[20rem] text-left rounded-2xl p-4  bg-linear-to-t from-[#17181f] to-[#202329]
                               border border-neutral-800 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-150
                               outline-none focus:ring-2 focus:ring-neutral-600/40"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-neutral-100 truncate">
                          {c.title}
                        </h3>
                        <div className="text-xs text-neutral-400 mt-1">
                          {c.platform}
                        </div>
                      </div>

                      <div className="ml-3 flex-shrink-0">
                        <div className="h-8 w-8 rounded-lg bg-[#EAE0CF] flex items-center text-shadow-2xs justify-center text-black shadow-2xl font-semibold">
                          {c.title
                            ?.split(" ")
                            .map((s: string) => s[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                      </div>
                    </div>

                    {/* preview of first field(s) */}
                    <div className="mt-3">
                      {itemFields.length > 0 ? (
                        <div className="text-sm text-neutral-300 truncate">
                          <span className="font-medium text-neutral-200">
                            {itemFields[0].name}:
                          </span>{" "}
                          <span className="opacity-85 truncate max-w-[12rem] inline-block">
                            {itemFields[0].value}
                          </span>
                          {itemFields.length > 1 ? (
                            <span className="text-neutral-400 ml-2">
                              • {itemFields.length - 1} more
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <div className="text-sm text-neutral-500">
                          No credentials
                        </div>
                      )}
                    </div>
                  </button>
                </DialogTrigger>

                <DialogContent className="max-w-md w-full rounded-2xl bg-[#0F0E0E] border border-neutral-800 p-6 shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-neutral-100">
                      {c.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-neutral-400">
                      Platform:{" "}
                      <span className="font-medium text-neutral-200">
                        {c.platform}
                      </span>
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-4 space-y-3">
                    {itemFields.length > 0 ? (
                      itemFields.map((d: any, idx: number) => (
                        <div
                          key={`${d.name ?? "field"}-${idx}`}
                          className="flex items-center justify-between rounded-xl border px-3 py-2 bg-neutral-800/50 border-neutral-800"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-neutral-100">
                              {d.name}
                            </div>
                            <div className="text-xs text-neutral-400 truncate max-w-[22rem]">
                              {d.value}
                            </div>
                          </div>

                          <div className="ml-4 flex gap-2">
                            <button
                              className="px-2 py-1 rounded-md text-xs border border-neutral-700 text-neutral-200 hover:bg-neutral-800/40"
                              onClick={() =>
                                navigator.clipboard?.writeText(d.value)
                              }
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-neutral-500">
                        No credential values available.
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      className="px-3 py-1 rounded-md border bg-red-600 border-neutral-700 text-neutral-200 hover:bg-neutral-800/40"
                      onClick={() => deleteCredentials?.(c.id as string)}
                    >
                      Delete
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </div>
    </div>
  );
}
