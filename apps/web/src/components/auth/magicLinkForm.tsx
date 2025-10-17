// src/components/auth/MagicLinkForm.tsx
"use client";

import React, { useState, useCallback, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { Loader2, Mail, User } from "lucide-react";
import { UserContext } from "@/context/userContext";
import { Card } from "../ui/card";
import Link from "next/link";

type Mode = "signin" | "signup";

export default function MagicLinkForm({
  initialMode = "signin" as Mode,
}: {
  initialMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  //   const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const context = useContext(UserContext);
  if (!context) {
    return (
      <div className=" p-5 flex justify-items-center m2">
        <Card className="text-2xl p-5 text-red-400">
          s Error While Loading UserContext
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
        const endpoint =
          mode === "signup" ? "/auth/signup" : "/auth/magic-link";

        await api.post(endpoint, { email, username: name });
        setInfo(
          `If that email exists, we've sent a link to ${email}. Check your inbox or spam.`
        );
        setEmail("");
        setName("");
      } catch (err: any) {
        setError(
          err?.response?.data?.msg || "Failed to send link. Try again later."
        );
      } finally {
        setLoading(false);
      }
    },
    [email, name, mode]
  );

  return (
    <div>
      {isAuthenticated ? (
        <div className="flex items-center justify-center min-h-[60vh] ">
          <Card className="p-6 border border-[#f0d6b4] rounded-xl text-center  shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-50 tracking-tight">
              Already Logged In
            </h2>
            <p className="text-neutral-400 mt-2 mb-4 text-sm">
              You’re already signed in. Continue to your workspace.
            </p>
            <Link
              href="/workflow"
              className="inline-block text-orange-600 text-sm font-medium hover:text-blue-900 underline-offset-2 hover:underline transition-all"
            >
              Go to Home →
            </Link>
          </Card>
        </div>
      ) : (
        <form
          onSubmit={send}
          className="space-y-6 p-5 border-1 border-zinc-50 border-dotted shadow-3xl "
        >
          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-sm text-slate-200">
              Email
            </Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-orange-600" />
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-[#061422] border border-white/6 text-slate-100 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Name Field (only for signup) */}
          {mode === "signup" && (
            <div>
              <Label htmlFor="name" className="text-sm text-slate-200">
                Name
              </Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-orange-600" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === "signup"}
                  className="pl-10 bg-[#061422] border border-white/6 text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </div>
          )}

          {/* Messages */}
          {info && <div className="text-sm text-emerald-300">{info}</div>}
          {error && <div className="text-sm text-rose-400">{error}</div>}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-5">
            <Button
              type="submit"
              className="flex-1 bg-orange-700 hover:bg-amber-800 font-bold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : mode === "signin" ? (
                "Send Sign-in Link"
              ) : (
                "Send Sign-up Link"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={toggle}
              className="text-slate-200 border border-white/6 hover:bg-white/10 hover:text-slate-100"
            >
              {mode === "signin" ? "Create account" : "Sign in instead"}
            </Button>
          </div>

          <p className="text-xs text-slate-400">
            By continuing you agree to our{" "}
            <span className="underline cursor-pointer">Terms & Privacy</span>.
          </p>
        </form>
      )}
    </div>
  );
}
