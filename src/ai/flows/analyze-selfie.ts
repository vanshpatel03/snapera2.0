'use server';

/**
 * @fileOverview Determines the most fitting historical era for a user's selfie,
 * and extracts key facial features to improve likeness in portrait generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeSelfieInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A selfie photo, as a data URI that must include a MIME type and use Base64 encoding. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeSelfieInput = z.infer<typeof AnalyzeSelfieInputSchema>;

const AnalyzeSelfieOutputSchema = z.object({
  historicalEra: z
    .string()
    .describe('The most fitting historical era for the user.'),
  facialDescription: z
    .string()
    .describe('Detailed description of the person’s facial features (eyes, nose, jaw, mouth, hair, expression).'),
});
export type AnalyzeSelfieOutput = z.infer<typeof AnalyzeSelfieOutputSchema>;

export async function analyzeSelfie(input: AnalyzeSelfieInput): Promise<AnalyzeSelfieOutput> {
  return analyzeSelfieFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSelfiePrompt',
  input: { schema: AnalyzeSelfieInputSchema },
  output: { schema: AnalyzeSelfieOutputSchema },
  prompt: `You are an expert in art history and facial analysis. 
Step 1: Carefully analyze the person's face from the selfie.
Step 2: Extract their distinct features (eye color/shape, nose, lips, chin/jawline, hairstyle, expression).
Step 3: Suggest the single most fitting historical era (Renaissance, Baroque, Victorian, Roaring Twenties, etc.).

Return:
- historicalEra → The single best era.
- facialDescription → A precise description of their facial traits.

Selfie: {{media url=photoDataUri}}`,
});

const analyzeSelfieFlow = ai.defineFlow(
  {
    name: 'analyzeSelfieFlow',
    inputSchema: AnalyzeSelfieInputSchema,
    outputSchema: AnalyzeSelfieOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
