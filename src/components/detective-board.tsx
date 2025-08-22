
"use client";

import type { CaseData } from "@/lib/types";
import { useState, useEffect, useMemo, useRef } from "react";
import { SuspectsPanel } from "./suspects-panel";
import { CluesPanel } from "./clues-panel";
import { ConfrontationPanel } from "./confrontation-panel";
import { DialogueModal } from "./dialogue-modal";
import { useToast } from "@/hooks/use-toast";
import { updateCaseProgress } from "@/lib/user-service";
import { useUser } from "@/lib/auth-service";

type DetectiveBoardProps = {
  caseId: string;
  initialCaseData: CaseData;
  initialUnlockedClueIds: string[];
};

export function DetectiveBoard({ caseId, initialCaseData, initialUnlockedClueIds }: DetectiveBoardProps) {
  const [caseData, setCaseData] = useState(initialCaseData);
  const [unlockedClues, setUnlockedClues] = useState(new Set<string>(initialUnlockedClueIds));
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [dialogueResult, setDialogueResult] = useState<{ characterName: string; response: string; } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  const { user } = useUser();

  const unlockedCluesList = useMemo(() => {
    return caseData.clues.filter(clue => unlockedClues.has(clue.id));
  }, [unlockedClues, caseData.clues]);

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
  };
  
  useEffect(() => {
    // Don't save on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Don't save if there's no user logged in
    if (!user) {
      return;
    }
  
    updateCaseProgress(caseId, Array.from(unlockedClues), user.uid)
    .catch(error => {
      console.error("Failed to save progress:", error);
      toast({
          variant: "destructive",
          title: "Save Error",
          description: "Could not save your progress to the server."
      });
    });
  }, [unlockedClues, caseId, user, toast]);


  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <SuspectsPanel
            characters={caseData.characters}
            selectedCharacterId={selectedCharacterId}
            onSelectCharacter={setSelectedCharacterId}
          />
        </div>
        <div className="lg:col-span-1 lg:row-start-1">
           <ConfrontationPanel
            characters={caseData.characters}
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
