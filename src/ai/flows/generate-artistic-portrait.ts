'use server';

/**
 * Generate portrait using historical era + facial traits.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateArtisticPortraitInputSchema = z.object({
  photoDataUri: z.string().describe("Selfie as Base64 data URI."),
  historicalEra: z.string().describe("The chosen historical era."),
  facialDescription: z.string().describe("Detailed description of facial traits."),
});
export type GenerateArtisticPortraitInput = z.infer<typeof GenerateArtisticPortraitInputSchema>;

const GenerateArtisticPortraitOutputSchema = z.object({
  artisticPortraitDataUri: z.string().describe("Generated portrait image as Base64."),
});
export type GenerateArtisticPortraitOutput = z.infer<typeof GenerateArtisticPortraitOutputSchema>;

export const generateArtisticPortrait = ai.defineFlow(
  {
    name: 'generateArtisticPortraitFlow',
    inputSchema: GenerateArtisticPortraitInputSchema,
    outputSchema: GenerateArtisticPortraitOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {
          text: `You are a master portrait artist.
Transform the provided selfie into the **{{historicalEra}}** style.
Make sure to **preserve facial features** from this description:
{{facialDescription}}

It must look like the same person, only in {{historicalEra}} style.`,
        },
        { media: { url: input.photoDataUri } },
      ],
      config: { responseModalities: ['TEXT', 'IMAGE'] },
    });

    return { artisticPortraitDataUri: media!.url };
  }
);
