'use server';

/**
 * @fileOverview Generates a fitting name and a one-sentence backstory based on the determined historical era and portrait.
 *
 * - generatePersonaDetails - A function that handles the persona details generation.
 * - GeneratePersonaDetailsInput - The input type for the generatePersonaDetails function.
 * - GeneratePersonaDetailsOutput - The return type for the generatePersonaDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonaDetailsInputSchema = z.object({
  historicalEra: z.string().describe('The historical era determined for the persona.'),
  portraitDescription: z.string().describe('A description of the AI-generated portrait.'),
});
export type GeneratePersonaDetailsInput = z.infer<typeof GeneratePersonaDetailsInputSchema>;

const GeneratePersonaDetailsOutputSchema = z.object({
  name: z.string().describe('The generated name for the persona.'),
  backstory: z.string().describe('A one-sentence backstory for the persona.'),
});
export type GeneratePersonaDetailsOutput = z.infer<typeof GeneratePersonaDetailsOutputSchema>;

export async function generatePersonaDetails(input: GeneratePersonaDetailsInput): Promise<GeneratePersonaDetailsOutput> {
  return generatePersonaDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonaDetailsPrompt',
  input: {schema: GeneratePersonaDetailsInputSchema},
  output: {schema: GeneratePersonaDetailsOutputSchema},
  prompt: `You are a creative name and backstory generator for historical personas.

  Generate a fitting name and a one-sentence backstory based on the determined historical era and the AI-generated portrait description.

  Historical Era: {{{historicalEra}}}
  Portrait Description: {{{portraitDescription}}}

  Name:
  Backstory: `,
});

const generatePersonaDetailsFlow = ai.defineFlow(
  {
    name: 'generatePersonaDetailsFlow',
    inputSchema: GeneratePersonaDetailsInputSchema,
    outputSchema: GeneratePersonaDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
