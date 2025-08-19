'use server';

/**
 * Analyze a selfie → find the best historical era + describe facial features.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeSelfieInputSchema = z.object({
  photoDataUri: z.string().describe("Selfie as Base64 data URI."),
});
export type AnalyzeSelfieInput = z.infer<typeof AnalyzeSelfieInputSchema>;

const AnalyzeSelfieOutputSchema = z.object({
  historicalEra: z.string().describe('The best historical era for this person.'),
  facialDescription: z.string().describe('Detailed description of face (eyes, nose, jaw, lips, hair, expression).'),
});
export type AnalyzeSelfieOutput = z.infer<typeof AnalyzeSelfieOutputSchema>;

const analyzeSelfiePrompt = ai.definePrompt({
  name: 'analyzeSelfiePrompt',
  input: { schema: AnalyzeSelfieInputSchema },
  output: { schema: AnalyzeSelfieOutputSchema },
  prompt: `You are an expert in art history and facial analysis.
Analyze the given selfie and return:
1. historicalEra → The single best era (Renaissance, Baroque, Victorian, Roaring Twenties, etc.)
2. facialDescription → Very specific traits (eye color, nose, lips, chin, hairstyle, expression).

Selfie: {{media url=photoDataUri}}`,
});

export const analyzeSelfie = ai.defineFlow(
  {
    name: 'analyzeSelfieFlow',
    inputSchema: AnalyzeSelfieInputSchema,
    outputSchema: AnalyzeSelfieOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeSelfiePrompt(input);
    return output!;
  }
);
