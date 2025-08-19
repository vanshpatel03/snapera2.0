'use server';

/**
 * @fileOverview Generates an artistic portrait in the style of the determined historical era,
 * while preserving the person’s distinct facial features.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateArtisticPortraitInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A user selfie, as a data URI (format: 'data:<mimetype>;base64,<encoded_data>')."
    ),
  historicalEra: z
    .string()
    .describe('The historical era determined for the user.'),
  facialDescription: z
    .string()
    .describe(
      'Detailed description of the person’s facial features (eyes, nose, jaw, lips, hair, expression).'
    ),
});
export type GenerateArtisticPortraitInput = z.infer<typeof GenerateArtisticPortraitInputSchema>;

const GenerateArtisticPortraitOutputSchema = z.object({
  artisticPortraitDataUri: z
    .string()
    .describe('The AI-generated artistic portrait as a data URI.'),
});
export type GenerateArtisticPortraitOutput = z.infer<typeof GenerateArtisticPortraitOutputSchema>;

export async function generateArtisticPortrait(
  input: GenerateArtisticPortraitInput
): Promise<GenerateArtisticPortraitOutput> {
  return generateArtisticPortraitFlow(input);
}

const generateArtisticPortraitFlow = ai.defineFlow(
  {
    name: 'generateArtisticPortraitFlow',
    inputSchema: GenerateArtisticPortraitInputSchema,
    outputSchema: GenerateArtisticPortraitOutputSchema,
  },
  async input => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {
          text: `You are a master portrait artist. Your job is to capture the likeness of the person in the photo
and paint them in the style of the **${input.historicalEra}** era.

Important:
- Preserve the distinct facial features described here: ${input.facialDescription}.
- Ensure the portrait clearly looks like the same person from the selfie.
- Apply ${input.historicalEra} style in clothing, hairstyle, background, lighting, and painting texture.`,
        },
        { media: { url: input.photoDataUri } },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {
      artisticPortraitDataUri: media!.url,
    };
  }
);
