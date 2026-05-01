"use client";

import { useAuth } from "@clerk/nextjs";

export function Show({
  when,
  children
}: {
  when: "signed-in" | "signed-out";
  children: React.ReactNode;
}) {
  const { isSignedIn } = useAuth();
  if (when === "signed-in") return isSignedIn ? <>{children}</> : null;
  return !isSignedIn ? <>{children}</> : null;
}
