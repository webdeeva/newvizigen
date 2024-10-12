import { NextRequest, NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";
import { ObjectId } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("ai_image_generator");

    const imageId = new ObjectId(params.id);
    const userId = new ObjectId(session.user.id);

    // Check if the user has already favorited this image
    const existingFavorite = await db.collection("favorites").findOne({
      imageId,
      userId
    });

    if (existingFavorite) {
      return NextResponse.json({ message: 'Image already favorited' }, { status: 400 });
    }

    // Add favorite
    await db.collection("favorites").insertOne({
      imageId,
      userId,
      createdAt: new Date()
    });

    // Increment favorites count in the images collection
    const result = await db.collection("images").updateOne(
      { _id: imageId },
      { $inc: { favorites: 1 } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Image favorited successfully' });
  } catch (error) {
    console.error('Error favoriting image:', error);
    return NextResponse.json({ error: 'Failed to favorite image' }, { status: 500 });
  }
}
