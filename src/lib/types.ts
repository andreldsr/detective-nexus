export interface Clue {
  id: string;
  title: string;
  description:string;
  image: string;
  imageHint: string;
}

export interface Dialogue {
  clueId: string;
  response: string;
  unlocksClueId?: string;
}

export interface Character {
  id: string;
  name: string;
  image: string;
  imageHint: string;
  dialogueTree: Dialogue[];
}

export interface CaseData {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  characters: Character[];
  clues: Clue[];
  startingClueIds: string[];
}
