'use server';

/**
 * @fileOverview Animates a portrait image to create a short video.
 *
 * - animatePortrait - A function that handles the animation of the portrait.
 * - AnimatePortraitInput - The input type for the animatePortrait function.
 * - AnimatePortraitOutput - The return type for the animatePortrait function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnimatePortraitInputSchema = z.object({
  portraitDataUri: z
    .string()
    .describe(
      "A portrait photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnimatePortraitInput = z.infer<typeof AnimatePortraitInputSchema>;

const AnimatePortraitOutputSchema = z.object({
  animatedPortraitDataUri: z
    .string()
    .describe('The AI-generated animated portrait, as a data URI.'),
});
export type AnimatePortraitOutput = z.infer<typeof AnimatePortraitOutputSchema>;

export async function animatePortrait(
  input: AnimatePortraitInput
): Promise<AnimatePortraitOutput> {
  return animatePortraitFlow(input);
}

const animatePortraitFlow = ai.defineFlow(
  {
    name: 'animatePortraitFlow',
    inputSchema: AnimatePortraitInputSchema,
    outputSchema: AnimatePortraitOutputSchema,
  },
  async (input) => {
    let { operation } = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: [
        {
          text: 'Animate this portrait. The person should subtly move, blink, and maybe have a slight smile. The background should have some gentle motion, like a soft breeze effect.',
        },
        {
          media: {
            url: input.portraitDataUri,
          },
        },
      ],
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
        personGeneration: 'allow_adult',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes.
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      // Sleep for 5 seconds before checking again.
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find((p) => !!p.media);
    if (!video || !video.media) {
      throw new Error('Failed to find the generated video');
    }
    
    // Veo returns a GCS URL that requires an API key to access.
    // We will fetch it on the server and return it as a data URI to the client.
    const fetch = (await import('node-fetch')).default;
    const videoDownloadResponse = await fetch(
      `${video.media.url}&key=${process.env.GEMINI_API_KEY}`
    );
    if (
      !videoDownloadResponse ||
      videoDownloadResponse.status !== 200 ||
      !videoDownloadResponse.body
    ) {
      throw new Error('Failed to fetch video');
    }

    const buffer = await videoDownloadResponse.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = video.media.contentType || 'video/mp4';

    return {
      animatedPortraitDataUri: `data:${contentType};base64,${base64}`,
    };
  }
);
