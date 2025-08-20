"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DialogueModalProps = {
  isOpen: boolean;
  onClose: () => void;
  characterName: string;
  response: string;
};

export function DialogueModal({ isOpen, onClose, characterName, response }: DialogueModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl text-primary">{characterName} Responds</AlertDialogTitle>
          <AlertDialogDescription className="font-body text-lg text-foreground pt-4">
            &quot;{response}&quot;
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose} className="font-headline">
            Continue Investigation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
