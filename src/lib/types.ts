import { z } from 'zod';

export const ClueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().url(),
  imageHint: z.string(),
});
export type Clue = z.infer<typeof ClueSchema>;

export const DialogueSchema = z.object({
  clueId: z.string(),
  response: z.string(),
  unlocksClueId: z.string().optional(),
});
export type Dialogue = z.infer<typeof DialogueSchema>;

export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().url(),
  imageHint: z.string(),
  dialogueTree: z.array(DialogueSchema),
});
export type Character = z.infer<typeof CharacterSchema>;

export const CaseDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  characters: z.array(CharacterSchema),
  clues: z.array(ClueSchema),
  startingClueIds: z.array(z.string()),
});
export type CaseData = z.infer<typeof CaseDataSchema>;
