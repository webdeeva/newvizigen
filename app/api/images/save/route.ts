import { NextRequest, NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";
import { ObjectId } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, imageUrl, model, aspectRatio, guidance, numOutputs, disableSafetyChecker, isPublic } = body;

    const client = await clientPromise;
    const db = client.db("ai_image_generator");

    const imageData = {
      userId: new ObjectId(session.user.id),
      prompt,
      imageUrl,
      model,
      aspectRatio,
      guidance,
      numOutputs,
      disableSafetyChecker,
      isPublic,
      createdAt: new Date()
    };

    const result = await db.collection("images").insertOne(imageData);

    // Update user's image count
    await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $inc: { imageCount: 1 } }
    );

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
