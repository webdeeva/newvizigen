import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ai_image_generator");
    const options = await db.collection("prompt_options").find().toArray();
    
    return NextResponse.json(options);
  } catch (error) {
    console.error('Error fetching prompt options:', error);
    return NextResponse.json({ error: 'Failed to fetch prompt options' }, { status: 500 });
  }
}
