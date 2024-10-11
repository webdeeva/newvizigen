import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const TIMEOUT = 60000; // 60 seconds timeout

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    const { model, prompt, aspectRatio, guidance, numOutputs, disableSafetyChecker, userId, isPublic } = body;

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN is not set');
    }

    let apiUrl: string;
    switch (model) {
      case 'flux-dev':
        apiUrl = "https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions";
        break;
      case 'flux-schnell':
        apiUrl = "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions";
        break;
      case 'flux-pro':
        apiUrl = "https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions";
        break;
      default:
        throw new Error('Invalid model selected');
    }

    console.log('Using API URL:', apiUrl);

    const input = {
      prompt: prompt,
      go_fast: true,
      megapixels: "1",
      num_outputs: numOutputs,
      aspect_ratio: aspectRatio,
      output_format: "webp",
      output_quality: 80,
      num_inference_steps: 4,
      guidance_scale: guidance,
      disable_safety_checker: disableSafetyChecker
    };

    console.log('Replicate input:', input);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait'
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Replicate API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Raw Replicate output:', data);

      if (!data.output) {
        throw new Error('Replicate returned an empty response');
      }

      // Format the response to match what the frontend expects
      const formattedOutput = Array.isArray(data.output) ? data.output : [data.output];

      // Return the generated image data
      return NextResponse.json({ 
        output: formattedOutput,
        userId,
        prompt,
        model,
        isPublic,
        debug: { input, apiUrl, data } 
      });
    } catch (replicateError) {
      console.error('Error from Replicate:', replicateError);
      return NextResponse.json({ 
        error: `Replicate error: ${(replicateError as Error).message}`,
        debug: { input, apiUrl, errorDetails: replicateError }
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Detailed error in generate route:', error);
    return NextResponse.json({ 
      error: `Unexpected error: ${(error as Error).message}`,
      debug: { errorDetails: error }
    }, { status: 500 });
  }
}
