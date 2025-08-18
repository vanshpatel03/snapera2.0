'use client';

import { useState } from 'react';
import { analyzeSelfie, type AnalyzeSelfieOutput } from '@/ai/flows/analyze-selfie';
import { generateArtisticPortrait, type GenerateArtisticPortraitOutput } from '@/ai/flows/generate-artistic-portrait';
import { generatePersonaDetails, type GeneratePersonaDetailsOutput } from '@/ai/flows/generate-persona-details';
import { animatePortrait, type AnimatePortraitOutput } from '@/ai/flows/animate-portrait';
import { useToast } from "@/hooks/use-toast";
import { UploadForm } from './upload-form';
import { LoadingScreen } from './loading-screen';
import { RevealScreen } from './reveal-screen';
import { Header } from './header';

type Step = 'upload' | 'loading' | 'result';
export type PersonaResult = AnalyzeSelfieOutput & GenerateArtisticPortraitOutput & GeneratePersonaDetailsOutput & AnimatePortraitOutput;

export function HomePage() {
  const [step, setStep] = useState<Step>('upload');
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [personaResult, setPersonaResult] = useState<PersonaResult | null>(null);
  const { toast } = useToast();

  const handleReset = () => {
    setStep('upload');
    setPersonaResult(null);
  };

  const handleGenerate = async (selfieDataUri: string) => {
    setStep('loading');
    setLoadingMessage("Analyzing your essence...");

    try {
      const { historicalEra } = await analyzeSelfie({ photoDataUri: selfieDataUri });
      if (!historicalEra) throw new Error("Could not determine a historical era.");
      setLoadingMessage("Consulting the chronomancers...");

      const { artisticPortraitDataUri } = await generateArtisticPortrait({
        photoDataUri: selfieDataUri,
        historicalEra,
      });
      if (!artisticPortraitDataUri) throw new Error("Could not generate a portrait.");
      setLoadingMessage("Painting your past life...");

      const personaDetailsPromise = generatePersonaDetails({
        historicalEra,
        portraitDescription: `A portrait in the style of the ${historicalEra}.`,
      });

      setLoadingMessage("Bringing your portrait to life...");
      const animationPromise = animatePortrait({ portraitDataUri: artisticPortraitDataUri });

      const [personaDetailsResult, animationResult] = await Promise.all([personaDetailsPromise, animationPromise]);

      const { name, backstory } = personaDetailsResult;
      if (!name || !backstory) throw new Error("Could not generate persona details.");

      const { animatedPortraitDataUri } = animationResult;
      if (!animatedPortraitDataUri) throw new Error("Could not animate the portrait.");
      
      setLoadingMessage("Unveiling your historical doppelgänger...");

      setPersonaResult({
        historicalEra,
        artisticPortraitDataUri,
        name,
        backstory,
        animatedPortraitDataUri,
      });
      setStep('result');

    } catch (e: any) {
      console.error(e);
      const errorMessage = e.message || 'An unexpected error occurred. Please try again.';
      setStep('upload'); 
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: errorMessage,
      })
    } finally {
        setLoadingMessage(null);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 'upload':
        return <UploadForm onUpload={handleGenerate} />;
      case 'loading':
        return <LoadingScreen customText={loadingMessage} />;
      case 'result':
        return personaResult && <RevealScreen persona={personaResult} onTryAgain={handleReset} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 container mx-auto">
        {renderStep()}
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Powered by Generative AI.</p>
      </footer>
    </div>
  );
}
