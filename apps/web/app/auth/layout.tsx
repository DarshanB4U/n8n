// src/app/(auth)/layout.tsx
import React from "react";

export const metadata = {
  title: "Auth",
  description: "Sign in / Sign up",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" bg-black">
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        {/* Soft decorative shapes */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-40 w-[60rem] h-[60rem] rounded-full bg-gradient-to-tr from-[#0ea5a4]/20 to-[#06b6d4]/8 blur-3xl transform rotate-12 opacity-60" />
          <div className="absolute -right-32 -bottom-44 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-[#7c3aed]/12 to-[#06b6d4]/6 blur-2xl opacity-40" />
        </div>

        <main className="w-full  min-h-3 max-w-xl p-3">{children}</main>
      </div>
    </div>
  );
}
