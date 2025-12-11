// FormBuilder.tsx
import { INodeData } from "@repo/types/zodSchema";
import { Handle, Position } from "@xyflow/react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useEffect, useState } from "react";
import { workflowContext } from "@/context/workflowContext";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectLabel,
} from "../ui/select";

type FieldType = "text" | "number" | "email";

interface FormField {
  id: string;
  title: string;
  type: FieldType;
}

export function fromTrigger({ id, data }: { id: string; data: INodeData }) {
  const context = useContext(workflowContext);
  if (!context) {
    return (
      <div className="bg-red-500 p-2">Error while Loading Workflow context</div>
    );
  }

  const { setNodes } = context;

  // initialize from node data if exists
  const initial = (data?.Form  as FormField[] | undefined) ?? [];
  const [formFields, setFormFields] = useState<FormField[]>(
    initial.length > 0 ? initial : []
  );
  const [newFieldType, setNewFieldType] = useState<FieldType>("text");

  useEffect(() => {
    // debug
    //console.log("formFields", formFields);
  }, [formFields]);

  function uid() {
    return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
  }

  function handleAddField() {
    setFormFields((prev) => [
      ...prev,
      {
        id: uid(),
        title: "untitled",
        type: newFieldType,
      },
    ]);
  }

  function handleRemoveField(fieldId: string) {
    setFormFields((prev) => prev.filter((f) => f.id !== fieldId));
  }

  function handleFieldChange(fieldId: string, patch: Partial<FormField>) {
    setFormFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, ...patch } : f))
    );
  }

  function handleSave() {
    // Persist the fields into the node's data.Parameters.formFields

    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              Form: JSON.parse(JSON.stringify(formFields)),
            },
          };
        }
        return node;
      })
    );
  }

  function handleDeleteNode() {
    setNodes((prev) => prev.filter((node) => node.id !== id));
  }

  return (
    <Dialog>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <DialogTrigger asChild>
          <div className="Costom_Action cursor-pointer">
            <Handle type="source" position={Position.Right} />
            <div
              className="flex flex-col items-center justify-center border-2 border-neutral-500
                    rounded-lg w-20 h-20 hover:text-neutral-400 bg-neutral-800 hover:border-orange-800 text-orange-400 transition"
            >
              <Icons.StickyNote className={`w-5 h-5 `} />
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[640px] w-full   ">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Icons.StickyNote className={`w-5 h-5 `} />
              <DialogTitle>Form Builder</DialogTitle>
            </div>
            <DialogDescription>
              Build a small form for this trigger node. Save will persist fields
              to node data.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Label className="min-w-[90px]">Add Field</Label>

              <div className="flex gap-2 items-center">
                <Select
                  onValueChange={(value: string) =>
                    setNewFieldType(value as FieldType)
                  }
                >
                  <SelectTrigger
                    className="w-40"
                    aria-label="Select Field Type"
                  >
                    <SelectValue placeholder="Field type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Type</SelectLabel>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Button type="button" onClick={handleAddField}>
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {formFields.length === 0 && (
                <div className="text-sm text-neutral-400">
                  No fields added yet.
                </div>
              )}

              {formFields.map((f, idx) => (
                <div
                  key={f.id}
                  className="p-3 border rounded-md bg-neutral-900 border-neutral-700"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <Label className="text-sm">Label</Label>
                        <Input
                          value={f.title}
                          onChange={(e) =>
                            handleFieldChange(f.id, { title: e.target.value })
                          }
                          className="w-60"
                        />
                      </div>

                      <div className="flex flex-col">
                        <Label className="text-sm">Type</Label>
                        <div className="px-2 py-1 border rounded-md bg-neutral-800 border-neutral-700">
                          <span className="text-sm">{f.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm text-neutral-400">#{idx + 1}</div>
                      <Button
                        variant="ghost"
                        title="Remove field"
                        onClick={() => handleRemoveField(f.id)}
                      >
                        <Icons.Trash className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive" onClick={handleDeleteNode}>
                <Icons.Trash className="w-4 h-4 mr-2" /> Delete Node
              </Button>
            </DialogClose>

            <div className="flex gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={() => {
                    handleSave();
                  }}
                >
                  Save
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
