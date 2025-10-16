// src/context/UserContext.tsx
"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { ICredentials } from "@repo/types/zodSchema";

export interface CredentialContextType {
  credentials: ICredentials[] | null;
  fetchCredentials: () => Promise<void>;
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
  const [credentials, setCredentials] = useState<ICredentials[] | null>(null);

  const fetchCredentials = useCallback(async () => {
    try {
      const res = await api.post("/credentials"); // or your user endpoint

      setCredentials(res.data.credentials);
    } catch {
      setCredentials(null);
    } finally {
    }
  }, []);

  useEffect(() => {
    fetchCredentials(); // auto- on mount
    console.log(credentials);
  }, [fetchCredentials]);
  return (
    <CredentialContext.Provider value={{ credentials, fetchCredentials }}>
      {children}
    </CredentialContext.Provider>
  );
};
