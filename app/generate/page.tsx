"use client"

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Share2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DashboardLayout from '../components/DashboardLayout';
import PromptGenerator from '../components/PromptGenerator';

export default function GeneratePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('flux-pro');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [guidance, setGuidance] = useState(3);
  const [numOutputs, setNumOutputs] = useState(1);
  const [disableSafetyChecker, setDisableSafetyChecker] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPromptGenerator, setShowPromptGenerator] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

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

      if (data.output && Array.isArray(data.output) && data.output.length > 0) {
        setGeneratedImage(data.output[0]);
      } else if (typeof data.output === 'string') {
        setGeneratedImage(data.output);
      } else {
        throw new Error('Invalid response format: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('Detailed error generating image:', error);
      setError((error as Error).message || 'An unexpected error occurred');
    }
    setIsLoading(false);
  };

  const handleSave = async (isPublic: boolean = false) => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/images/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: generatedImage,
          prompt,
          model,
          aspectRatio,
          guidance,
          numOutputs,
          disableSafetyChecker,
          isPublic,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save image');
      }

      const data = await response.json();
      console.log('Image saved successfully:', data);
      setDialogMessage(isPublic ? 'Image saved and made public successfully!' : 'Image saved successfully!');
      setDialogOpen(true);
    } catch (error) {
      console.error('Error saving image:', error);
      setError((error as Error).message || 'Failed to save image');
    }
  };

  const handlePromptGenerated = (generatedPrompt: string) => {
    setPrompt(generatedPrompt);
    setShowPromptGenerator(false);
  };

  const content = (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">AI Image Generator</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 order-2 lg:order-1">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Generate Image</CardTitle>
              <CardDescription className="text-gray-400">Enter a prompt and customize settings to generate an AI image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="prompt" className="text-white">Prompt</Label>
                <div className="flex gap-2">
                  <Textarea
                    id="prompt"
                    placeholder="Enter your prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="mt-1 bg-gray-800 text-white border-gray-700 focus:border-purple-500 flex-grow"
                  />
                  <Button
                    onClick={() => setShowPromptGenerator(!showPromptGenerator)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 lg:hidden"
                  >
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="model" className="text-white">Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    <SelectItem value="flux-dev">Flux Dev</SelectItem>
                    <SelectItem value="flux-schnell">Flux Schnell</SelectItem>
                    <SelectItem value="flux-pro">Flux Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="aspectRatio" className="text-white">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    <SelectItem value="1:1">1:1</SelectItem>
                    <SelectItem value="16:9">16:9</SelectItem>
                    <SelectItem value="4:3">4:3</SelectItem>
                    <SelectItem value="3:2">3:2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="guidance" className="text-white">Guidance Scale: {guidance}</Label>
                <Slider
                  id="guidance"
                  min={1}
                  max={20}
                  step={0.1}
                  value={[guidance]}
                  onValueChange={(value) => setGuidance(value[0])}
                  className="bg-gray-800"
                />
              </div>
              <div>
                <Label htmlFor="numOutputs" className="text-white">Number of Outputs: {numOutputs}</Label>
                <Slider
                  id="numOutputs"
                  min={1}
                  max={4}
                  step={1}
                  value={[numOutputs]}
                  onValueChange={(value) => setNumOutputs(value[0])}
                  className="bg-gray-800"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="safetyChecker"
                  checked={disableSafetyChecker}
                  onCheckedChange={setDisableSafetyChecker}
                />
                <Label htmlFor="safetyChecker" className="text-white">Disable Safety Checker</Label>
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
        </div>
        <div className={`lg:w-1/3 order-1 lg:order-2 ${showPromptGenerator ? 'block' : 'hidden lg:block'}`}>
          <PromptGenerator onPromptGenerated={handlePromptGenerated} />
        </div>
      </div>
      {generatedImage && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">Generated Image</h2>
          <img src={generatedImage} alt="Generated" className="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          <div className="mt-4 flex justify-center space-x-4">
            <Button onClick={() => handleSave(false)} className="flex items-center bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button onClick={() => handleSave(true)} className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
              <Share2 className="mr-2 h-4 w-4" />
              Make Public
            </Button>
          </div>
        </div>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>{dialogMessage}</p>
        </DialogContent>
      </Dialog>
    </div>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
}
