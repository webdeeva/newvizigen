import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

const PromptGenerator = ({ onPromptGenerated }: { onPromptGenerated: (prompt: string) => void }) => {
  const [peopleType, setPeopleType] = useState('');
  const [hairType, setHairType] = useState('');
  const [clothingType, setClothingType] = useState('');
  const [skinTone, setSkinTone] = useState('');
  const [environment, setEnvironment] = useState('');
  const [style, setStyle] = useState('');

  const generatePrompt = () => {
    const prompt = `${peopleType} person with ${hairType} hair, wearing ${clothingType} clothing, ${skinTone} skin tone, in a ${environment} environment, ${style} style`;
    onPromptGenerated(prompt);
  };

  const magicPrompt = async () => {
    const basePrompt = `${peopleType} person with ${hairType} hair, wearing ${clothingType} clothing, ${skinTone} skin tone, in a ${environment} environment, ${style} style`;
    
    try {
      const response = await fetch('/api/magic-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: basePrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate magic prompt');
      }

      const data = await response.json();
      onPromptGenerated(data.enhancedPrompt);
    } catch (error) {
      console.error('Error generating magic prompt:', error);
    }
  };

  return (
    <Card className="bg-gray-900 text-white border-gray-800">
      <CardHeader>
        <CardTitle>Prompt Generator</CardTitle>
        <CardDescription className="text-gray-400">Customize your prompt</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={setPeopleType}>
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="People Type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="black">Black</SelectItem>
            <SelectItem value="asian">Asian</SelectItem>
            <SelectItem value="african">African</SelectItem>
            <SelectItem value="african american">African American</SelectItem>
            <SelectItem value="caucasian">Caucasian</SelectItem>
            <SelectItem value="biracial">Biracial</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setHairType}>
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Hair Type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="braids">Braids</SelectItem>
            <SelectItem value="natural">Natural</SelectItem>
            <SelectItem value="punk">Punk</SelectItem>
            <SelectItem value="afro">Afro</SelectItem>
            <SelectItem value="locs">Locs</SelectItem>
            <SelectItem value="pixie cut">Pixie Cut</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setClothingType}>
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Clothing Type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="elegant">Elegant</SelectItem>
            <SelectItem value="gypsy">Gypsy</SelectItem>
            <SelectItem value="jeans">Jeans</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setSkinTone}>
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Skin Tone" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="light">Light</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setEnvironment}>
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="city">City</SelectItem>
            <SelectItem value="forest">Forest</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setStyle}>
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="picasso">Picasso</SelectItem>
            <SelectItem value="photorealistic">Photorealistic</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={generatePrompt} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          Generate Prompt
        </Button>
        <Button onClick={magicPrompt} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
          <Wand2 className="mr-2 h-4 w-4" />
          Magic Prompt
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromptGenerator;
