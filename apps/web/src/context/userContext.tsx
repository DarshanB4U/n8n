// src/context/UserContext.tsx
"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export interface IUser {
  id: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserContextType {
  user: IUser | null;
  loading: boolean;
  isAuthenticated: boolean;

  // Actions
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;

  // Optional actions for flexibility
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  // loginWithMagicLink?: (email: string) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me"); // or your user endpoint
      setUser(res.data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser(); // auto-load on mount
  }, [fetchUser]);

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        fetchUser,
        logout,
        setUser,
        isAuthenticated,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
