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
import { Mail, MessageCircle, Link } from "lucide-react";
import { ActionNodetype, INode } from "@repo/types/zodSchema";
import { workflowContext } from "@/context/workflowContext";
import { nanoid } from "nanoid";

type ActionType = "Action_Email" | "Action_Telegram";

export default function ActionSheetWithForm() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ActionType | null>(null);

  // form state for different actions
  const [label, setLabel] = useState("");

  // email
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");

  // telegram
  const [tgChatId, setTgChatId] = useState("");
  const [tgMessage, setTgMessage] = useState("");

  // http request

  const context = useContext(workflowContext);
  if (!context) {
    return <div className="text-4xl">error while for this component </div>;
  }
  const { setNodes } = context;
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // reset selection and form fields when closing
      setSelected(null);
      setLabel("");
      setEmailTo("");
      setEmailSubject("");
      setTgChatId("");
      setTgMessage("");
      // setEndpoint("");
      // setMethod("POST");
    }
  };

  const AddActionNode = (actionType: ActionType) => {
    // TODO: integrate with your node/flow creation logic
    // Example payload that you can send to parent via props or context

    const payload: INode = {
      id: nanoid(5),
      type: actionType,
      position: { x: -200, y: 200 },
      data: { parameters: {}, Credentials: {}, outPut: {} },
      measured: {},
      selected: false,
      dragging: false,
    };
    setNodes((prev) => [...prev, payload]);

    console.log("Create action node:", payload);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <div>
          <div className="m-10">
            <button
              className="flex flex-col items-center justify-center border-3    hover: border-gray-500 
                   rounded-lg w-15 h-15 text-teal-500 hover:border-blue-400 transition"
            >
              <span className="text-4xl font-bold">+</span>
              <span></span>
            </button>

            <p className="text-gray-300 mt-2 text-sm font-bold text-center">
              Actions
            </p>
          </div>
        </div>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[420px]">
        <SheetHeader className="mb-4">
          <SheetTitle>
            {selected ? `Configure ${selected}` : "Select an Action"}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4">
          {!selected && (
            <div className="space-y-3">
              <button
                className="w-full flex items-center gap-3 p-3 border rounded hover:bg-blue-50"
                onClick={() => setSelected("Action_Email")}
              >
                <Mail className="w-5 h-5 text-blue-600" />
                <span>Email</span>
              </button>

              <button
                className="w-full flex items-center gap-3 p-3 border rounded hover:bg-green-50"
                onClick={() => setSelected("Action_Telegram")}
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span>Telegram</span>
              </button>

              {/* <button
                className="w-full flex items-center gap-3 p-3 border rounded hover:bg-amber-50"
                onClick={() => setSelected("http")}
              >
                <Link className="w-5 h-5 text-amber-600" />
                <span>HTTP Request</span>
              </button> */}
            </div>
          )}

          {selected === "Action_Email" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Label</label>
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  type="text"
                  placeholder="Enter action label"
                  className="mt-1 block w-full border rounded px-2 py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">To</label>
                <input
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  type="email"
                  placeholder="recipient@example.com"
                  className="mt-1 block w-full border rounded px-2 py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Subject</label>
                <input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  type="text"
                  placeholder="Subject"
                  className="mt-1 block w-full border rounded px-2 py-1"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Back
                </Button>
                <Button
                  onClick={() => {
                    AddActionNode(ActionNodetype.emailAction);
                    setOpen(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          {selected === "Action_Telegram" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Label</label>
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  type="text"
                  placeholder="Enter action label"
                  className="mt-1 block w-full border rounded px-2 py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Chat ID</label>
                <input
                  value={tgChatId}
                  onChange={(e) => setTgChatId(e.target.value)}
                  type="text"
                  placeholder="123456789"
                  className="mt-1 block w-full border rounded px-2 py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  value={tgMessage}
                  onChange={(e) => setTgMessage(e.target.value)}
                  placeholder="Message to send"
                  className="mt-1 block w-full border rounded px-2 py-1"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Back
                </Button>
                <Button
                  onClick={() => {
                    AddActionNode("Action_Telegram");
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
