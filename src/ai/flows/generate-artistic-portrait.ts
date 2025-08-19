'use server';
/**
 * @fileOverview Generates an artistic portrait in the style of the determined historical era.
 *
 * - generateArtisticPortrait - A function that handles the generation of the artistic portrait.
 * - GenerateArtisticPortraitInput - The input type for the generateArtisticPortrait function.
 * - GenerateArtisticPortraitOutput - The return type for the generateArtisticPortrait function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {text: `You are a master portrait artist. Your specialty is to capture the likeness of a person and paint them in a specific historical style.

Generate an artistic portrait of the person in the provided photo, rendered in the style of the **{{historicalEra}}** era.

**Crucially, you must preserve the distinct facial features of the person in the photo.** The final portrait should look like the same person, transported back in time.

Pay close attention to the artistic conventions of the {{historicalEra}}, including the clothing, hairstyle, lighting, and the texture of the paint.`},
        {media: {url: input.photoDataUri}},
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
