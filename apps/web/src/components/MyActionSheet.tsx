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

//currenty not in use
import { Button } from "@/components/ui/button";
import { ActionNodetype, INode } from "@repo/types/zodSchema";
import { workflowContext } from "@/context/workflowContext";
import { nanoid } from "nanoid";
import noderegistery from "@/node-registry.json";
const nodesReg = noderegistery;
// type ActionType = "Action_Email" | "Action_Telegram";

export default function MyActionSheet() {
  // const context = useContext(workflowContext);
  // if (!context) {
  //   return (
  //     <div className="bg-red-500">error while loading wokdlow context</div>
  //   );
  // }
  // const {setNodes} = context;

  // const AddNode = (node:)=>{
  //   setNodes((prev)=>[...prev,])
  // }
  // const [open, setOpen] = useState(false);

  // const [selected, setSelected] = useState<ActionType | null>(null);

  return (
    <div>
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Select an Action</SheetTitle>
          </SheetHeader>
          {nodesReg.map((node) => {
            const IconComponent = Icons[node.icon as keyof typeof Icons.icons];
            return (
              <div className="px-4">
                <div className="space-y-3">
                  <button
                    className="w-full flex items-center gap-3 p-3 border rounded hover:bg-neutral-600"
                    onClick={() => null}
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
      <h1>action sheet</h1>
    </div>
  );
}
