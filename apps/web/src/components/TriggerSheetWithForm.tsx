// TriggerSheetWithForm.tsxf
"use client";
import React, { useContext, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MousePointerClick, StickyNote, Webhook } from "lucide-react";
import { workflowContext } from "@/context/workflowContext";

import { nanoid } from "nanoid";
import { TriggerNodetype } from "@repo/types/zodSchema";

type TriggerType = "Trigger_Manual" | "Trigger_Webhook" | "Trigger_Form";
type HttpMethod = "GET" | "POST" | "DELETE" | "PUT";

export function TriggerSheetWithForm({ WorkflowId }: { WorkflowId: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TriggerType | null>(null);
  const context = useContext(workflowContext);
  const [copied, setCopied] = useState(false);
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [webhookSecret, SetWebhookSecret] = useState<string>("");
  if (!context) {
    console.log("WorkflowContext error");
    return;
  }
  const { setNodes } = context;

  // Reset when closing
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelected(null);
    }
  };

  const AddTriggertNode = (TriggerType: TriggerType) => {
    const id = nanoid(5);
    setNodes([
      {
        id: id,
        type: TriggerType,
        position: { x: -200, y: 200 },
        data: {
          nodeRegid: 9,
          Parameters: {},
          Credentials: {},
          outPut: {},
          Form: [],
        },
        measured: {},
        selected: false,
        dragging: false,
      },
    ]);
  };

  const webhookUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${WorkflowId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <div>
          <div className="nodrag">
            <button
              className="flex flex-col items-center justify-center border-2 border-dotted border-gray-500 
                   rounded-lg w-20 h-20 text-teal-300 hover:border-blue-400 transition"
            >
              <span className="text-3xl">+</span>
            </button>
            <p className="text-gray-300 font-medium mt-2 text-sm text-center">
              Trigger
            </p>
          </div>
        </div>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[400px] bg-[#14161a]">
        <SheetHeader className="mb-4">
          <SheetTitle>
            {selected ? `Configure ${selected}` : "Select a Trigger"}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4">
          {!selected && (
            <div className="space-y-3">
              <button
                className="w-full flex items-center gap-3 p-3 border rounded hover:bg-slate-500"
                onClick={() => setSelected(TriggerNodetype.manualTrigger)}
              >
                <MousePointerClick className="w-5 h-5 text-blue-600" />
                <span>Manual Trigger</span>
              </button>

              <button
                className="w-full flex items-center gap-3 p-3 border rounded hover:bg-slate-500"
                onClick={() => setSelected(TriggerNodetype.webhookTrigger)}
              >
                <Webhook className="w-5 h-5 text-green-600" />
                <span>Webhook Trigger</span>
              </button>
              <button
                className="w-full flex items-center gap-3 p-3 border rounded hover:bg-slate-500"
                onClick={() => AddTriggertNode(TriggerNodetype.From)}
              >
                <StickyNote className="w-5 h-5 text-green-600" />
                <span>Form</span>
              </button>
            </div>
          )}

          {selected === TriggerNodetype.manualTrigger && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Label</label>
                <input
                  type="text"
                  placeholder="Enter trigger label"
                  className="mt-1 block w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Delay (ms)</label>
                <input
                  type="number"
                  placeholder="e.g. 0"
                  className="mt-1 block w-full border rounded px-2 py-1"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Back
                </Button>
                <Button
                  onClick={() => {
                    // TODO: do something with the form data
                    console.log("manual trigger config submitted");
                    const payload = AddTriggertNode(
                      TriggerNodetype.manualTrigger
                    );
                    setOpen(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          {selected === TriggerNodetype.webhookTrigger && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={webhookUrl}
                  readOnly
                  className="w-full border rounded px-2 py-1 bg-[#172433] cursor-copy"
                />

                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 px-3 py-1 border rounded bg-gray-950 hover:bg-gray-300 transition"
                >
                  {/* <Copy size={16} /> */}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium">Method</label>
                <select
                  className="mt-1 block w-full border  bg-[#172433] rounded px-2 py-1"
                  onChange={(e) => setMethod(e.target.value as HttpMethod)}
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>DELETE</option>
                  <option>PUT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Secret</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1 bg-[#172433] cursor-copy"
                  onChange={(e) => SetWebhookSecret(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Back
                </Button>
                <Button
                  onClick={() => {
                    console.log("webhook config submitted");
                    // AddTriggertNode(TriggerNodetype.webhookTrigger);
                    const id = nanoid(5);
                    setNodes([
                      {
                        id: id,
                        type: TriggerNodetype.webhookTrigger,
                        position: { x: -200, y: 200 },
                        data: {
                          nodeRegid: 9,
                          Parameters: {},
                          Credentials: {
                            method: method,
                            secret: webhookSecret,
                          },
                          outPut: {},
                          Form: [],
                        },
                        measured: {},
                        selected: false,
                        dragging: false,
                      },
                    ]);
                    setOpen(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <SheetClose asChild>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
