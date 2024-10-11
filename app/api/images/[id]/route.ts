import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db("ai_image_generator");

    const result = await db.collection("images").deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(session.user.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Image not found or not authorized to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = params;
  const { isPublic } = await request.json();

  if (typeof isPublic !== 'boolean') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ai_image_generator");

    const result = await db.collection("images").updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(session.user.id) },
      { $set: { isPublic } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Image not found or not authorized to update' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Image updated successfully' });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
  }
}
