'use server';
/**
 * @fileOverview Generates an artistic portrait in the style of the determined historical era.
 *
 * Enhanced version:
 * - Stronger face preservation instructions
 * - Explicit emphasis on identity similarity
 * - Balanced historical styling
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateArtisticPortraitInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A user provided selfie, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  historicalEra: z.string().describe('The historical era determined for the user.'),
});
export type GenerateArtisticPortraitInput = z.infer<typeof GenerateArtisticPortraitInputSchema>;

const GenerateArtisticPortraitOutputSchema = z.object({
  artisticPortraitDataUri: z
    .string()
    .describe(
      'The AI-generated artistic portrait in the style of the determined historical era, as a data URI.'
    ),
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
          text: `
You are a **master portrait artist**.

Your absolute priority: 
- Preserve the **unique facial identity** of the person in the selfie. 
- The portrait must look like the exact same individual (same face shape, eyes, nose, mouth, jawline, skin tone). 

Your artistic task:
- Render the person as if they lived in the **{{historicalEra}}** era. 
- Apply clothing, hairstyle, background, and textures typical of that era. 
- The style should be historically accurate, but the face must stay unmistakably the same as the selfie.

⚠️ Never replace or swap the face.
⚠️ Avoid exaggerations or generic faces.
⚠️ Focus on realism + identity preservation first, styling second.
          `,
        },
        { media: { url: input.photoDataUri } },
      ],
      config: {
        responseModalities: ['IMAGE'], // no need for TEXT in final output
        temperature: 0.6,              // lower = more accurate, less random
      },
    });

    return {
      artisticPortraitDataUri: media!.url,
    };
  }
);
