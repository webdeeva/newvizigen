import { NextRequest, NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ai_image_generator");

    const result = await db.collection('users').updateOne(
      { email },
      { $set: { isAdmin: true } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'User is already an admin' }, { status: 200 });
    }

    return NextResponse.json({ message: 'User set as admin successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error setting admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
