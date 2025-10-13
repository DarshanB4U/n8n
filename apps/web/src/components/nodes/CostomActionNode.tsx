import { INode, INodeData } from "@repo/types/zodSchema";
import { Handle, Position } from "@xyflow/react";
import * as Icons from "lucide-react";
import nodeRegistery from "@/node-registry.json";
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
import { useCallback, useContext, useState } from "react";
import { workflowContext } from "@/context/workflowContext";
const nodesReg = nodeRegistery;

export function CostomAction({ id, data }: { id: string; data: INodeData }) {
  const [formvalues, setFormValues] = useState<Record<string, string>>({});
  const metaNode = nodesReg.filter((node) => node.id == data.nodeRegid);
  const node = metaNode[0];

  const IconComponent = Icons[metaNode[0]?.icon as keyof typeof Icons.icons];
  const context = useContext(workflowContext);
  if (!context) {
    return <div>Error while Loading context </div>;
  }

  const { setNodes, nodes } = context;

  // function handleSaveClick (){

    
  //   setNodes((prev)=>)
  // }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <div className="Costom_Action">
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <div
              className="flex flex-col items-center justify-center border-2 border-neutral-500
                    rounded-lg w-20 h-20  hover:text-neutral-400 bg-neutral-800  hover:border-teal-900 text-orange-400 transition"
            >
              {IconComponent && (
                <IconComponent
                  className={`w-5 h-5 text-${metaNode[0]?.IconColor}`}
                />
              )}
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            {IconComponent && (
              <IconComponent
                className={`w-5 h-5 text-${metaNode[0]?.IconColor}`}
              />
            )}

            <DialogTitle>{node?.name}</DialogTitle>
            <DialogDescription>
              {node?.Description} <h1>node id {id}</h1>{" "}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {node?.Credentials.length !== 0 && (
              <Label className="text-xl">Credentials</Label>
            )}

            {node?.Credentials?.map((Credential) => {
              return (
                <div className="grid gap-3">
                  <Label>{Credential.name}</Label>
                  <Input
                    required={Credential.required}
                    placeholder={`${Credential.name}`}
                  />
                </div>
              );
            })}
          </div>
          <div className="grid gap-4">
            {node?.parameters.length !== 0 && (
              <Label className="text-xl">Parameters</Label>
            )}

            {node?.parameters?.map((parameter) => {
              return (
                <div className="grid gap-3">
                  <Label>{parameter.displayName}</Label>
                  <Input
                    required={parameter.required}
                    placeholder={parameter.description}
                  />
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              {/* <Button variant="outline">Cancel</Button> */}
              <Button onClick={} type="submit">
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
