'use server';
/**
 * @fileOverview A flow for generating images for a detective case.
 * - generateImagesForCase - Generates images for all characters and clues in a case.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { CaseDataSchema } from '@/lib/types';
import type { CaseData } from '@/lib/types';

async function generateImage(prompt: string): Promise<string> {
  const { media } = await ai.generate({
    model: 'googleai/gemini-2.0-flash-preview-image-generation',
    prompt: `A photorealistic image for a detective game. Style: gritty, noir, 1940s. ${prompt}`,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });
  if (!media) {
    throw new Error('Image generation failed to return media.');
  }
  return media.url;
}

const generateImagesForCaseFlow = ai.defineFlow(
  {
    name: 'generateImagesForCaseFlow',
    inputSchema: CaseDataSchema,
    outputSchema: CaseDataSchema,
  },
  async (caseData) => {
    const imagePromises: Promise<void>[] = [];
    const updatedCaseData = JSON.parse(JSON.stringify(caseData)) as CaseData;

    updatedCaseData.characters.forEach((character) => {
      imagePromises.push(
        (async () => {
          character.image = await generateImage(character.imageHint);
        })()
      );
    });

    updatedCaseData.clues.forEach((clue) => {
      imagePromises.push(
        (async () => {
          clue.image = await generateImage(clue.imageHint);
        })()
      );
    });

    await Promise.all(imagePromises);

    return updatedCaseData;
  }
);


export async function generateImagesForCase(input: CaseData): Promise<CaseData> {
    return generateImagesForCaseFlow(input);
}
