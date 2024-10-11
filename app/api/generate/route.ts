import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    const { model, prompt, aspectRatio, guidance, numOutputs, disableSafetyChecker } = body;

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN is not set');
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    let modelVersion;
    switch (model) {
      case 'flux-dev':
        modelVersion = "black-forest-labs/flux-dev";
        break;
      case 'flux-schnell':
        modelVersion = "black-forest-labs/flux-schnell";
        break;
      case 'flux-pro':
        modelVersion = "black-forest-labs/flux-pro";
        break;
      default:
        throw new Error('Invalid model selected');
    }

    console.log('Using model:', modelVersion);

    const input = {
      aspect_ratio: aspectRatio,
      disable_safety_checker: disableSafetyChecker,
      guidance: guidance,
      num_outputs: numOutputs,
      prompt: prompt,
    };

    console.log('Replicate input:', input);

    try {
      const output = await replicate.run(
        modelVersion,
        {
          input: input
        }
      );

      console.log('Replicate output:', output);

      return NextResponse.json({ output });
    } catch (replicateError) {
      console.error('Error from Replicate:', replicateError);
      return NextResponse.json({ error: `Replicate error: ${(replicateError as Error).message}` }, { status: 500 });
    }
  } catch (error) {
    console.error('Detailed error in generate route:', error);
    return NextResponse.json({ error: `Unexpected error: ${(error as Error).message}` }, { status: 500 });
  }
}