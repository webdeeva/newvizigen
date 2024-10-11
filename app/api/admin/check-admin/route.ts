import { NextRequest, NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ai_image_generator");

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ isAdmin: !!user.isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
