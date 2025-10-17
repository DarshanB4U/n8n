// src/context/UserContext.tsx
"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Credentials } from "@repo/types/zodSchema";
import { toast } from "sonner";
import { platform } from "os";
import { AxiosResponse } from "axios";

export interface CredentialContextType {
  credentials: Credentials[] | null;
  fetchCredentials: () => Promise<void>;
  deleteCredentials: (CredId: string) => Promise<void>;
  CreateCredential: (credentialData: Credentials) => Promise<void>;
  // SetCredentials: React.Dispatch<SetStateAction<ICredentials[]>>;
}

export const CredentialContext = createContext<
  CredentialContextType | undefined
>(undefined);

export const CredentialProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [credentials, setCredentials] = useState<Credentials[] | null>(null);

  const fetchCredentials = useCallback(async () => {
    try {
      const res = await api.get("/credential"); // or your user endpoint

      setCredentials(res.data.credentials);
      console.log(res.data.credentials);
    } catch {
      setCredentials(null);
    } finally {
    }
  }, []);

  const deleteCredentials = useCallback(async (CredId: string) => {
    try {
      const deletedCredential = await api.delete("/credential", {
        data: {
          credentialsId: CredId,
        },
      });
      fetchCredentials();
      toast.success(`deleted credential-${deletedCredential.data}`);
    } catch (error) {
      console.log(error);
    }
  }, []);
  const CreateCredential = useCallback(async (credentialData: Credentials) => {
    const data = credentialData;

    try {
      const CreatedCredential = await api.post<AxiosResponse<Credentials>>(
        "/",
        data
      );

      fetchCredentials();
      toast.success(`created  -${CreatedCredential.data.data.id}`);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchCredentials(); // auto- on mount
    console.log(credentials);
  }, [fetchCredentials]);
  return (
    <CredentialContext.Provider
      value={{
        credentials,
        fetchCredentials,
        deleteCredentials,
        CreateCredential,
      }}
    >
      {children}
    </CredentialContext.Provider>
  );
};
