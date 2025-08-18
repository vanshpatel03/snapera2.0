'use server';

/**
 * @fileOverview Determines the most fitting historical era for a user's selfie.
 *
 * - analyzeSelfie - Analyzes a selfie to determine the most fitting historical era.
 * - AnalyzeSelfieInput - The input type for the analyzeSelfie function.
 * - AnalyzeSelfieOutput - The return type for the analyzeSelfie function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSelfieInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A selfie photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeSelfieInput = z.infer<typeof AnalyzeSelfieInputSchema>;

const AnalyzeSelfieOutputSchema = z.object({
  historicalEra: z
    .string()
    .describe('The most fitting historical era for the user.'),
});
export type AnalyzeSelfieOutput = z.infer<typeof AnalyzeSelfieOutputSchema>;

export async function analyzeSelfie(input: AnalyzeSelfieInput): Promise<AnalyzeSelfieOutput> {
  return analyzeSelfieFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSelfiePrompt',
  input: {schema: AnalyzeSelfieInputSchema},
  output: {schema: AnalyzeSelfieOutputSchema},
  prompt: `You are an expert in art history and facial analysis. Given a user's selfie, determine the most fitting historical era for them based on their appearance and the overall aesthetic of the photo.

Consider historical eras such as the Renaissance, Baroque, Victorian Era, Roaring Twenties, etc. Provide a single era as the result.

Selfie: {{media url=photoDataUri}}`,
});

const analyzeSelfieFlow = ai.defineFlow(
  {
    name: 'analyzeSelfieFlow',
    inputSchema: AnalyzeSelfieInputSchema,
    outputSchema: AnalyzeSelfieOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
