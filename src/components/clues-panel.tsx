"use client";

import { useState } from "react";
import type { Clue } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { FileScan, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type CluesPanelProps = {
  allClues: Clue[];
  unlockedClueIds: Set<string>;
};

export function CluesPanel({ allClues, unlockedClueIds }: CluesPanelProps) {
  const unlockedClues = allClues.filter(clue => unlockedClueIds.has(clue.id));

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <FileScan className="w-6 h-6 text-primary" />
        <CardTitle className="font-headline text-2xl">Unlocked Clues</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {unlockedClues.length > 0 ? (
            unlockedClues.map((clue) => (
              <Card key={clue.id} className="overflow-hidden animate-in fade-in duration-500">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">{clue.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative cursor-pointer group">
                        <Image
                          src={clue.image}
                          alt={`Evidence: ${clue.title}`}
                          width={600}
                          height={400}
                          className="rounded-md w-full object-cover transition-all group-hover:brightness-75"
                          data-ai-hint={clue.imageHint}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ZoomIn className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                       <Image
                          src={clue.image}
                          alt={`Evidence: ${clue.title}`}
                          width={1200}
                          height={800}
                          className="rounded-md w-full object-contain"
                        />
                    </DialogContent>
                  </Dialog>
                  <CardDescription className="font-body text-base">{clue.description}</CardDescription>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No clues unlocked yet. Start by interrogating the suspects.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
