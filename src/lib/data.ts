import type { CaseData } from './types';

export const caseData: CaseData = {
  title: 'The Case of the Stolen Sapphire',
  description: 'The famous "Azure Star" sapphire has been stolen from Lady Beatrice\'s private collection. The thief was swift, leaving only a few subtle clues behind. Interrogate the suspects and piece together the evidence to find the culprit.',
  difficulty: 'Easy',
  startingClueIds: ['note'],
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
        }
      ],
    },
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
  ],
};
