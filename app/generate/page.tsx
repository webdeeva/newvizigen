"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('flux-dev');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [guidance, setGuidance] = useState(3);
  const [numOutputs, setNumOutputs] = useState(1);
  const [disableSafetyChecker, setDisableSafetyChecker] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedImage('');
    try {
      console.log('Sending request with parameters:', {
        model,
        prompt,
        aspectRatio,
        guidance,
        numOutputs,
        disableSafetyChecker,
      });

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          aspectRatio,
          guidance,
          numOutputs,
          disableSafetyChecker,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      console.log('Received response:', data);

      if (Array.isArray(data.output) && data.output.length > 0) {
        setGeneratedImage(data.output[0]);
      } else {
        throw new Error('Invalid response format: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('Detailed error generating image:', error);
      setError((error as Error).message || 'An unexpected error occurred');
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">AI Image Generator</h1>
      <Card>
        <CardHeader>
          <CardTitle>Generate Image</CardTitle>
          <CardDescription>Enter a prompt and customize settings to generate an AI image.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flux-dev">Flux Dev</SelectItem>
                <SelectItem value="flux-schnell">Flux Schnell</SelectItem>
                <SelectItem value="flux-pro">Flux Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="aspectRatio">Aspect Ratio</Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger>
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">1:1</SelectItem>
                <SelectItem value="16:9">16:9</SelectItem>
                <SelectItem value="4:3">4:3</SelectItem>
                <SelectItem value="3:2">3:2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="guidance">Guidance Scale: {guidance}</Label>
            <Slider
              id="guidance"
              min={1}
              max={20}
              step={0.1}
              value={[guidance]}
              onValueChange={(value) => setGuidance(value[0])}
            />
          </div>
          <div>
            <Label htmlFor="numOutputs">Number of Outputs: {numOutputs}</Label>
            <Slider
              id="numOutputs"
              min={1}
              max={4}
              step={1}
              value={[numOutputs]}
              onValueChange={(value) => setNumOutputs(value[0])}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="safetyChecker"
              checked={disableSafetyChecker}
              onCheckedChange={setDisableSafetyChecker}
            />
            <Label htmlFor="safetyChecker">Disable Safety Checker</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Image'
            )}
          </Button>
        </CardFooter>
      </Card>
      {generatedImage && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Generated Image</h2>
          <img src={generatedImage} alt="Generated" className="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
}