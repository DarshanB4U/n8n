// src/components/auth/MagicLinkForm.tsx
"use client";

import React, { useState, useCallback, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { Loader2, Mail, User, ArrowRight } from "lucide-react";
import { UserContext } from "@/context/userContext";
import { Card } from "../ui/card";
import Link from "next/link";
import Image from "next/image";

type Mode = "signin" | "signup";

export default function MagicLinkForm({
  initialMode = "signin" as Mode,
}: {
  initialMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const context = useContext(UserContext);

  if (!context) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="max-w-md w-full p-6 border-red-500/20 bg-red-500/5 text-red-400">
          <p className="text-center font-medium">
            Error loading authentication context.
          </p>
        </Card>
      </div>
    );
  }

  const { user, setUser, isAuthenticated, loading, setLoading } = context;

  const toggle = () => {
    setMode((m) => (m === "signin" ? "signup" : "signin"));
    setInfo(null);
    setError(null);
  };

  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setInfo(null);
      setError(null);

      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email.");
        return;
      }

      if (mode === "signup" && name.trim().length < 2) {
        setError("Please enter your name.");
        return;
      }

      setLoading(true);
      try {
        const endpoint = mode === "signup" ? "/auth/signup" : "/auth/signin";

        await api.post(endpoint, { email, username: name });
        setInfo(
          `If that email exists, we've sent a link to ${email}. Check your inbox.`,
        );
        setEmail("");
        setName("");
      } catch (err: any) {
        setError(
          err?.response?.data?.msg || "Failed to send link. Try again later.",
        );
      } finally {
        setLoading(false);
      }
    },
    [email, name, mode, setLoading],
  );

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <Card className="max-w-md w-full p-8 bg-[#1a1c23] border-white/5 shadow-2xl text-center rounded-2xl">
          <div className="inline-flex p-3 rounded-2xl bg-[#1e3f86]/10 mb-6">
            <Image
              src="/Tasker.svg"
              alt="Tasker logo"
              className="shadow-2xl"
              width={32}
              height={32}
            />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-400 mb-8 text-sm">
            You're already signed in with your account.
          </p>
          <Link
            href="/workflow"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#1e3f86] hover:bg-[#2a56b4] text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20"
          >
            Go to Workspace <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="max-w-md w-full p-8 bg-[#1a1c23] border-white/5 shadow-2xl rounded-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#1e3f86] p-2 rounded-l-3xl rounded-r-xs shadow-xl mb-4">
            <Image
              src="/Tasker.svg"
              alt="Tasker logo"
              className="shadow-2xl"
              width={32}
              height={32}
            />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {mode === "signin" ? "Sign in to Tasker" : "Create your account"}
          </h1>
          <p className="text-gray-400 text-sm mt-2 text-center">
            {mode === "signin"
              ? "We'll send you a magic link to sign in instantly."
              : "Join our platform and start automating your workflows today."}
          </p>
        </div>

        <form onSubmit={send} className="space-y-5">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-300"
              >
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === "signup"}
                  className="pl-10 bg-[#14161a] border-white/10 text-white h-12 focus:ring-[#1e3f86]/50 focus:border-[#1e3f86]"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-300"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-[#14161a] border-white/10 text-white h-12 focus:ring-[#1e3f86]/50 focus:border-[#1e3f86]"
              />
            </div>
          </div>

          {(info || error) && (
            <div
              className={`text-sm p-3 rounded-lg border ${
                info
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {info || error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-[#c2410c] hover:bg-[#ea580c] text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-900/20"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : mode === "signin" ? (
              "Send Magic Link"
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1a1c23] px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={toggle}
            className="w-full h-12 text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 rounded-xl transition-all"
          >
            {mode === "signin" ? "Create an account" : "Sign in instead"}
          </Button>

          <p className="text-xs text-gray-500 text-center px-4 leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="#" className="underline text-gray-400 hover:text-white">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </Card>
    </div>
  );
}
