
"use client";

import type { Clue } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { FileScan, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

type CluesPanelProps = {
  allClues: Clue[];
  unlockedClueIds: Set<string>;
  selectedClueId: string | null;
  onSelectClue: (id: string) => void;
};

export function CluesPanel({ allClues, unlockedClueIds, selectedClueId, onSelectClue }: CluesPanelProps) {
  const unlockedClues = allClues.filter(clue => unlockedClueIds.has(clue.id));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-2">
        <FileScan className="w-6 h-6 text-primary" />
        <CardTitle className="font-headline text-2xl">Unlocked Clues</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {unlockedClues.length > 0 ? (
              unlockedClues.map((clue) => (
                <Card 
                  key={clue.id} 
                  className="overflow-hidden animate-in fade-in duration-500 p-3 transition-all data-[selected=true]:ring-2 data-[selected=true]:ring-primary"
                  data-selected={selectedClueId === clue.id}
                  onClick={() => onSelectClue(clue.id)}
                >
                  <div className="cursor-pointer">
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="font-headline text-xl flex justify-between items-center">
                        {clue.title}
                        {selectedClueId === clue.id && <Badge variant="outline">Selected</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="relative cursor-pointer group bg-muted rounded-md">
                            <Image
                              src={clue.image}
                              alt={`Evidence: ${clue.title}`}
                              width={600}
                              height={400}
                              className="rounded-md w-full h-48 object-contain transition-all group-hover:brightness-75"
                              data-ai-hint={clue.imageHint}
                              onClick={(e) => e.stopPropagation()} // Prevent card click from firing
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ZoomIn className="w-12 h-12 text-white" />
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl">
                          <DialogHeader>
                            <DialogTitle className="font-headline">{clue.title}</DialogTitle>
                          </DialogHeader>
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
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No clues unlocked yet. Start by interrogating the suspects.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
