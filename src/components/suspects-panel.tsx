
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
import { ScrollArea } from "./ui/scroll-area";

type SuspectsPanelProps = {
  characters: Character[];
  selectedCharacterId: string | null;
  onSelectCharacter: (id: string) => void;
};

export function SuspectsPanel({ characters, selectedCharacterId, onSelectCharacter }: SuspectsPanelProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-2">
        <UsersRound className="w-6 h-6 text-primary" />
        <CardTitle className="font-headline text-2xl">Suspects</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-2">
            {characters.map((character) => (
              <Dialog key={character.id}>
                <Card
                  className="p-3 transition-all data-[selected=true]:ring-2 data-[selected=true]:ring-primary animate-in fade-in duration-500"
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
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <Image
                          src={character.image}
                          alt={`Portrait of ${character.name}`}
                          width={100}
                          height={100}
                          className="rounded-md border-2 border-primary/50"
                          data-ai-hint={character.imageHint}
                        />
                        <div className="flex-1">
                          <DialogTitle className="font-headline text-2xl text-primary mb-1">Official Statement: {character.name}</DialogTitle>
                          {character.statementTimestamp && (
                            <p className="text-sm text-muted-foreground">{`Taken: ${character.statementTimestamp}`}</p>
                          )}
                        </div>
                      </div>
                       <DialogDescription as="div" className="font-body text-base text-foreground pt-4">
                        <div className="italic">&quot;{character.statement}&quot;</div>
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
