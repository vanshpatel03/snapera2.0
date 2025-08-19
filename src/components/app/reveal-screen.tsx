'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Sparkles, Repeat } from 'lucide-react';
import type { PersonaResult } from './home-page';
import { useToast } from '@/hooks/use-toast';

interface RevealScreenProps {
  persona: PersonaResult;
  onTryAgain: () => void;
}

export function RevealScreen({ persona, onTryAgain }: RevealScreenProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = persona.artisticPortraitDataUri;
    link.download = `${persona.name.replace(/\s+/g, '_')}_EraSnap.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!navigator.share) {
      toast({
        variant: 'destructive',
        title: 'Sharing Not Supported',
        description: 'Your browser does not support the Web Share API.',
      });
      return;
    }

    try {
      const response = await fetch(persona.artisticPortraitDataUri);
      const blob = await response.blob();
      const file = new File([blob], `${persona.name.replace(/\s+/g, '_')}_EraSnap.png`, { type: 'image/png' });

      await navigator.share({
        title: 'My EraSnap Persona!',
        text: `I discovered my historical persona with EraSnap: ${persona.name}, from the ${persona.historicalEra}! Check out my portrait!`,
        files: [file],
      });
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        variant: 'destructive',
        title: 'Sharing Failed',
        description: 'There was an error trying to share your persona.',
      });
    }
  };


  return (
    <div className="w-full max-w-4xl animate-in fade-in duration-1000 space-y-8">
      <div className="text-center">
        <h2 className="font-headline text-4xl text-white">Behold Your Legacy!</h2>
        <p className="text-accent">You belong to the {persona.historicalEra}!</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <Card className="overflow-hidden border-2 border-accent shadow-lg shadow-accent/20 relative">
            <img
                src={persona.artisticPortraitDataUri}
                alt={`Artistic portrait of ${persona.name}`}
                width={1024}
                height={1024}
                className="w-full h-auto object-cover aspect-square"
                data-ai-hint="historic portrait"
            />
          </Card>
        </div>

        <div className="md:col-span-2 flex flex-col space-y-6 justify-center">
            <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2 text-primary-foreground/80"><Sparkles className="text-accent"/> Your Name</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-headline text-white/90">{persona.name}</p>
                </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
                 <CardHeader>
                    <CardTitle className="font-headline text-primary-foreground/80">Your Backstory</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-body text-base text-white/80">{persona.backstory}</p>
                </CardContent>
            </Card>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleDownload} size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <Download className="mr-2" /> Download
        </Button>
        <Button onClick={handleShare} size="lg" className="bg-primary hover:bg-primary/90">
          <Share2 className="mr-2" /> Share My Legacy
        </Button>
        <Button onClick={onTryAgain} size="lg" variant="ghost">
          <Repeat className="mr-2" /> Try Again
        </Button>
      </div>
    </div>
  );
}
