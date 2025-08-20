"use client";

import type { Character, Clue } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote } from "lucide-react";

type ConfrontationPanelProps = {
  characters: Character[];
  unlockedClues: Clue[];
  selectedCharacterId: string | null;
  setSelectedCharacterId: (id: string | null) => void;
  selectedClueId: string | null;
  setSelectedClueId: (id: string | null) => void;
  onConfront: () => void;
};

export function ConfrontationPanel({
  characters,
  unlockedClues,
  selectedCharacterId,
  setSelectedCharacterId,
  selectedClueId,
  setSelectedClueId,
  onConfront,
}: ConfrontationPanelProps) {
  return (
    <Card className="h-full bg-primary/5 sticky top-6">
      <CardHeader className="flex flex-row items-center gap-2">
        <MessageSquareQuote className="w-6 h-6 text-primary" />
        <CardTitle className="font-headline text-2xl">Confrontation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="font-body font-semibold text-muted-foreground">Select a Suspect</label>
          <Select
            value={selectedCharacterId ?? ""}
            onValueChange={(value) => setSelectedCharacterId(value)}
          >
            <SelectTrigger className="w-full font-body text-base">
              <SelectValue placeholder="Choose a suspect..." />
            </SelectTrigger>
            <SelectContent>
              {characters.map((character) => (
                <SelectItem key={character.id} value={character.id} className="font-body">
                  {character.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="font-body font-semibold text-muted-foreground">Present Evidence</label>
           <Select
            value={selectedClueId ?? ""}
            onValueChange={(value) => setSelectedClueId(value)}
            disabled={unlockedClues.length === 0}
          >
            <SelectTrigger className="w-full font-body text-base">
              <SelectValue placeholder="Choose a clue..." />
            </SelectTrigger>
            <SelectContent>
              {unlockedClues.map((clue) => (
                <SelectItem key={clue.id} value={clue.id} className="font-body">
                  {clue.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onConfront}
          disabled={!selectedCharacterId || !selectedClueId}
          className="w-full font-headline text-lg py-6"
        >
          Confront
        </Button>
      </CardContent>
    </Card>
  );
}
