import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    console.log('Attempting to connect to the database...');
    const client = await clientPromise;
    console.log('Connected to the database successfully');

    const db = client.db("ai_image_generator");
    console.log('Accessing ai_image_generator database');

    const options = await db.collection("prompt_options").find().toArray();
    console.log('Fetched prompt options from database:', options);

    return NextResponse.json(options);
  } catch (error) {
    console.error('Error fetching prompt options:', error);
    return NextResponse.json({ error: 'Failed to fetch prompt options' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { option } = await req.json();
    const client = await clientPromise;
    const db = client.db("ai_image_generator");
    const result = await db.collection("prompt_options").insertOne({ text: option, values: [] });
    return NextResponse.json({ message: 'Prompt option added successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error adding prompt option:', error);
    return NextResponse.json({ error: 'Failed to add prompt option' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, value } = await req.json();
    const client = await clientPromise;
    const db = client.db("ai_image_generator");
    await db.collection("prompt_options").updateOne(
      { _id: new ObjectId(id) },
      { $push: { values: value } }
    );
    return NextResponse.json({ message: 'Prompt option value added successfully' });
  } catch (error) {
    console.error('Error adding prompt option value:', error);
    return NextResponse.json({ error: 'Failed to add prompt option value' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, value } = await req.json();
    const client = await clientPromise;
    const db = client.db("ai_image_generator");
    if (value) {
      // Delete a specific value from the option
      await db.collection("prompt_options").updateOne(
        { _id: new ObjectId(id) },
        { $pull: { values: value } }
      );
      return NextResponse.json({ message: 'Prompt option value deleted successfully' });
    } else {
      // Delete the entire option
      await db.collection("prompt_options").deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({ message: 'Prompt option deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting prompt option or value:', error);
    return NextResponse.json({ error: 'Failed to delete prompt option or value' }, { status: 500 });
  }
}
