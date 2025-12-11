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
import { useContext, useEffect, useState } from "react";
import { workflowContext } from "@/context/workflowContext";
import { CredentialContext } from "@/context/credentialContext";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectLabel,
} from "../ui/select";
const nodesReg = nodeRegistery;

export function CostomAction({ id, data }: { id: string; data: INodeData }) {
  interface form {
    Parameters: Record<string, string>;
    Credentials: Record<string, string>;
  }

  const context = useContext(workflowContext);
  if (!context) {
    return (
      <div className="bg-red-500">Error while Loading Workflowcontext </div>
    );
  }
  const CredContext = useContext(CredentialContext);
  if (!CredContext) {
    return <div className="bg-red-500">error while loading credContext </div>;
  }
  const [selectedCred, setSelectedCred] = useState<string>();
  const { credentials } = CredContext;
  const [formValues, setFormValues] = useState<form>(data);
  const metaNode = nodesReg.filter((node) => node.id == data.nodeRegid);
  const node = metaNode[0];
  const IconComponent = Icons[metaNode[0]?.icon as keyof typeof Icons.icons];

  const { setNodes, nodes } = context;
  const formNode = nodes.find((n) => n.type === "Trigger_Form");
  const formFields = formNode?.data.Form || [];
  // function handle() {
  //   setNodes((prev) =>
  //     prev.map((node) => {
  //       if (node.id === id) {
  //         return {
  //           ...node,
  //           data: {
  //             ...node.data,
  //             Credentials: formValues.Credentials,
  //             Parameters: formValues.Parameters,
  //           },
  //         };
  //       }
  //       return node;
  //     })
  //   );
  // }

  // useEffect(
  //   () => console.log(credentials, selectedCred, "selectedcredentialid "),
  //   [selectedCred]
  // );
  useEffect(() => console.log("nodes", nodes), [nodes]);

  // useEffect(() => {
  //   return console.log(
  //     "tgis is filtred node cred",
  //     credentials?.filter((c) => c.platform == node?.name.toUpperCase())
  //   );
  // });

  function handleDelete() {
    setNodes((prev) => prev.filter((node) => node.id !== id));
  }

  function handleSaveClick() {
    if (!selectedCred) {
      return alert("select credential before saving ");
    }
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              Parameters: formValues.Parameters,
              Credentials: { CredentialId: selectedCred },
            },
          };
        }
        return node;
      })
    );
  }
  // function handleInputChange(e:Event){
  //   const newvalue = e.target.value

  // }
  function handleParamInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
    paramName: string
  ) {
    // Access the input's new value
    const { value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      Parameters: {
        ...prev.Parameters,
        [paramName]: value,
      },
    }));

    // Perform actions with the new value, such as:
    // - Updating state (in React, using useState)
    // - Validating the input
    // - Displaying the value
    console.log("Input value changed to:");
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <div className="Costom_Action">
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <div
              className="flex flex-col  items-center justify-center border-2 border-neutral-500
                    rounded-lg w-20 h-20  hover:text-neutral-400 bg-neutral-800  hover:border-orange-800 text-orange-400 transition"
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
            {/* <DialogDescription>
              {node?.Description} <h1>node id {id}</h1>{" "}
            </DialogDescription> */}
          </DialogHeader>

          <div className="grid gap-4">
            {node?.Credentials.length !== 0 && (
              <Label className="text-xl">Credentials</Label>
            )}

            {/* {node?.Credentials?.map((Credential) => {
              return (
                <div className="grid gap-3">
                  <Label>{Credential.name}</Label>
                  <Input
                    required={Credential.required}
                    placeholder={`${Credential.name}`}
                  />
                </div>
              );
            })} */}

            <div className="grid gap-2">
              <Label>Credentials</Label>
              <Select onValueChange={(value: string) => setSelectedCred(value)}>
                <SelectTrigger
                  className="w-full"
                  aria-label="Select Credentials"
                >
                  <SelectValue placeholder="Select Credentials" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Credentials</SelectLabel>
                    {credentials
                      ?.filter((c) => c.platform == node?.name.toUpperCase())
                      .map((c) => {
                        if (!c.id) {
                          return <div>id not present </div>;
                        }
                        return (
                          <SelectItem key={c.id} value={c.id}>
                            {c.title}
                          </SelectItem>
                        );
                      })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4">
            {node?.parameters.length !== 0 && (
              <Label className="text-xl">Parameters</Label>
            )}

            {node?.parameters?.map((parameter) => {
              return (
                <div>
                  <div className="grid gap-3" key={parameter.name}>
                    <Label>{parameter.displayName}</Label>
                    <Input
                      required={parameter.required}
                      placeholder={`${parameter.description}`}
                      value={`${formValues.Parameters[parameter.name] || " "}`}
                      onChange={(e) =>
                        handleParamInputChange(e, parameter.name)
                      }
                      type={`${parameter.type}`}
                    />
                  </div>
                  {formFields.length > 0 && (
                    <Select
                      onValueChange={(value) =>
                        setFormValues((prev) => ({
                          ...prev,
                          Parameters: {
                            ...prev.Parameters,
                            [parameter.name]: `{{form.${value}}}`,
                          },
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Form Data" />
                      </SelectTrigger>

                      <SelectContent>
                        {formFields.map((ff) => (
                          <SelectItem key={ff.title} value={ff.id}>
                            {ff.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => handleDelete()} variant={"destructive"}>
                Delete
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleSaveClick} type="submit">
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
