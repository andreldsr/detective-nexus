"use client";

import type { Character } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { UsersRound } from "lucide-react";

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
        <div className="grid grid-cols-1 gap-4">
          {characters.map((character) => (
            <Card
              key={character.id}
              onClick={() => onSelectCharacter(character.id)}
              className="p-3 flex items-center gap-4 cursor-pointer transition-all hover:bg-primary/10 data-[selected=true]:ring-2 data-[selected=true]:ring-primary"
              data-selected={selectedCharacterId === character.id}
            >
              <Image
                src={character.image}
                alt={`Portrait of ${character.name}`}
                width={60}
                height={60}
                className="rounded-full border-2 border-primary/50"
                data-ai-hint={character.imageHint}
              />
              <p className="font-body text-lg font-semibold">{character.name}</p>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
