
"use client";

import type { CaseData } from "@/lib/types";
import { useState, useEffect, useMemo, useRef } from "react";
import { SuspectsPanel } from "./suspects-panel";
import { CluesPanel } from "./clues-panel";
import { ConfrontationPanel } from "./confrontation-panel";
import { DialogueModal } from "./dialogue-modal";
import { useToast } from "@/hooks/use-toast";
import { updateCaseProgress } from "@/lib/user-service";

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
  
  // Ref to track if this is the initial render
  const isInitialMount = useRef(true);

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
  
  // Save progress to Firestore whenever unlockedClues changes
  useEffect(() => {
    // We want to skip saving on the very first render,
    // as we are just setting the initial state.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Only save if there's progress to save
    if (unlockedClues.size > 0) {
      console.log("Saving progress to Firestore. Unlocked clues:", Array.from(unlockedClues));
      updateCaseProgress(caseId, Array.from(unlockedClues)).catch(error => {
        console.error("Failed to save progress:", error);
        toast({
            variant: "destructive",
            title: "Save Error",
            description: "Could not save your progress to the server."
        });
      });
    }
  }, [unlockedClues, caseId, toast]);

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
