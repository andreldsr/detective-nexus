"use client";

import type { Character } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { UsersRound, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

type SuspectsPanelProps = {
  characters: Character[];
  selectedCharacterId: string | null;
  onSelectCharacter: (id: string) => void;
};

export function SuspectsPanel({ characters, selectedCharacterId, onSelectCharacter }: SuspectsPanelProps) {
  // Find the initial statement for each character, which we assume is tied to the first clue.
  const getInitialStatement = (character: Character) => {
    // A character might not have a dialogue for the initial clue.
    const initialDialogue = character.dialogueTree.find(d => d.clueId === 'note');
    return initialDialogue?.response ?? "I have nothing to say.";
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <UsersRound className="w-6 h-6 text-primary" />
        <CardTitle className="font-headline text-2xl">Suspects</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full space-y-2">
          {characters.map((character) => (
            <Card
              key={character.id}
              onClick={() => onSelectCharacter(character.id)}
              className="p-3 cursor-pointer transition-all hover:bg-primary/10 data-[selected=true]:ring-2 data-[selected=true]:ring-primary"
              data-selected={selectedCharacterId === character.id}
            >
              <div className="flex items-center gap-4">
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
               <AccordionItem value={character.id} className="border-b-0 mt-2">
                  <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline [&[data-state=open]>svg]:rotate-180">
                    View Statement
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 text-base">
                    &quot;{getInitialStatement(character)}&quot;
                  </AccordionContent>
                </AccordionItem>
            </Card>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
