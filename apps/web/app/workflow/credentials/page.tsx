"use client";
import React, { useContext, useEffect, useState } from "react";
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

export default function CredentialPage() {
  const CredContext = useContext(CredentialContext);
  const { open } = useSidebar();
  if (!CredContext) return <div>error while loading CredContext</div>;

  const { credentials, deleteCredentials, createCredential } = CredContext as any;

  useEffect(() => {
    console.log("credential", credentials);
  }, [credentials]);

  // Create form state
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [fields, setFields] = useState<Array<{ name: string; value: string }>>([
    { name: "", value: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function addField() {
    setFields((s) => [...s, { name: "", value: "" }]);
  }
  function removeField(idx: number) {
    setFields((s) => s.filter((_, i) => i !== idx));
  }
  function updateField(idx: number, key: "name" | "value", val: string) {
    setFields((s) => s.map((f, i) => (i === idx ? { ...f, [key]: val } : f)));
  }

  async function handleCreate(e?: React.FormEvent) {
    e?.preventDefault();
    // basic validation
    if (!title.trim()) return alert("Please provide a title");
    setIsSubmitting(true);
    const payload = {
      title: title.trim(),
      platform: platform.trim() || "UNKNOWN",
      credentialData: fields.filter((f) => f.name.trim()).map((f) => ({ name: f.name.trim(), value: f.value })),
    };

    try {
      if (typeof createCredential === "function") {
        await createCredential(payload);
      } else {
        // Fallback: optimistic local push if context doesn't provide a create function
        console.warn("createCredential not provided by context — pushing locally (not persisted)");
        // generate a temporary id
        const temp = { id: `temp-${Date.now()}`, ...payload };
        // mutate credentials if writable (best-effort)
        try {
          (credentials as any)?.push?.(temp);
        } catch (err) {
          /* ignore */
        }
      }

      // reset and close
      setTitle("");
      setPlatform("");
      setFields([{ name: "", value: "" }]);
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create credential");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className={`min-h-screen flex items-start bg-neutral-950 text-foreground overflow-auto py-12 px-6 ${
        open ? "w-[calc(100vw-272px)]" : "w-screen"
      }`}
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* header / minimal toolbar area */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-100">My Credentials</h2>
            <p className="text-sm text-neutral-400 mt-1">Securely stored — click any card to view details</p>
          </div>

          {/* Create button */}
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-100 hover:bg-neutral-900/60"
              onClick={() => setShowCreate(true)}
            >
              + Create
            </button>
          </div>
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
                    className="w-full max-w-[20rem] text-left rounded-2xl p-4 bg-neutral-900/60
                               border border-neutral-800 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-150
                               outline-none focus:ring-2 focus:ring-neutral-600/40"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-neutral-100 truncate">{c.title}</h3>
                        <div className="text-xs text-neutral-400 mt-1">{c.platform}</div>
                      </div>

                      <div className="ml-3 flex-shrink-0">
                        <div className="h-8 w-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-200 font-semibold">
                          {c.title?.split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
                        </div>
                      </div>
                    </div>

                    {/* preview of first field(s) */}
                    <div className="mt-3">
                      {itemFields.length > 0 ? (
                        <div className="text-sm text-neutral-300 truncate">
                          <span className="font-medium text-neutral-200">{itemFields[0].name}:</span>{" "}
                          <span className="opacity-85 truncate max-w-[12rem] inline-block">{itemFields[0].value}</span>
                          {itemFields.length > 1 ? <span className="text-neutral-400 ml-2">• {itemFields.length - 1} more</span> : null}
                        </div>
                      ) : (
                        <div className="text-sm text-neutral-500">No credentials</div>
                      )}
                    </div>
                  </button>
                </DialogTrigger>

                <DialogContent className="max-w-md w-full rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-neutral-100">{c.title}</DialogTitle>
                    <DialogDescription className="text-sm text-neutral-400">
                      Platform: <span className="font-medium text-neutral-200">{c.platform}</span>
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
                            <div className="text-sm font-medium text-neutral-100">{d.name}</div>
                            <div className="text-xs text-neutral-400 truncate max-w-[22rem]">{d.value}</div>
                          </div>

                          <div className="ml-4 flex gap-2">
                            <button
                              className="px-2 py-1 rounded-md text-xs border border-neutral-700 text-neutral-200 hover:bg-neutral-800/40"
                              onClick={() => navigator.clipboard?.writeText(d.value)}
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-neutral-500">No credential values available.</div>
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

        {/* Create modal (uses same Dialog primitives for consistency) */}
        <Dialog open={showCreate} onOpenChange={(v) => setShowCreate(v)}>
          <DialogContent className="max-w-md w-full rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-neutral-100">Create Credential</DialogTitle>
              <DialogDescription className="text-sm text-neutral-400">Add a credential and the fields it needs.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <label className="text-xs text-neutral-400">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-neutral-100"
                  placeholder="e.g. darshan gmail bot"
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <label className="text-xs text-neutral-400">Platform</label>
                <input
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-neutral-100"
                  placeholder="e.g. EMAIL"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-neutral-400">Fields</label>
                  <button type="button" onClick={addField} className="text-xs text-neutral-200 underline">Add field</button>
                </div>

                <div className="mt-2 space-y-2">
                  {fields.map((f, idx) => (
                    <div key={`f-${idx}`} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        value={f.name}
                        onChange={(e) => updateField(idx, "name", e.target.value)}
                        className="col-span-5 rounded-md bg-neutral-800 border border-neutral-700 px-2 py-2 text-neutral-100"
                        placeholder="name (e.g. Gmail-Auth)"
                      />
                      <input
                        value={f.value}
                        onChange={(e) => updateField(idx, "value", e.target.value)}
                        className="col-span-6 rounded-md bg-neutral-800 border border-neutral-700 px-2 py-2 text-neutral-100"
                        placeholder="value"
                      />
                      <button type="button" onClick={() => removeField(idx)} className="col-span-1 text-xs text-red-400">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="px-3 py-2 rounded-md border border-neutral-700 text-neutral-200 hover:bg-neutral-800/40"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-100 hover:bg-neutral-900/60"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
