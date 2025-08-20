"use client";

import type { Character } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { UsersRound, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

type SuspectsPanelProps = {
  characters: Character[];
  selectedCharacterId: string | null;
  onSelectCharacter: (id: string) => void;
};

export function SuspectsPanel({ characters, selectedCharacterId, onSelectCharacter }: SuspectsPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <UsersRound className="w-6 h-6 text-primary" />
        <CardTitle className="font-headline text-2xl">Suspects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {characters.map((character) => (
             <Dialog key={character.id}>
              <Card
                className="p-3 transition-all data-[selected=true]:ring-2 data-[selected=true]:ring-primary"
                data-selected={selectedCharacterId === character.id}
              >
                <div 
                  className="flex items-center gap-4 cursor-pointer" 
                  onClick={() => onSelectCharacter(character.id)}
                >
                  <Image
                      src={character.image}
                      alt={`Portrait of ${character.name}`}
                      width={60}
                      height={60}
                      className="rounded-full border-2 border-primary/50"
                      data-ai-hint={character.imageHint}
                    />
                    <div className="flex-1">
                      <p className="font-body text-lg font-semibold">{character.name}</p>
                        {selectedCharacterId === character.id && <Badge variant="outline">Selected</Badge>}
                    </div>
                </div>
                <DialogTrigger asChild>
                  <Button variant="link" className="mt-2 text-muted-foreground">
                    <FileText className="mr-2" />
                    View Official Statement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-headline text-2xl text-primary">Official Statement: {character.name}</DialogTitle>
                    <DialogDescription as="div" className="font-body text-base text-foreground pt-4">
                      <p className="italic">&quot;{character.statement}&quot;</p>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary" className="font-headline">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Card>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
