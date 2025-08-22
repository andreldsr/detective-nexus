
"use client";

import { useUser } from "@/lib/auth-service";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return;
    }
    
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
    
    if (user && isAuthPage) {
      router.push("/");
    } else if (!user && !isAuthPage) {
      router.push("/login");
    }

  }, [user, loading, router, pathname]);

  // While firebase is checking auth, show a skeleton loader
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
  
  // Don't render protected pages if user is not logged in to prevent flashes of content
  if (!user && !isAuthPage) {
    return null; 
  }

  // Don't render auth pages if user is logged in
  if (user && isAuthPage) {
    return null;
  }

  return <>{children}</>;
}
