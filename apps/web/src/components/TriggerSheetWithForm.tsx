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
import { MousePointerClick, Webhook } from "lucide-react";
import { workflowContext } from "@/context/workflowContext";

import { nanoid } from "nanoid";
import { TriggerNodetype } from "@repo/types/zodSchema";

type TriggerType = "Trigger_Manual" | "Trigger_Webhook";

export function TriggerSheetWithForm() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TriggerType | null>(null);
  const context = useContext(workflowContext);
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
        data: { nodeRegid: 9, Parameters: {}, Credentials: {}, outPut: {} },
        measured: {},
        selected: false,
        dragging: false,
      },
    ]);
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

      <SheetContent side="right" className="w-full sm:w-[400px]">
        <SheetHeader className="mb-4">
          <SheetTitle>
            {selected ? `Configure ${selected}` : "Select a Trigger"}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4">
          {!selected && (
            <div className="space-y-3">
              <button
                className="w-full flex items-center gap-3 p-3 border rounded hover:bg-blue-50"
                onClick={() => setSelected(TriggerNodetype.manualTrigger)}
              >
                <MousePointerClick className="w-5 h-5 text-blue-600" />
                <span>Manual Trigger</span>
              </button>

              <button
                className="w-full flex items-center gap-3 p-3 border rounded hover:bg-green-50"
                onClick={() => setSelected(TriggerNodetype.webhookTrigger)}
              >
                <Webhook className="w-5 h-5 text-green-600" />
                <span>Webhook Trigger</span>
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
              <div>
                <label className="block text-sm font-medium">
                  Endpoint URL
                </label>
                <input
                  type="text"
                  placeholder="https://your-webhook-url"
                  className="mt-1 block w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Method</label>
                <select className="mt-1 block w-full border rounded px-2 py-1">
                  <option>GET</option>
                  <option>POST</option>
                  <option>DELETE</option>
                  <option>UPDATE</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Back
                </Button>
                <Button
                  onClick={() => {
                    console.log("webhook config submitted");
                    AddTriggertNode(TriggerNodetype.webhookTrigger);
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
