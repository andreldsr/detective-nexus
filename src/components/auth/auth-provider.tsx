
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { useSessionUser } from "@/lib/session-client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSessionUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

    if (user && isAuthPage) {
      router.replace("/");
    } else if (!user && !isAuthPage) {
      router.replace("/login");
    }
  }, [user, loading, router, pathname]);

  // While checking cookie-backed session, show a skeleton loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

  // Prevent flashes of protected content until cookie session is present
  if (!user && !isAuthPage) {
    return null;
  }

  if (user && isAuthPage) {
    return null;
  }

  return <>{children}</>;
}
