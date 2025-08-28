
"use client";

import type { CaseData } from "@/lib/types";
import { useState, useEffect, useMemo, useRef } from "react";
import { SuspectsPanel } from "./suspects-panel";
import { CluesPanel } from "./clues-panel";
import { ConfrontationPanel } from "./confrontation-panel";
import { DialogueModal } from "./dialogue-modal";
import { useToast } from "@/hooks/use-toast";
import { updateCaseProgress } from "@/lib/user-service";
import { useSessionUser } from "@/lib/session-client";

type DetectiveBoardProps = {
  caseId: string;
  initialCaseData: CaseData;
  initialUnlockedClueIds: string[];
  initialUnlockedCharacterIds: string[];
};

export function DetectiveBoard({ caseId, initialCaseData, initialUnlockedClueIds, initialUnlockedCharacterIds }: DetectiveBoardProps) {
  const [caseData, setCaseData] = useState(initialCaseData);
  const [unlockedClues, setUnlockedClues] = useState(new Set<string>(initialUnlockedClueIds));
  const [unlockedCharacters, setUnlockedCharacters] = useState(new Set<string>(initialUnlockedCharacterIds));
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [dialogueResult, setDialogueResult] = useState<{ characterName: string; response: string; } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  const { user } = useSessionUser();

  const unlockedCluesList = useMemo(() => {
    return caseData.clues.filter(clue => unlockedClues.has(clue.id));
  }, [unlockedClues, caseData.clues]);

  const unlockedCharactersList = useMemo(() => {
    return caseData.characters.filter(character => unlockedCharacters.has(character.id));
  }, [unlockedCharacters, caseData.characters]);


  const handleConfrontation = () => {
    if (!selectedCharacterId || !selectedClueId) {
      toast({
        variant: "destructive",
        title: "Invalid Confrontation",
        description: "Please select a suspect and a clue to confront them with.",
      });
      return;
    }

    const character = caseData.characters.find(c => c.id === selectedCharacterId);
    if (!character) return;

    const dialogue = character.dialogueTree.find(d => d.clueId === selectedClueId);

    const response = dialogue?.response ?? "They have nothing to say about that.";
    setDialogueResult({ characterName: character.name, response });
    setIsModalOpen(true);
    
    if (dialogue?.updatedStatement) {
      const newStatement = dialogue.updatedStatement;
      setCaseData(prevCaseData => {
        const newCharacters = prevCaseData.characters.map(char => {
          if (char.id === selectedCharacterId) {
            return { ...char, statement: newStatement };
          }
          return char;
        });
        return { ...prevCaseData, characters: newCharacters };
      });
      toast({
        title: `${character.name}'s story changed!`,
        description: "Their official statement has been updated.",
      });
    }

    if (dialogue?.unlocksClueId) {
      const newClueId = dialogue.unlocksClueId;
      if (!unlockedClues.has(newClueId)) {
        setTimeout(() => {
          setUnlockedClues(prev => {
            const newSet = new Set(prev);
            newSet.add(newClueId);
            return newSet;
          });
          const newClue = caseData.clues.find(c => c.id === newClueId);
          toast({
            title: "New Clue Unlocked!",
            description: newClue?.title,
          });
        }, 300);
      }
    }

    if (dialogue?.unlocksCharacterId) {
      const newCharId = dialogue.unlocksCharacterId;
      if (!unlockedCharacters.has(newCharId)) {
        setTimeout(() => {
          setUnlockedCharacters(prev => {
            const newSet = new Set(prev);
            newSet.add(newCharId);
            return newSet;
          });
          const newChar = caseData.characters.find(c => c.id === newCharId);
          toast({
            title: "New Suspect Unlocked!",
            description: newChar?.name,
          });
        }, 300);
      }
    }
  };
  
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (!user) {
      return;
    }
  
    const progress = {
        unlockedClueIds: Array.from(unlockedClues),
        unlockedCharacterIds: Array.from(unlockedCharacters),
    }

    updateCaseProgress(caseId, progress, user.uid)
      .catch(error => {
        console.error("Failed to save progress:", error);
        toast({
            variant: "destructive",
            title: "Save Error",
            description: "Could not save your progress to the server."
        });
      });
  }, [unlockedClues, unlockedCharacters, caseId, user, toast]);


  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <SuspectsPanel
            characters={unlockedCharactersList}
            selectedCharacterId={selectedCharacterId}
            onSelectCharacter={setSelectedCharacterId}
          />
        </div>
        <div className="lg:col-span-1 lg:row-start-1">
           <ConfrontationPanel
            characters={unlockedCharactersList}
            unlockedClues={unlockedCluesList}
            selectedCharacterId={selectedCharacterId}
            setSelectedCharacterId={setSelectedCharacterId}
            selectedClueId={selectedClueId}
            setSelectedClueId={setSelectedClueId}
            onConfront={handleConfrontation}
          />
        </div>
        <div className="lg:col-span-1">
          <CluesPanel
            allClues={caseData.clues}
            unlockedClueIds={unlockedClues}
            selectedClueId={selectedClueId}
            onSelectClue={setSelectedClueId}
          />
        </div>
      </div>
      {dialogueResult && (
        <DialogueModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          characterName={dialogueResult.characterName}
          response={dialogueResult.response}
        />
      )}
    </>
  );
}
