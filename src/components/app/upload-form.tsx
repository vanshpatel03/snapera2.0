'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import { useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  selfie: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "A selfie is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

interface UploadFormProps {
  onUpload: (dataUri: string) => void;
  isSubmitting?: boolean;
}

export function UploadForm({ onUpload }: UploadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register("selfie", {
      onChange: (e) => {
        if(e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
      }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const file = values.selfie[0];
    if (!file) {
      setIsSubmitting(false);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onUpload(reader.result as string);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setIsSubmitting(false);
    };
  }

  return (
    <Card className="w-full max-w-lg bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10 animate-in fade-in duration-500">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Create Your Persona</CardTitle>
        <CardDescription className="font-body">
          Upload a selfie to travel through time and discover your historical self.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="selfie"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="selfie-upload"
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-muted/50 border-muted-foreground/50 hover:border-accent"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                {fileName ? (
                                    <p className="font-semibold text-accent">{fileName}</p>
                                ) : (
                                    <>
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 5MB)</p>
                                    </>
                                )}
                            </div>
                            <Input id="selfie-upload" type="file" className="hidden" accept={ACCEPTED_IMAGE_TYPES.join(",")} {...fileRef} />
                        </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-bold text-lg py-6 bg-accent hover:bg-accent/90" disabled={isSubmitting}>
              {isSubmitting ? 'Traveling through time...' : 'Discover My Legacy'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
