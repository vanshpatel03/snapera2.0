'use server';
/**
 * @fileOverview Generates an artistic portrait in the style of the determined historical era,
 * while preserving the user’s unique facial features.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateArtisticPortraitInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A user-provided selfie, as a data URI that must include a MIME type and use Base64 encoding. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  historicalEra: z.string().describe('The historical era determined for the user.'),
  facialDescription: z
    .string()
    .describe('Detailed description of the person’s facial features to ensure likeness.'),
});
export type GenerateArtisticPortraitInput = z.infer<typeof GenerateArtisticPortraitInputSchema>;

const GenerateArtisticPortraitOutputSchema = z.object({
  artisticPortraitDataUri: z
    .string()
    .describe('The AI-generated artistic portrait in the style of the determined historical era, as a data URI.'),
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
          text: `You are a master portrait artist. Your specialty is capturing the exact likeness of a person.

Use the provided selfie AND the following extracted face description to guarantee accuracy:

Facial features: ${input.facialDescription}

Now, generate an artistic portrait of the same person in the **${input.historicalEra}** style.
- Clothing, background, and style must match the ${input.historicalEra} era.
- The face MUST look like the same individual described above.
- Keep realism and fine details.`},
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
