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
        <main className="w-full  min-h-3 max-w-xl p-3">{children}</main>
      </div>
    </div>
  );
}
