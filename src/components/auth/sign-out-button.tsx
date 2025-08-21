
"use client";

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { signOutUser } from "@/lib/auth-service";
import { useRouter } from "next/navigation";

export function SignOutButton() {
    const router = useRouter();
    const handleSignOut = async () => {
        await signOutUser();
        router.push('/login');
    }
  return (
    <Button variant="outline" onClick={handleSignOut}>
      <LogOut className="mr-2 h-4 w-4" /> Sign Out
    </Button>
  );
}
