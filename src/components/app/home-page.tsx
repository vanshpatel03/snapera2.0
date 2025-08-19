'use client';

import { useState, useEffect } from 'react';
import { analyzeSelfie, type AnalyzeSelfieOutput } from '@/ai/flows/analyze-selfie';
import { generateArtisticPortrait, type GenerateArtisticPortraitOutput } from '@/ai/flows/generate-artistic-portrait';
import { generatePersonaDetails, type GeneratePersonaDetailsOutput } from '@/ai/flows/generate-persona-details';
import { useToast } from "@/hooks/use-toast";
import { UploadForm } from './upload-form';
import { LoadingScreen } from './loading-screen';
import { RevealScreen } from './reveal-screen';
import { AdScreen } from './ad-screen';
import { Header } from './header';

type Step = 'upload' | 'loading' | 'result' | 'ad';
export type PersonaResult = AnalyzeSelfieOutput & GenerateArtisticPortraitOutput & GeneratePersonaDetailsOutput;

export function HomePage() {
  const [step, setStep] = useState<Step>('upload');
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [personaResult, setPersonaResult] = useState<PersonaResult | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [selfieDataUri, setSelfieDataUri] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedDay = localStorage.getItem('erasnap_last_generation_day');
    
    if (storedDay === today) {
      const storedCount = parseInt(localStorage.getItem('erasnap_generation_count') || '0', 10);
      setGenerationCount(storedCount);
    } else {
      // New day, reset count
      localStorage.setItem('erasnap_last_generation_day', today);
      localStorage.setItem('erasnap_generation_count', '0');
      setGenerationCount(0);
    }
  }, []);

  const updateGenerationCount = () => {
    const newCount = generationCount + 1;
    setGenerationCount(newCount);
    localStorage.setItem('erasnap_generation_count', newCount.toString());
  }

  const handleReset = () => {
    setStep('upload');
    setPersonaResult(null);
    setSelfieDataUri(null);
  };

  const handleUpload = (dataUri: string) => {
    setSelfieDataUri(dataUri);
    if (generationCount === 0) {
      handleGenerate(dataUri);
    } else if (generationCount < 3) {
      setStep('ad');
    } else {
      toast({
        variant: "destructive",
        title: "Daily Limit Reached",
        description: "You have already created the maximum number of personas for today. Please come back tomorrow!",
      });
    }
  };

  const handleAdWatched = () => {
    if(selfieDataUri) {
        handleGenerate(selfieDataUri);
    }
  }

  const handleGenerate = async (selfieDataUri: string) => {
    setStep('loading');
    setLoadingMessage("Analyzing your essence...");

    try {
      const { historicalEra } = await analyzeSelfie({ photoDataUri: selfieDataUri });
      if (!historicalEra) throw new Error("Could not determine a historical era.");
      setLoadingMessage("Consulting the chronomancers...");
      
      const artisticPortraitPromise = generateArtisticPortrait({
        photoDataUri: selfieDataUri,
        historicalEra,
      });

      const personaDetailsPromise = generatePersonaDetails({
        historicalEra,
        portraitDescription: `A portrait in the style of the ${historicalEra}.`,
      });
      
      const [artisticPortraitResult, personaDetailsResult] = await Promise.all([artisticPortraitPromise, personaDetailsPromise]);
      
      const { artisticPortraitDataUri } = artisticPortraitResult;
      if (!artisticPortraitDataUri) throw new Error("Could not generate a portrait.");
      setLoadingMessage("Painting your past life...");


      const { name, backstory } = personaDetailsResult;
      if (!name || !backstory) throw new Error("Could not generate persona details.");
      
      setLoadingMessage("Unveiling your historical doppelgänger...");

      setPersonaResult({
        historicalEra,
        artisticPortraitDataUri,
        name,
        backstory,
      });
      updateGenerationCount();
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
        return <UploadForm onUpload={handleUpload} generationCount={generationCount} />;
      case 'ad':
        return <AdScreen onAdWatched={handleAdWatched} onCancel={handleReset} />;
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
