import type { CaseData } from './types';

export const caseData: CaseData = {
  title: 'The Case of the Stolen Sapphire',
  description: 'The famous "Azure Star" sapphire has been stolen from Lady Beatrice\'s private collection. The thief was swift, leaving only a few subtle clues behind. Interrogate the suspects and piece together the evidence to find the culprit.',
  difficulty: 'Medium',
  startingClueIds: ['note', 'argument', 'journal_entry'],
  startingCharacterIds: ['beatrice', 'arthur', 'clara'],
  characters: [
    {
      id: 'beatrice',
      name: 'Lady Beatrice',
      image: 'https://placehold.co/400x400.png',
      imageHint: 'aristocratic woman portrait',
      statement: 'I am the owner of the stolen "Azure Star" sapphire. I discovered it was missing this evening from my private study. The last time I saw it was yesterday afternoon. I am distraught and have no idea who would do such a thing. The note is gibberish to me.',
      statementTimestamp: 'October 26, 1948, 8:32 PM',
      dialogueTree: [
        {
          clueId: 'note',
          response: 'This note... it seems like a threat, but the handwriting is unfamiliar. I am simply devastated by the theft.',
        },
        {
          clueId: 'argument',
          response: 'Clara and I? We argue occasionally, what of it? She was upset about her wages. It has nothing to do with this terrible crime.',
        },
        {
          clueId: 'journal_entry',
          response: 'My journal? How did you get that? Yes, I was concerned about Arthur, but I never suspected he would steal from me. My niece Eleanor has also been acting strangely lately, asking for money... perhaps you should speak with her.',
          unlocksCharacterId: 'eleanor',
        }
      ],
    },
    {
      id: 'arthur',
      name: 'Arthur the Butler',
      image: 'https://placehold.co/400x400.png',
      imageHint: 'stern butler portrait',
      statement: 'I have served Lady Beatrice for fifteen years. On the evening of the theft, I was performing my usual duties, which included polishing the silver in the west wing of the manor. I remained there for the entire evening and saw nothing unusual.',
      statementTimestamp: 'October 26, 1948, 8:45 PM',
      dialogueTree: [
        {
          clueId: 'note',
          response: 'A ransom note? How gauche. I was polishing silver in the west wing all evening. I saw nothing.',
        },
        {
          clueId: 'footprint',
          response: 'Muddy shoes? Yes, I was tending to the rose bushes earlier today. The grounds are quite damp after the rain.',
          unlocksClueId: 'debt'
        },
        {
          clueId: 'debt',
          response: 'My... my debts? How did you... *sigh*. It\'s true. I owe a great deal of money. I saw the sapphire as my only way out. I took it. I was going to sell it to a collector and replace it with a fake later. The note was a diversion.',
          unlocksClueId: 'confession',
          updatedStatement: 'I confess, I stole the sapphire. My gambling debts were overwhelming, and in a moment of sheer desperation, I saw the "Azure Star" as my only escape. I took it from the study while polishing silver nearby, planning to replace it with a replica after selling the original. The note was a pathetic attempt to throw you off my trail. I am ready to face the consequences of my foolish actions.'
        },
         {
          clueId: 'torn_fabric',
          response: 'A piece of fabric? I don\'t recognize it. Perhaps it belongs to that shady art dealer, Vincent Costello. I saw him lurking around the property last week.',
          unlocksCharacterId: 'vincent',
        },
      ],
    },
    {
      id: 'clara',
      name: 'Clara the Maid',
      image: 'https://placehold.co/400x400.png',
      imageHint: 'young maid portrait',
      statement: 'I am a maid in the employment of Lady Beatrice. I spent the evening cleaning the guest quarters on the second floor. I did not enter the study where the sapphire was kept. I know nothing about the theft.',
      statementTimestamp: 'October 26, 1948, 9:01 PM',
      dialogueTree: [
        {
          clueId: 'note',
          response: 'Oh my, that\'s terrifying! I wouldn\'t know anything about it. I was cleaning the guest quarters.',
        },
        {
          clueId: 'argument',
          response: 'We were arguing, yes. But I would never steal from Lady Beatrice! I was just asking for a raise. I saw Arthur near the garden with a shovel earlier... odd, since the gardener handles that.',
          unlocksClueId: 'footprint'
        },
        {
          clueId: 'journal_entry',
          response: 'Lady Beatrice keeps a journal? I wouldn\'t know. I found a scrap of silk near the rose bushes this morning, maybe it\'s a clue?',
          unlocksClueId: 'torn_fabric',
        }
      ],
    },
    {
      id: 'vincent',
      name: 'Vincent "The Vulture" Costello',
      image: 'https://placehold.co/400x400.png',
      imageHint: 'scheming art dealer portrait',
      statement: 'The Azure Star? A beautiful piece, but hardly my most recent acquisition. I was at my own gallery opening all evening, surrounded by the city\'s elite. I have dozens of witnesses.',
      statementTimestamp: 'October 27, 1948, 10:15 AM',
      dialogueTree: [
        { clueId: 'note', response: 'Amateurish. This doesn\'t have the finesse of a professional job. It\'s almost insulting to be considered a suspect.' },
        { clueId: 'debt', response: 'Debts are for the desperate. My affairs are quite in order, I assure you.'},
        { clueId: 'argument', response: 'Beatrice and I are rivals, not enemies. Our competition is professional, never personal.'},
        { clueId: 'footprint', response: 'I wouldn\'t dream of setting my Italian leather shoes in a garden. Preposterous.'},
        { clueId: 'gallery_alibi', response: 'Ah, so you\'ve seen the papers. Yes, the opening was a smashing success. I couldn\'t possibly have been at the manor.'}
      ],
    },
    {
      id: 'eleanor',
      name: 'Eleanor Vance',
      image: 'https://placehold.co/400x400.png',
      imageHint: 'nervous young woman portrait',
      statement: 'Aunt Beatrice\'s sapphire? Oh, how awful! I... I was at the cinema all night. I even kept the ticket stub. I haven\'t visited the manor in ages. We had a... falling out.',
      statementTimestamp: 'October 27, 1948, 11:30 AM',
      dialogueTree: [
        { clueId: 'note', response: 'Goodness, how frightening for her. I hope the police find the culprit.'},
        { clueId: 'debt', response: 'A lady has her secrets, doesn\'t she? My finances are my own concern.'},
        { clueId: 'argument', response: 'My aunt and I... we see things differently. That\'s all.'},
        { clueId: 'torn_fabric', response: 'That piece of fabric? It... it looks familiar. But it could be from any dress. It proves nothing!', unlocksClueId: 'gallery_alibi'}
      ],
    }
  ],
  clues: [
    {
      id: 'note',
      title: 'A Cryptic Note',
      description: 'A note left at the scene of the crime reads: "The Azure Star will shine for a new master." It seems intended to mislead.',
      image: 'https://placehold.co/600x400.png',
      imageHint: 'old letter',
    },
    {
      id: 'footprint',
      title: 'Muddy Footprint',
      description: 'A single, muddy footprint was found on the edge of the east terrace, near the study window. The mud seems to be from the gardens.',
      image: 'https://placehold.co/600x400.png',
      imageHint: 'muddy footprint',
    },
    {
      id: 'argument',
      title: 'Overheard Argument',
      description: 'A groundskeeper overheard a heated argument between Lady Beatrice and Clara the maid on the afternoon of the theft.',
      image: 'https://placehold.co/600x400.png',
      imageHint: 'two people arguing',
    },
    {
      id: 'debt',
      title: 'The Butler\'s Debt',
      description: 'A discreet inquiry reveals that Arthur the Butler has amassed significant gambling debts.',
      image: 'https://placehold.co/600x400.png',
      imageHint: 'gambling chips',
    },
    {
      id: 'confession',
      title: 'The Butler\'s Confession',
      description: 'Confronted with the evidence of his debts and his presence near the garden, Arthur confessed to the crime.',
      image: 'https://placehold.co/600x400.png',
      imageHint: 'handcuffs document',
    },
     {
      id: 'torn_fabric',
      title: 'Torn Piece of Fabric',
      description: 'A small scrap of expensive-looking silk was found snagged on a rose bush near the study window.',
      image: 'https://placehold.co/600x400.png',
      imageHint: 'torn silk fabric',
    },
    {
      id: 'gallery_alibi',
      title: 'Gallery Opening Alibi',
      description: 'A newspaper article confirms Vincent Costello was hosting a well-attended gallery opening on the night of the theft.',
      image: 'https://placehold.co/600x400.png',
      imageHint: 'newspaper article',
    },
    {
      id: 'journal_entry',
      title: 'Lady Beatrice\'s Journal',
      description: 'An entry from Lady Beatrice\'s journal, dated a week before the theft: "I fear Arthur is becoming desperate. His creditors have been calling the house. I must speak with him, but I do dread confrontation so."',
      image: 'https://placehold.co/800x600.png',
      imageHint: 'handwritten journal page',
    }
  ],
};
