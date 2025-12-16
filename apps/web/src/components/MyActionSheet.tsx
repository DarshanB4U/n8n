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
import * as Icons from "lucide-react";
import { toast } from "sonner";

//currenty not in use
import { Button } from "@/components/ui/button";
import { ActionNodetype, INode } from "@repo/types/zodSchema";
import { workflowContext } from "@/context/workflowContext";
import { nanoid } from "nanoid";
import noderegistery from "@/node-registry.json";
const nodesReg = noderegistery;

export default function MyActionSheet() {
  const context = useContext(workflowContext);
  if (!context) {
    return (
      <div className="bg-red-500">error while loading wokdlow context</div>
    );
  }
  const { setNodes } = context;
  // const [open, setOpen] = useState(false);

  const AddNode = (regId: number) => {
    setNodes((prev) => [
      ...prev,
      {
        id: nanoid(5),
        type: "Action",
        position: { x: Math.random() * 200, y: Math.random() * 200 },
        data: {
          nodeRegid: regId,
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
    toast.success("New Action Added");
  };

  // const [selected, setSelected] = useState<ActionType | null>(null);

  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <div>
            <div className="m-10">
              <div
                className="flex flex-col items-center justify-center border-3    hover: border-gray-500 
                   rounded-lg w-15 h-15 text-teal-500 hover:border-blue-400 transition"
              >
                <span className="text-4xl font-bold">+</span>
                <span></span>
              </div>

              <p className="text-gray-300 mt-2 text-sm font-bold text-center">
                Actions
              </p>
            </div>
          </div>
        </SheetTrigger>
        <SheetContent className="bg-[#14161a]">
          <SheetHeader>
            <SheetTitle>Select an Action</SheetTitle>
          </SheetHeader>
          {nodesReg.map((node) => {
            const IconComponent = Icons[node.icon as keyof typeof Icons.icons];
            return (
              <div className="px-4" key={node.id}>
                <div className="space-y-3">
                  <button
                    className="w-full flex items-center gap-3 p-3 border rounded hover:bg-neutral-600"
                    onClick={() => AddNode(node.id)}
                  >
                    {IconComponent && (
                      <IconComponent
                        className={`w-5 h-5 text-${node.IconColor}`}
                      />
                    )}
                    <span>{node.name}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </SheetContent>
      </Sheet>
    </div>
  );
}
