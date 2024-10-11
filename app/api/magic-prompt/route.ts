import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that enhances image generation prompts." },
        { role: "user", content: `Enhance this image generation prompt: ${prompt}` }
      ],
      max_tokens: 150,
    });

    const enhancedPrompt = completion.choices[0].message.content;

    return NextResponse.json({ enhancedPrompt });
  } catch (error) {
    console.error('Error in magic-prompt route:', error);
    return NextResponse.json({ error: 'Failed to generate magic prompt' }, { status: 500 });
  }
}
