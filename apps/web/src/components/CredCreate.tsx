"use client";
import { EventHandler, useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import nodeRegistery from "@/node-registry.json";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { CredentialContext } from "@/context/credentialContext";
import { Credentials } from "@repo/types/zodSchema";
import { toast } from "sonner";

type platform = "TELEGRAM" | "EMAIL";

// interface credentialData {}

interface formData {
  credentialsData: Record<string, string>;
}

const CredCreate = () => {
  const nodeReg = nodeRegistery;
  const [seletedPlatform, setSelectedPlatform] = useState<platform>();
  const [formData, SetFromData] = useState<formData>();
  const [credTitle, setCredTitle] = useState<string>();

  const CredContext = useContext(CredentialContext);
  if (!CredContext) {
    return <div className="bg-red-400">error while loading CredContext</div>;
  }

  const { CreateCredential } = CredContext;

  function handleSubmit() {
    const credentialsArray = Object.entries(
      formData?.credentialsData || {}
    ).map(([name, value]) => ({ name, value }));

    const payload: Credentials = {
      platform: seletedPlatform?.toUpperCase() as platform,
      title: credTitle as string,
      credentialsData: credentialsArray,
    };
    console.log("credential data array ", credentialsArray);
    console.log("credential payload", payload);

    try {
      CreateCredential(payload);
      toast.success(`created Credential for ${seletedPlatform}`);
    } catch (error) {
      alert(error);
    }
  }

  useEffect(
    () => console.log(seletedPlatform, formData, credTitle),
    [seletedPlatform, formData, credTitle]
  );
  return (
    <div>
      <Dialog>
        <form onSubmit={handleSubmit}>
          <DialogTrigger asChild>
            <Button variant="secondary">Add Credentials</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Credentials</DialogTitle>
              <DialogDescription>
                Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="platform">Platform </Label>
                <Select
                  onValueChange={(value: platform) =>
                    setSelectedPlatform(value)
                  }
                >
                  <SelectTrigger
                    className="w-full"
                    aria-label="Select platform"
                  >
                    <SelectValue placeholder="Select Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Platform</SelectLabel>
                      {nodeReg
                        .filter((a) => a.Credentials.length > 0)
                        .map((a) => (
                          <SelectItem key={a.id} value={a.name}>
                            {a.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="grid gap-2">
                  <Label>Title</Label>

                  <div>
                    <Input
                      onChange={(e) => setCredTitle(e.target.value)}
                    ></Input>
                  </div>
                </div>
              </div>
              {nodeReg
                .find((node) => node.name == seletedPlatform)
                ?.Credentials.map((c) => {
                  return (
                    <div key={c.name} className="grid gap-2">
                      <Label>{c.name}</Label>

                      <div>
                        <Input
                          onChange={(e) =>
                            SetFromData((prev) => {
                              return {
                                ...prev,
                                credentialsData: {
                                  ...prev?.credentialsData,
                                  [c.name]: e.target.value,
                                },
                              };
                            })
                          }
                          name={c.name}
                          id={c.name}
                        ></Input>
                      </div>
                    </div>
                  );
                })}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>

              <DialogClose asChild>
                {/* no onClick here — only type="submit" so browser triggers onSubmit */}
                <Button type="submit" onClick={() => handleSubmit()}>
                  Save changes
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default CredCreate;
