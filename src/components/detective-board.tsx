"use client";

import type { CaseData } from "@/lib/types";
import { useState, useEffect, useMemo } from "react";
import { SuspectsPanel } from "./suspects-panel";
import { CluesPanel } from "./clues-panel";
import { ConfrontationPanel } from "./confrontation-panel";
import { DialogueModal } from "./dialogue-modal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { generateImagesForCase } from "@/ai/flows/image-generation-flow";
import { Loader } from "lucide-react";

type DetectiveBoardProps = {
  initialCaseData: CaseData;
};

export function DetectiveBoard({ initialCaseData }: DetectiveBoardProps) {
  const [caseData, setCaseData] = useState(initialCaseData);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [unlockedClues, setUnlockedClues] = useState(new Set<string>(caseData.startingClueIds));
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [dialogueResult, setDialogueResult] = useState<{ characterName: string; response: string; } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const unlockedCluesList = useMemo(() => {
    return caseData.clues.filter(clue => unlockedClues.has(clue.id));
  }, [unlockedClues, caseData.clues]);

  const handleGenerateImages = async () => {
    setIsGeneratingImages(true);
    try {
      const updatedCaseData = await generateImagesForCase(caseData);
      setCaseData(updatedCaseData);
      toast({
        title: "Images Generated",
        description: "The suspect and clue images have been updated.",
      });
    } catch (error) {
      console.error("Failed to generate images:", error);
      toast({
        variant: "destructive",
        title: "Image Generation Failed",
        description: "Could not generate new images. Please try again later.",
      });
    } finally {
      setIsGeneratingImages(false);
    }
  };

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
  
  // Simulate saving progress to Firestore
  useEffect(() => {
    if(unlockedClues.size > caseData.startingClueIds.length) {
      console.log("Progress updated. Unlocked clues:", Array.from(unlockedClues));
    }
  }, [unlockedClues, caseData.startingClueIds.length]);

  return (
    <>
      <div className="flex justify-center mb-6">
        <Button onClick={handleGenerateImages} disabled={isGeneratingImages}>
          {isGeneratingImages ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Generating Images...
            </>
          ) : (
            "Generate Images"
          )}
        </Button>
      </div>
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
          <CluesPanel allClues={caseData.clues} unlockedClueIds={unlockedClues} />
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
