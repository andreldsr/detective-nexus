"use client";

import { cn } from "@/lib/utils";
import { User as UserIcon } from "lucide-react";

export function UserBadge({ name, className }: { name: string; className?: string }) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/80 px-3 py-1.5 shadow-sm backdrop-blur",
        "hover:shadow-md transition-shadow",
        className
      )}
      title={name}
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
        {initial || <UserIcon className="h-3.5 w-3.5" />}
      </div>
      <span className="max-w-[12rem] truncate text-sm text-muted-foreground">{name}</span>
    </div>
  );
}
