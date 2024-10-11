import { NextRequest, NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("ai_image_generator");

    // Find the first user
    const firstUser = await db.collection('users').findOne({}, { sort: { createdAt: 1 } });

    if (!firstUser) {
      return NextResponse.json({ error: 'No users found' }, { status: 404 });
    }

    // Update the first user to be an admin
    await db.collection('users').updateOne(
      { _id: firstUser._id },
      { $set: { isAdmin: true } }
    );

    return NextResponse.json({ message: 'First user set as admin successfully' }, { status: 200 });
  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
