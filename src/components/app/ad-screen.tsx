'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from "lucide-react";

interface AdScreenProps {
  onAdWatched: () => void;
  onCancel: () => void;
}

export function AdScreen({ onAdWatched, onCancel }: AdScreenProps) {
  // In a real app, you would integrate an ad SDK here.
  // For this prototype, we'll simulate it with a button.

  return (
    <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10 animate-in fade-in duration-500">
      <CardHeader className="text-center">
        <div className="mx-auto bg-accent/20 text-accent p-3 rounded-full w-fit mb-4">
            <Video className="w-8 h-8" />
        </div>
        <CardTitle className="font-headline text-3xl">One More Step!</CardTitle>
        <CardDescription className="font-body">
          Watch a short ad to unlock this generation. Your support helps keep EraSnap magical.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* 
          THIS IS WHERE YOU WOULD PLACE YOUR AD CODE 
          For example, using a placeholder for Google AdSense:
          
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-your-client-id"
               data-ad-slot="your-ad-slot-id"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>
               (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        */}
         <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">[Your Ad Will Appear Here]</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button onClick={onAdWatched} className="w-full font-bold text-lg py-6 bg-accent hover:bg-accent/90">
            Proceed to Generation
        </Button>
        <Button onClick={onCancel} variant="ghost" className="w-full">
            Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
