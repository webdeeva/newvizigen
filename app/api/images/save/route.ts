import { NextRequest, NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, prompt, imageUrl, model, isPublic } = body;

    const client = await clientPromise;
    const db = client.db("ai_image_generator");

    const imageData = {
      userId: new ObjectId(userId),
      prompt: prompt,
      imageUrl: imageUrl,
      model: model,
      isPublic: isPublic,
      createdAt: new Date()
    };

    const result = await db.collection("images").insertOne(imageData);

    return NextResponse.json({ 
      success: true,
      imageId: result.insertedId
    });
  } catch (error) {
    console.error('Error saving image:', error);
    return NextResponse.json({ 
      error: `Failed to save image: ${(error as Error).message}`
    }, { status: 500 });
  }
}
