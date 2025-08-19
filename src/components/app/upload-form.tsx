"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { analyzeSelfie } from "@/ai/flows/analyze-selfie";
import { generateArtisticPortrait } from "@/ai/flows/generate-artistic-portrait";

// 🔥 Pipeline function
async function processPortrait(photoDataUri: string) {
  // Step 1: analyze selfie → era + facial description
  const { historicalEra, facialDescription } = await analyzeSelfie({ photoDataUri });

  // Step 2: generate portrait using both inputs
  const { artisticPortraitDataUri } = await generateArtisticPortrait({
    photoDataUri,
    historicalEra,
    facialDescription,
  });

  return { artisticPortraitDataUri, historicalEra, facialDescription };
}

export default function UploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    portrait?: string;
    era?: string;
    features?: string;
  }>({});

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setResult({});

    const reader = new FileReader();
    reader.onloadend = async () => {
      const photoDataUri = reader.result as string;

      try {
        // Run pipeline
        const { artisticPortraitDataUri, historicalEra, facialDescription } =
          await processPortrait(photoDataUri);

        setResult({
          portrait: artisticPortraitDataUri,
          era: historicalEra,
          features: facialDescription,
        });
      } catch (err) {
        console.error("Error generating portrait:", err);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-900 rounded-2xl shadow-lg text-white">
      <h2 className="text-xl font-bold mb-4">Upload your photo</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm"
        />

        <Button type="submit" disabled={!selectedFile || loading}>
          {loading ? "Processing..." : "Generate Portrait"}
        </Button>
      </form>

      {/* Show results */}
      {result.portrait && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold">Your Historical Portrait</h3>
          <img
            src={result.portrait}
            alt="Generated portrait"
            className="mt-3 rounded-lg shadow-md mx-auto"
          />
          <p className="mt-3 text-sm">
            <strong>Era:</strong> {result.era}
          </p>
          <p className="mt-1 text-sm italic">{result.features}</p>
        </div>
      )}
    </div>
  );
}
