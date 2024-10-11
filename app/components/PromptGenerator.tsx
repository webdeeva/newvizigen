import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

interface PromptOption {
  _id: string;
  text: string;
  values: string[];
}

const PromptGenerator = ({ onPromptGenerated }: { onPromptGenerated: (prompt: string) => void }) => {
  const [promptOptions, setPromptOptions] = useState<PromptOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPromptOptions = async () => {
      try {
        const response = await fetch('/api/prompt-options');
        if (!response.ok) {
          throw new Error('Failed to fetch prompt options');
        }
        const data = await response.json();
        setPromptOptions(data);
      } catch (error) {
        console.error('Error fetching prompt options:', error);
      }
    };

    fetchPromptOptions();
  }, []);

  const generatePrompt = () => {
    const prompt = Object.entries(selectedOptions)
      .map(([key, value]) => `${value} ${key}`)
      .join(', ');
    onPromptGenerated(prompt);
  };

  const magicPrompt = async () => {
    const basePrompt = Object.entries(selectedOptions)
      .map(([key, value]) => `${value} ${key}`)
      .join(', ');
    
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
        {promptOptions.map((option) => (
          <Select
            key={option._id}
            onValueChange={(value) => setSelectedOptions(prev => ({ ...prev, [option.text]: value }))}
          >
            <SelectTrigger className="bg-gray-800 text-white border-gray-700">
              <SelectValue placeholder={option.text} />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              {option.values.map((value) => (
                <SelectItem key={value} value={value}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
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
